// 파일 경로: src/app/api/admin/collections/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

async function requireAuth(request: NextRequest) {
  const authClient = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await authClient.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// GET: 전체 컬렉션 조회
export async function GET(request: NextRequest) {
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  const { data, error } = await supabaseAdmin
    .from('collections')
    .select('id, name, description, thumbnail_url, thumbnail2_url')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}

// POST: 컬렉션 추가
export async function POST(request: NextRequest) {
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  try {
    const { name, description, thumbnail_url, thumbnail2_url } = await request.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: '컬렉션 이름은 필수입니다.' }, { status: 400 });
    }
    const { data, error } = await supabaseAdmin
      .from('collections')
      .insert([{
        name: name.trim(),
        description: description?.trim() || '',
        thumbnail_url: thumbnail_url || null,
        thumbnail2_url: thumbnail2_url || null,
      }])
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || '서버 오류' }, { status: 500 });
  }
}

// PATCH: 컬렉션 수정
export async function PATCH(request: NextRequest) {
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    const { name, description, thumbnail_url, thumbnail2_url } = await request.json();
    const updates: Record<string, any> = {};
    if (name) updates.name = name.trim();
    if (description !== undefined) updates.description = description.trim();
    if (thumbnail_url !== undefined) updates.thumbnail_url = thumbnail_url || null;
    if (thumbnail2_url !== undefined) updates.thumbnail2_url = thumbnail2_url || null;

    const { data, error } = await supabaseAdmin
      .from('collections')
      .update(updates)
      .eq('id', parseInt(id, 10))
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || '서버 오류' }, { status: 500 });
  }
}

// DELETE: 컬렉션 삭제
export async function DELETE(request: NextRequest) {
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  const { error } = await supabaseAdmin
    .from('collections')
    .delete()
    .eq('id', parseInt(id, 10));
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true }, { status: 200 });
}
