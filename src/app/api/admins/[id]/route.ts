import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const admin = await prisma.admin.update({
      where: { id },
      data: { role: body.role ?? undefined },
    });
    return NextResponse.json(admin);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update admin';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.admin.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete admin';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
