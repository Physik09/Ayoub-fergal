import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    const admin = await prisma.admin.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({ isAdmin: !!admin, role: admin?.role || null });
  } catch {
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}
