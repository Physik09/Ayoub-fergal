import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    // Try uploading to Supabase Storage when service role key is available
    if (serviceRoleKey && supabaseUrl) {
      const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false },
      });

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filename, buffer, {
          contentType: file.type || `image/${ext}`,
          cacheControl: '3600',
          upsert: false,
        });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('products')
          .getPublicUrl(filename);

        return NextResponse.json({ url: urlData.publicUrl });
      }

      console.warn('[Upload] Supabase Storage upload failed, falling back to local:', uploadError.message);
    }

    // Fall back to local filesystem upload
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
