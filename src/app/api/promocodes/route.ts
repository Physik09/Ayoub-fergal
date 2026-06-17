import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { promoCodeSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  const [promocodes, total] = await Promise.all([
    prisma.promoCode.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.promoCode.count(),
  ]);
  return NextResponse.json({ promocodes, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = promoCodeSchema.parse({ ...body, code: body.code?.toUpperCase() });
    const promoCode = await prisma.promoCode.create({
      data: {
        ...parsed,
        expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
      },
    });
    return NextResponse.json(promoCode, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Failed to create promo code';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
