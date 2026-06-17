import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const promoCode = await prisma.promoCode.update({
      where: { id },
      data: {
        code: body.code?.toUpperCase(),
        type: body.type,
        value: body.value,
        minOrderAmount: body.minOrderAmount,
        maxUses: body.maxUses,
        isActive: body.isActive,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      },
    });
    return NextResponse.json(promoCode);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update promo code';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.promoCode.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete promo code';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
