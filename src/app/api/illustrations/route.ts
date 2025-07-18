// 파일 경로: src/app/api/illustrations/route.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

export async function GET(request: NextRequest) {
  const { data, error } = await supabaseAdmin
    .from('illustrations')
    .select(`
      *,
      collections (
        id,
        name
      )
    `)
    .eq('visible', true)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}
