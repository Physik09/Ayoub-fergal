import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPaymentProvider } from '@/lib/payments/provider';
import { CURRENCY } from '@/lib/payments/index';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, method = 'mock' } = body;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const provider = getPaymentProvider(method);
    const result = await provider.processPayment({
      orderNumber: order.orderNumber,
      amount: order.total,
      currency: CURRENCY,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      description: `Commande ${order.orderNumber}`,
    });

    if (result.success && result.reference) {
      await prisma.payment.create({
        data: {
          orderId: order.id,
          method: 'ONLINE',
          amount: order.total,
          status: 'PAID',
          gatewayReference: result.reference,
          gatewayResponse: { provider: method },
        },
      });

      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
        },
      });
    }

    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Payment processing failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
