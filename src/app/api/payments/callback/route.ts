import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, status, reference } = body;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const paymentStatus = status === 'success' ? 'PAID' : 'FAILED';

    await prisma.payment.create({
      data: {
        orderId: order.id,
        method: 'ONLINE',
        amount: order.total,
        status: paymentStatus,
        gatewayReference: reference || null,
        gatewayResponse: body,
      },
    });

    if (paymentStatus === 'PAID') {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Callback failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
