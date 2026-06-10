import { NextRequest, NextResponse } from 'next/server';

const EDGE_FN_URL = 'https://gojxekotqwabacvodmvx.supabase.co/functions/v1/submit-quote';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, phone, service } = body as Record<string, string>;
    if (!name?.trim() || !phone?.trim() || !service?.trim()) {
      return NextResponse.json({ error: '필수 항목을 입력해 주세요.' }, { status: 400 });
    }

    const res = await fetch(EDGE_FN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[quote/POST]', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
