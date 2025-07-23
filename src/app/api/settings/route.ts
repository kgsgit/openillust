// 파일 경로: src/app/api/settings/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

type SettingEntry = { key: string; value: string };

export async function GET(request: NextRequest) {
  const { data, error } = await supabaseAdmin
    .from('settings')
    .select('key, value');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const settings: Record<string, string> = {};
  (data ?? []).forEach((item: any) => {
    settings[item.key] = item.value;
  });

  return NextResponse.json(settings);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Record<string, string>;
  const entries: SettingEntry[] = Object.entries(body).map(
    ([key, value]) => ({ key, value })
  );

  // upsert 인자 타입 불일치 우회를 위해 any 캐스트
  const { error } = await (supabaseAdmin as any)
    .from('settings')
    .upsert(entries as any, { onConflict: 'key' });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
