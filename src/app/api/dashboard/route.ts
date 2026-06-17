import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const [
    totalOrders,
    totalRevenue,
    pendingCOD,
    lowStockCount,
    ordersByStatus,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.count({ where: { paymentMethod: 'COD', paymentStatus: 'PENDING' } }),
    prisma.productVariant.count({ where: { stock: { lte: 5 } } }),
    prisma.order.groupBy({ by: ['status'], _count: true }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { orderNumber: true, customerName: true, total: true, status: true, createdAt: true },
    }),
  ]);

  return NextResponse.json({
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    pendingCOD,
    lowStockCount,
    ordersByStatus,
    recentOrders,
  });
}
