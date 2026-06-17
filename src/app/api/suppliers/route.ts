import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supplierSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  const [suppliers, total] = await Promise.all([
    prisma.supplier.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      skip,
      take: limit,
      include: { _count: { select: { products: true } } },
    }),
    prisma.supplier.count({ where: { isActive: true } }),
  ]);
  return NextResponse.json({ suppliers, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = supplierSchema.parse(body);
    const supplier = await prisma.supplier.create({ data: parsed });
    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Failed to create supplier';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
