import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { productSchema } from '@/lib/validations';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      supplier: true,
      variants: true,
    },
  });
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = productSchema.partial().parse(body);

    const product = await prisma.product.update({
      where: { id },
      data: {
        slug: parsed.slug,
        nameFr: parsed.nameFr,
        nameAr: parsed.nameAr,
        descriptionFr: parsed.descriptionFr || null,
        descriptionAr: parsed.descriptionAr || null,
        categoryId: parsed.categoryId,
        supplierId: parsed.supplierId || null,
        costPrice: parsed.costPrice || null,
        sellPrice: parsed.sellPrice,
        images: parsed.images || [],
        status: parsed.status || 'DRAFT',
        featured: parsed.featured || false,
      },
    });

    if (parsed.variants) {
      await prisma.productVariant.deleteMany({ where: { productId: id } });
      await prisma.productVariant.createMany({
        data: parsed.variants.map((v) => ({
          productId: id,
          size: v.size || null,
          color: v.color || null,
          colorHex: v.colorHex || null,
          stock: v.stock || 0,
          sku: v.sku || '',
        })),
      });
    }

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Failed to update product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
