import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { notifyOrderConfirmed } from '@/lib/notifications';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;
  const status = searchParams.get('status');

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: { items: true },
    }),
    prisma.order.count({ where }),
  ]);
  return NextResponse.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerEmail, address, city, region, deliveryFee, subtotal, discount, total, paymentMethod, promoCodeId, items } = body;

    if (!customerName || !customerPhone || !city || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const variantIds = items.map((i: { variantId: string | null }) => i.variantId).filter(Boolean);
    if (variantIds.length > 0) {
      const variants = await prisma.productVariant.findMany({
        where: { id: { in: variantIds as string[] } },
      });
      const variantMap = new Map(variants.map((v) => [v.id, v]));
      for (const item of items) {
        if (item.variantId) {
          const variant = variantMap.get(item.variantId);
          if (!variant) {
            return NextResponse.json({ error: `Variant ${item.variantId} not found` }, { status: 400 });
          }
          if (variant.stock < item.quantity) {
            return NextResponse.json({ error: `Insufficient stock for ${item.productName}` }, { status: 409 });
          }
        }
      }
    }

    const orderNumber = `AF-${Date.now().toString(36).toUpperCase()}`;

    const order = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      if (promoCodeId) {
        const promoCode = await tx.promoCode.findUnique({ where: { id: promoCodeId } });
        if (promoCode) {
          await tx.promoCode.update({
            where: { id: promoCodeId },
            data: { usedCount: { increment: 1 } },
          });
        }
      }

      return tx.order.create({
        data: {
          orderNumber,
          customerName,
          customerPhone,
          customerEmail: customerEmail || null,
          address: address || {},
          city,
          region: region || city,
          deliveryMethod: 'STANDARD',
          deliveryFee: deliveryFee || 0,
          subtotal: subtotal || 0,
          discount: discount || 0,
          total: total || 0,
          paymentMethod: paymentMethod || 'COD',
          paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
          status: 'PENDING',
          promoCodeId: promoCodeId || null,
          items: {
            create: items.map((item: { productId: string; variantId: string | null; productName: string; quantity: number; unitPrice: number; totalPrice: number }) => ({
              productId: item.productId,
              variantId: item.variantId || null,
              productName: item.productName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
            })),
          },
        },
        include: { items: true },
      });
    });

    notifyOrderConfirmed(order).catch((err) => {
      console.error('Notification failed:', err);
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
