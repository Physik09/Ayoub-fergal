import { NextRequest, NextResponse } from 'next/server';
import { searchProductImages } from '@/lib/images';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, categorySlug, colorHint } = body;

    if (!name || !categorySlug) {
      return NextResponse.json(
        { error: 'name and categorySlug are required' },
        { status: 400 }
      );
    }

    const results = await searchProductImages({
      name,
      categorySlug,
      colorHint,
      preferredProvider: 'pexels',
    });

    return NextResponse.json({ images: results });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch images';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
