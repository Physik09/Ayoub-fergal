import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  const [admins, total] = await Promise.all([
    prisma.admin.findMany({
      skip,
      take: limit,
      include: {
        user: {
          select: { id: true, email: true, name: true, phone: true, image: true, createdAt: true },
        },
      },
      orderBy: { user: { createdAt: 'desc' } },
    }),
    prisma.admin.count(),
  ]);
  return NextResponse.json({ admins, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = adminSchema.parse(body);

    const existing = await prisma.admin.findUnique({ where: { userId: parsed.userId } });
    if (existing) {
      return NextResponse.json({ error: 'User is already an admin' }, { status: 409 });
    }

    const admin = await prisma.admin.create({
      data: parsed,
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    });
    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Failed to create admin';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
