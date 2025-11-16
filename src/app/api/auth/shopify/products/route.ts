import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getActiveShopForUser } from '@/lib/shop';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const shop = await getActiveShopForUser(session.user.id);
  if (!shop) {
    return new NextResponse('No shop connected', { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const page = Number(searchParams.get('page') || '1');
  const pageSize = 20;

  const where = {
    shopId: shop.id,
    ...(q
      ? {
          title: {
            contains: q,
            mode: 'insensitive' as const,
          },
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.productCache.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.productCache.count({ where }),
  ]);

  const hasMore = page * pageSize < total;

  return NextResponse.json({
    items,
    page,
    hasMore,
  });
}
