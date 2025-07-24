// src/app/api/admin_qr/upload/route.ts

import { NextResponse, NextRequest } from 'next/server';
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

export async function POST(request: NextRequest) {
  // --- 인증 ---
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  // --- 입력 파싱 ---
  const form = await request.formData();
  const title = form.get('title') as string;
  const description = form.get('description') as string;
  const collectionId = form.get('collection_id') as string;
  const tags = JSON.parse(form.get('tags') as string);
  const visible = form.get('visible') === 'true';
  const file = form.get('file') as File | null;

  if (!title || !collectionId) {
    return NextResponse.json({ error: 'Missing title or collection_id' }, { status: 400 });
  }

  // --- 버킷 업로드 ---
  let publicUrl: string | null = null;
  let privatePath: string | null = null;

  if (file) {
    const filename = `${Date.now()}_${file.name}`;

    // 1) public 버킷에 업로드 (CDN 캐싱 1년)
    const { error: pubErr } = await supabaseAdmin.storage
      .from('illustrations')
      .upload(`images/${filename}`, file, {
        upsert: false,
        cacheControl: 'public, max-age=31536000',
        contentType: file.type,
      });
    if (pubErr) {
      return NextResponse.json({ error: pubErr.message }, { status: 500 });
    }
    const { data: urlData } = supabaseAdmin.storage
      .from('illustrations')
      .getPublicUrl(`images/${filename}`);
    publicUrl = urlData.publicUrl;

    // 2) private 버킷에 업로드 (짧은 TTL 메타데이터)
    const { error: privErr } = await supabaseAdmin.storage
      .from('illustrations-private')
      .upload(`images/${filename}`, file, {
        upsert: false,
        cacheControl: 'public, max-age=10',
        contentType: file.type,
      });
    if (privErr) {
      return NextResponse.json({ error: privErr.message }, { status: 500 });
    }
    privatePath = `images/${filename}`;
  }

  // --- DB에 기록 ---
  const { error: dbErr } = await supabaseAdmin
    .from('illustrations')
    .insert([{
      title,
      description,
      collection_id: parseInt(collectionId, 10),
      tags,
      visible,
      image_url: publicUrl,
      image_path: privatePath,
    }]);
  if (dbErr) {
    return NextResponse.json({ error: dbErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  // --- 인증 ---
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  // --- 쿼리 파싱 ---
  const replaceId = request.nextUrl.searchParams.get('replaceId');
  if (!replaceId) {
    return NextResponse.json({ error: 'Missing replaceId' }, { status: 400 });
  }
  const id = parseInt(replaceId, 10);

  // --- 입력 파싱 ---
  const form = await request.formData();
  const title = form.get('title') as string;
  const description = form.get('description') as string;
  const collectionId = form.get('collection_id') as string;
  const tags = JSON.parse(form.get('tags') as string);
  const visible = form.get('visible') === 'true';
  const file = form.get('file') as File | null;

  if (!title || !collectionId) {
    return NextResponse.json({ error: 'Missing title or collection_id' }, { status: 400 });
  }

  // --- 업데이트 객체 준비 ---
  const updates: Record<string, any> = {
    title,
    description,
    collection_id: parseInt(collectionId, 10),
    tags,
    visible,
  };

  if (file) {
    const filename = `${Date.now()}_${file.name}`;

    // public 버킷 업로드 (upsert: true)
    const { error: pubErr } = await supabaseAdmin.storage
      .from('illustrations')
      .upload(`images/${filename}`, file, {
        upsert: true,
        cacheControl: 'public, max-age=31536000',
        contentType: file.type,
      });
    if (pubErr) {
      return NextResponse.json({ error: pubErr.message }, { status: 500 });
    }
    const { data: urlData } = supabaseAdmin.storage
      .from('illustrations')
      .getPublicUrl(`images/${filename}`);
    updates.image_url = urlData.publicUrl;

    // private 버킷 업로드 (upsert: true)
    const { error: privErr } = await supabaseAdmin.storage
      .from('illustrations-private')
      .upload(`images/${filename}`, file, {
        upsert: true,
        cacheControl: 'public, max-age=10',
        contentType: file.type,
      });
    if (privErr) {
      return NextResponse.json({ error: privErr.message }, { status: 500 });
    }
    updates.image_path = `images/${filename}`;
  }

  // --- DB 업데이트 ---
  const { error: dbErr } = await supabaseAdmin
    .from('illustrations')
    .update(updates)
    .eq('id', id);
  if (dbErr) {
    return NextResponse.json({ error: dbErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  // --- 인증 ---
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  // --- 쿼리 파싱 ---
  const deleteId = request.nextUrl.searchParams.get('deleteId');
  if (!deleteId) {
    return NextResponse.json({ error: 'Missing deleteId' }, { status: 400 });
  }
  const id = parseInt(deleteId, 10);

  // --- 관련 로그 삭제 ---
  const { error: logsErr } = await supabaseAdmin
    .from('download_logs')
    .delete()
    .eq('illustration_id', id);
  if (logsErr) {
    return NextResponse.json({ error: logsErr.message }, { status: 500 });
  }

  // --- 레코드 삭제 ---
  const { error: dbErr } = await supabaseAdmin
    .from('illustrations')
    .delete()
    .eq('id', id);
  if (dbErr) {
    return NextResponse.json({ error: dbErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
