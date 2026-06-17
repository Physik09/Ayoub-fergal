import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { bannerSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  const [banners, total] = await Promise.all([
    prisma.banner.findMany({
      skip,
      take: limit,
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.banner.count(),
  ]);
  return NextResponse.json({ banners, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bannerSchema.parse(body);
    const banner = await prisma.banner.create({ data: parsed });
    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Failed to create banner';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
