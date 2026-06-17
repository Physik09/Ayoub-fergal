import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  subject: z.string().optional().default(''),
  message: z.string().min(1, 'Message is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.parse(body);

    await prisma.contactMessage.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        subject: parsed.subject || '',
        message: parsed.message,
      },
    });

    return NextResponse.json({ success: true, message: 'Message envoyé avec succès' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    const errMsg = error instanceof Error ? error.message : 'Failed to send message';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
