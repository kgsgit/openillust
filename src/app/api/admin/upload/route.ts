// 파일 경로: src/app/api/admin/upload/route.ts

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
  // 인증 체크
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  const form = await request.formData();
  const title = form.get('title') as string;
  const description = form.get('description') as string;
  const collectionId = form.get('collection_id') as string;
  const tags = JSON.parse(form.get('tags') as string);
  const visible = form.get('visible') === 'true';
  const file = form.get('file') as File | null;

  if (!title || !collectionId) {
    return NextResponse.json(
      { error: 'Missing title or collection_id' },
      { status: 400 }
    );
  }

  let publicUrl: string | null = null;
  if (file) {
    const path = `images/${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } =
      await supabaseAdmin.storage
        .from('illustrations')
        .upload(path, file, {
          upsert: false,
          cacheControl: '31536000',  // 숫자 → 문자열
          contentType: file.type,
        });
    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }
    const { data: urlData } = supabaseAdmin.storage
      .from('illustrations')
      .getPublicUrl(uploadData.path);
    publicUrl = urlData.publicUrl;
  }

  const { error: dbError } = await supabaseAdmin
    .from('illustrations')
    .insert([
      {
        title,
        description,
        image_url: publicUrl,
        collection_id: parseInt(collectionId, 10),
        tags,
        visible,
      },
    ]);
  if (dbError) {
    return NextResponse.json(
      { error: dbError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  // 인증 체크
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  const { searchParams } = request.nextUrl;
  const replaceId = searchParams.get('replaceId');
  if (!replaceId) {
    return NextResponse.json(
      { error: 'Missing replaceId' },
      { status: 400 }
    );
  }

  const form = await request.formData();
  const title = form.get('title') as string;
  const description = form.get('description') as string;
  const collectionId = form.get('collection_id') as string;
  const tags = JSON.parse(form.get('tags') as string);
  const visible = form.get('visible') === 'true';
  const file = form.get('file') as File | null;

  if (!title || !collectionId) {
    return NextResponse.json(
      { error: 'Missing title or collection_id' },
      { status: 400 }
    );
  }

  const updates: Record<string, any> = {
    title,
    description,
    collection_id: parseInt(collectionId, 10),
    tags,
    visible,
  };

  if (file) {
    const path = `images/${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } =
      await supabaseAdmin.storage
        .from('illustrations')
        .upload(path, file, {
          upsert: true,
          cacheControl: '31536000',  // 숫자 → 문자열
          contentType: file.type,
        });
    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }
    const { data: urlData } = supabaseAdmin.storage
      .from('illustrations')
      .getPublicUrl(uploadData.path);
    updates.image_url = urlData.publicUrl;
  }

  const { error: dbError } = await supabaseAdmin
    .from('illustrations')
    .update(updates)
    .eq('id', parseInt(replaceId, 10));
  if (dbError) {
    return NextResponse.json(
      { error: dbError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  // 인증 체크
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  const { searchParams } = request.nextUrl;
  const deleteId = searchParams.get('deleteId');
  if (!deleteId) {
    return NextResponse.json(
      { error: 'Missing deleteId' },
      { status: 400 }
    );
  }

  const id = parseInt(deleteId, 10);

  // download_logs에서 관련 로그 먼저 삭제
  const { error: deleteLogsError } = await supabaseAdmin
    .from('download_logs')
    .delete()
    .eq('illustration_id', id);
  if (deleteLogsError) {
    return NextResponse.json(
      { error: deleteLogsError.message },
      { status: 500 }
    );
  }

  // illustrations에서 삭제
  const { error } = await supabaseAdmin
    .from('illustrations')
    .delete()
    .eq('id', id);
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
