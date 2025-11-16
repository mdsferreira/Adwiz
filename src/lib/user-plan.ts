import { prisma } from './prisma';
import { FREE_WEEKLY_AD_LIMIT, getCurrentWeekStart } from './billing';

export async function getUserPlanAndUsage(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      plan: true,
      shops: {
        select: { id: true },
      },
    },
  });

  if (!user) throw new Error('User not found');

  const tier = user.plan?.tier ?? 'FREE';

  const shopIds = user.shops.map((s) => s.id);
  const weekStart = getCurrentWeekStart();

  const weeklyGenerations = await prisma.adDraft.count({
    where: {
      shopId: { in: shopIds },
      createdAt: { gte: weekStart },
    },
  });

  const limit = tier === 'FREE' ? FREE_WEEKLY_AD_LIMIT : Infinity;
  const remaining = tier === 'FREE' ? Math.max(limit - weeklyGenerations, 0) : Infinity;

  return {
    tier,
    weeklyGenerations,
    limit,
    remaining,
  };
}
