import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      name: string;
      phone: string;
      service: string;
      preferDate?: string;
      detail?: string;
      imageUrls?: string[];
    };

    const { name, phone, service, preferDate, detail, imageUrls } = body;

    if (!name?.trim() || !phone?.trim() || !service?.trim()) {
      return NextResponse.json({ error: '필수 항목을 입력해 주세요.' }, { status: 400 });
    }

    const quote = await prisma.quoteRequest.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        service: service.trim(),
        preferDate: preferDate?.trim() || null,
        detail: detail?.trim() || null,
        imageUrls: imageUrls ?? [],
      },
    });

    return NextResponse.json({ ok: true, id: quote.id }, { status: 201 });
  } catch (err) {
    console.error('[quote/POST]', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
