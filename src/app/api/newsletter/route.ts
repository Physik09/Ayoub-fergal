import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

    if (existing) {
      return NextResponse.json({ message: 'Déjà inscrit' });
    }

    await prisma.newsletterSubscriber.create({ data: { email } });

    return NextResponse.json({ success: true, message: 'Inscription réussie' }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to subscribe';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
