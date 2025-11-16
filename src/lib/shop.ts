import { prisma } from './prisma';

export async function getActiveShopForUser(userId: string) {
  // Simple: just get first shop. Later, you can support multi-shop + a "current shop" setting.
  return prisma.shop.findFirst({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });
}
