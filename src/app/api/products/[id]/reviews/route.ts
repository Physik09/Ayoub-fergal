import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const reviews = await prisma.review.findMany({
    where: { productId: id, isApproved: true },
    orderBy: { createdAt: 'desc' },
  });
  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  return NextResponse.json({ reviews, average, count: reviews.length });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { author, rating, title, comment, userId } = body;

    if (!author || !comment) {
      return NextResponse.json({ error: 'author and comment are required' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'rating must be between 1 and 5' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId: id,
        userId: userId || null,
        author,
        rating,
        title: title || '',
        comment,
        isApproved: false,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create review';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
