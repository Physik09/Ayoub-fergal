import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const url = process.env.DATABASE_URL;
    if (!url) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL is not set',
        envVars: Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('SUPABASE') || k.includes('NEXT')),
      }, { status: 500 });
    }

    const { PrismaClient } = await import('@/generated/prisma/client');
    const { PrismaPg } = await import('@prisma/adapter-pg');
    const pg = await import('pg');

    const Pool = pg.default?.Pool ?? pg.Pool;
    const pool = new Pool({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    });

    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    const count = await prisma.product.count();
    await prisma.$disconnect();

    return NextResponse.json({ success: true, productCount: count });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
      code: err.code,
      stack: err.stack?.split('\n').slice(0, 8).join('\n'),
    }, { status: 500 });
  }
}
