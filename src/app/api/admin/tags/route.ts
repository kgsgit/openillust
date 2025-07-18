// src/app/api/admin/tags/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabaseAdminClient'

async function requireAuth(req: NextRequest) {
  const auth = createRouteHandlerClient({ cookies })
  const {
    data: { session },
  } = await auth.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

export async function GET(req: NextRequest) {
  if (await requireAuth(req)) return requireAuth(req)
  const { data, error } = await supabaseAdmin.from('tags').select('id,name')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 200 })
}

export async function POST(req: NextRequest) {
  if (await requireAuth(req)) return requireAuth(req)
  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: '이름을 입력하세요.' }, { status: 400 })
  const { data, error } = await supabaseAdmin.from('tags').insert({ name: name.trim() }).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data[0], { status: 201 })
}
