// src/app/api/admin/tags/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabaseAdminClient'

async function requireAuth(req: NextRequest) {
  const auth = createRouteHandlerClient({ cookies })
  const {
    data: { session },
  } = await auth.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

// DELETE /api/admin/tags/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // 1) 인증
  const unauth = await requireAuth(req)
  if (unauth) return unauth

  // 2) ID 유효성 검사 & 숫자 변환
  const idStr = params.id
  if (!idStr) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }
  const id = parseInt(idStr, 10)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  // 3) 삭제
  const { error } = await supabaseAdmin
    .from('tags')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true }, { status: 200 })
}
