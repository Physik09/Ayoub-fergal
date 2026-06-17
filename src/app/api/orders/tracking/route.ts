import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get('orderNumber');
  const phone = searchParams.get('phone');

  if (!orderNumber || !phone) {
    return NextResponse.json(
      { error: 'orderNumber and phone are required' },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order || order.customerPhone !== phone) {
    return NextResponse.json(
      { error: 'Commande introuvable. Vérifiez vos informations.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ order });
}
