import { NextResponse } from 'next/server';
import { fetchChannelInfo } from '@/lib/youtube';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const channel = await fetchChannelInfo();
    return NextResponse.json({ channel, source: process.env.YT_API_KEY ? 'api' : 'mock' });
  } catch {
    return NextResponse.json({ error: 'YouTube API 오류' }, { status: 500 });
  }
}
