import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const collection = await prisma.collection.update({
      where: { id },
      data: {
        nameFr: body.nameFr ?? undefined,
        nameAr: body.nameAr ?? undefined,
        slug: body.slug ?? undefined,
        image: body.image ?? undefined,
        sortOrder: body.sortOrder ?? undefined,
        isActive: body.isActive ?? undefined,
      },
    });
    return NextResponse.json(collection);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update collection';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.collection.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete collection';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
