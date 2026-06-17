import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { productSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const sizes = searchParams.get('sizes');
  const search = searchParams.get('search');
  const status = searchParams.get('status');
  const featured = searchParams.get('featured');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (category) {
    const ids = category.split(',');
    where.categoryId = ids.length === 1 ? ids[0] : { in: ids };
  }
  if (sizes) {
    where.variants = {
      some: {
        size: { in: sizes.split(',') },
        stock: { gt: 0 },
      },
    };
  }
  if (search) {
    where.OR = [
      { nameFr: { contains: search, mode: 'insensitive' } },
      { nameAr: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (status) where.status = status;
  if (featured === 'true') where.featured = true;
  if (minPrice || maxPrice) {
    where.sellPrice = {};
    if (minPrice) (where.sellPrice as Record<string, number>).gte = parseFloat(minPrice);
    if (maxPrice) (where.sellPrice as Record<string, number>).lte = parseFloat(maxPrice);
  }

  let orderBy: Record<string, string> = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { sellPrice: 'asc' };
  else if (sort === 'price_desc') orderBy = { sellPrice: 'desc' };
  else if (sort === 'oldest') orderBy = { createdAt: 'asc' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: true,
        variants: {
          select: { id: true, size: true, stock: true },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = productSchema.parse(body);

    const product = await prisma.product.create({
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

    if (parsed.variants && parsed.variants.length > 0) {
      await prisma.productVariant.createMany({
        data: parsed.variants.map((v) => ({
          productId: product.id,
          size: v.size || null,
          color: v.color || null,
          colorHex: v.colorHex || null,
          stock: v.stock || 0,
          sku: v.sku || '',
        })),
      });
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
