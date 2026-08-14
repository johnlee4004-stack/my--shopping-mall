import { NextRequest, NextResponse } from 'next/server';
import { fetchChannelVideos } from '@/lib/youtube';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const max = Math.min(
    parseInt(req.nextUrl.searchParams.get('max') ?? '6'),
    24
  );

  try {
    const videos = await fetchChannelVideos(max);
    return NextResponse.json({ videos, source: process.env.YT_API_KEY ? 'api' : 'mock' });
  } catch {
    return NextResponse.json({ error: 'YouTube API 오류' }, { status: 500 });
  }
}
