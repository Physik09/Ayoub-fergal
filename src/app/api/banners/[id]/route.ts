import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        titleFr: body.titleFr ?? undefined,
        titleAr: body.titleAr ?? undefined,
        subtitleFr: body.subtitleFr ?? undefined,
        subtitleAr: body.subtitleAr ?? undefined,
        imageUrl: body.imageUrl ?? undefined,
        linkUrl: body.linkUrl ?? undefined,
        sortOrder: body.sortOrder ?? undefined,
        isActive: body.isActive ?? undefined,
      },
    });
    return NextResponse.json(banner);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update banner';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete banner';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
