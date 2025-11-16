import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, verifyHmac, fetchShopProducts } from '@/lib/shopify';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const params = requestUrl.searchParams;

  const shop = params.get('shop');
  const code = params.get('code');

  if (!shop || !code) {
    return new NextResponse('Missing shop or code', { status: 400 });
  }

  if (!verifyHmac(params)) {
    return new NextResponse('Invalid HMAC', { status: 400 });
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    // must be logged in to connect a shop
    return NextResponse.redirect(`${process.env.APP_URL}/auth/needs-login`);
  }

  try {
    const accessToken = await exchangeCodeForToken(shop, code);

    const shopRecord = await prisma.shop.upsert({
      where: { shopDomain: shop },
      create: {
        shopDomain: shop,
        accessToken,
        userId: session.user.id,
      },
      update: {
        accessToken,
        userId: session.user.id,
      },
    });

    const products = await fetchShopProducts(shop, accessToken);

    await Promise.all(
      products.map((p) =>
        prisma.productCache.upsert({
          where: { shopifyId: String(p.id) },
          create: {
            shopId: shopRecord.id,
            shopifyId: String(p.id),
            title: p.title,
            imageUrl: p.images?.[0]?.src ?? null,
            price: p.variants?.[0]?.price ?? null,
            tags: p.tags ?? null,
            vendor: p.vendor ?? null,
          },
          update: {
            title: p.title,
            imageUrl: p.images?.[0]?.src ?? null,
            price: p.variants?.[0]?.price ?? null,
            tags: p.tags ?? null,
            vendor: p.vendor ?? null,
          },
        }),
      ),
    );

    return NextResponse.redirect(`${process.env.APP_URL}/dashboard`);
  } catch (err) {
    console.error(err);
    return new NextResponse('Error during Shopify auth', { status: 500 });
  }
}
