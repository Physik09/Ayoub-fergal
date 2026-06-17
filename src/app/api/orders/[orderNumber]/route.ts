import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { notifyOrderShipped } from '@/lib/notifications';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  return NextResponse.json({ order });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    const existing = await prisma.order.findUnique({ where: { orderNumber } });
    if (!existing) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const body = await request.json();
    const statusChanged = body.status && body.status !== existing.status;

    if (statusChanged && body.status === 'CANCELLED') {
      const items = await prisma.orderItem.findMany({ where: { orderId: existing.id } });
      for (const item of items) {
        if (item.variantId) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    }

    const order = await prisma.order.update({
      where: { orderNumber },
      data: {
        status: body.status ?? undefined,
        paymentStatus: body.paymentStatus ?? undefined,
        adminNotes: body.adminNotes ?? undefined,
      },
    });

    if (body.status === 'SHIPPED' && existing.status !== 'SHIPPED') {
      notifyOrderShipped(order).catch((err) => {
        console.error('Shipping notification failed:', err);
      });
    }

    return NextResponse.json({ order });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
