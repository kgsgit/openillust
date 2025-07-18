// src/app/api/tags/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdminClient'

export async function GET() {
  const { data, error } = await supabaseAdmin.from('tags').select('id,name')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 200 })
}

export async function POST(request: Request) {
  const { name } = await request.json()
  if (!name?.trim()) return NextResponse.json({ error: '이름을 입력하세요.' }, { status: 400 })
  const { data, error } = await supabaseAdmin.from('tags').insert({ name: name.trim() }).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data[0], { status: 201 })
}
