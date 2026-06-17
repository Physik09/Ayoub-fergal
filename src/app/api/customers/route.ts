import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: { _count: { select: { orders: true, addresses: true } } },
    }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
  ]);
  return NextResponse.json({ customers, total, page, totalPages: Math.ceil(total / limit) });
}
