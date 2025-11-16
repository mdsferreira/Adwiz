import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateAds } from '@/lib/llm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getActiveShopForUser } from '@/lib/shop';
import { getUserPlanAndUsage } from '@/lib/user-plan';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const shop = await getActiveShopForUser(session.user.id);
  if (!shop) {
    return new NextResponse('No shop connected', { status: 400 });
  }

  const { tier, remaining } = await getUserPlanAndUsage(session.user.id);

  if (tier === 'FREE' && remaining <= 0) {
    return NextResponse.json(
      {
        error: 'LIMIT_REACHED',
        message:
          'You reached the weekly limit on ad generations for the Free plan. Upgrade to Pro to continue.',
      },
      { status: 402 }, // payment required
    );
  }

  const body = await req.json();
  const { productId, platforms, tone = 'neutral', numVariants = 3 } = body;

  if (!productId || !platforms?.length) {
    return new NextResponse('Missing productId or platforms', { status: 400 });
  }

  const product = await prisma.productCache.findFirst({
    where: { id: productId, shopId: shop.id },
  });

  if (!product) {
    return new NextResponse('Product not found', { status: 404 });
  }

  const llmResult = await generateAds({
    product: {
      title: product.title,
      price: product.price,
      tags: product.tags,
      vendor: product.vendor,
    },
    platforms,
    tone,
    numVariants,
  });

  const drafts: any[] = [];

  if (llmResult.meta) {
    const metaDraft = await prisma.adDraft.create({
      data: {
        shopId: shop.id,
        productId: product.id,
        platform: 'META',
        variants: llmResult.meta.variants,
        audiences: llmResult.meta.audiences,
      },
    });
    drafts.push(metaDraft);
  }

  if (llmResult.google) {
    const googleDraft = await prisma.adDraft.create({
      data: {
        shopId: shop.id,
        productId: product.id,
        platform: 'GOOGLE',
        variants: llmResult.google.variants,
        audiences: llmResult.google.audiences,
      },
    });
    drafts.push(googleDraft);
  }

  return NextResponse.json({
    drafts,
    plan: tier,
  });
}
