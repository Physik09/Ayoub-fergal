import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { collectionSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  const [collections, total] = await Promise.all([
    prisma.collection.findMany({
      skip,
      take: limit,
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.collection.count(),
  ]);
  return NextResponse.json({ collections, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = collectionSchema.parse(body);
    const collection = await prisma.collection.create({ data: parsed });
    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Failed to create collection';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
