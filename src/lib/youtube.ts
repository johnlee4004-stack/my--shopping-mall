export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  duration: string;       // ISO 8601 → "8:24" 변환 후
  tags: string[];
  url: string;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
  customUrl: string;
}

const API_KEY = process.env.YT_API_KEY ?? '';
const CHANNEL_ID = process.env.YT_CHANNEL_ID ?? '';
const BASE = 'https://www.googleapis.com/youtube/v3';

function parseDuration(iso: string): string {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return '0:00';
  const h = parseInt(m[1] ?? '0');
  const min = parseInt(m[2] ?? '0');
  const s = parseInt(m[3] ?? '0').toString().padStart(2, '0');
  return h > 0 ? `${h}:${min.toString().padStart(2, '0')}:${s}` : `${min}:${s}`;
}

function formatCount(n: string): string {
  const num = parseInt(n ?? '0');
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export async function fetchChannelVideos(maxResults = 12): Promise<YouTubeVideo[]> {
  if (!API_KEY || !CHANNEL_ID) return MOCK_VIDEOS;

  // 1) 최신 영상 ID 목록
  const searchRes = await fetch(
    `${BASE}/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${maxResults}&order=date&type=video&key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  );
  if (!searchRes.ok) return MOCK_VIDEOS;
  const searchData = await searchRes.json();
  const ids: string[] = searchData.items.map((i: { id: { videoId: string } }) => i.id.videoId);

  // 2) 상세 정보 (통계 + 콘텐츠 세부)
  const detailRes = await fetch(
    `${BASE}/videos?part=snippet,statistics,contentDetails&id=${ids.join(',')}&key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  );
  if (!detailRes.ok) return MOCK_VIDEOS;
  const detailData = await detailRes.json();

  return detailData.items.map((v: {
    id: string;
    snippet: { title: string; description: string; thumbnails: { maxres?: { url: string }; high: { url: string } }; publishedAt: string; tags?: string[] };
    statistics: { viewCount: string; likeCount: string };
    contentDetails: { duration: string };
  }) => ({
    id: v.id,
    title: v.snippet.title,
    description: v.snippet.description,
    thumbnail: v.snippet.thumbnails.maxres?.url ?? v.snippet.thumbnails.high.url,
    publishedAt: v.snippet.publishedAt,
    viewCount: formatCount(v.statistics.viewCount),
    likeCount: formatCount(v.statistics.likeCount),
    duration: parseDuration(v.contentDetails.duration),
    tags: v.snippet.tags?.slice(0, 3) ?? [],
    url: `https://www.youtube.com/watch?v=${v.id}`,
  }));
}

export async function fetchChannelInfo(): Promise<YouTubeChannel | null> {
  if (!API_KEY || !CHANNEL_ID) return MOCK_CHANNEL;

  const res = await fetch(
    `${BASE}/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${API_KEY}`,
    { next: { revalidate: 86400 } }
  );
  if (!res.ok) return MOCK_CHANNEL;
  const data = await res.json();
  const ch = data.items?.[0];
  if (!ch) return null;

  return {
    id: ch.id,
    title: ch.snippet.title,
    description: ch.snippet.description,
    thumbnail: ch.snippet.thumbnails.high?.url ?? '',
    subscriberCount: formatCount(ch.statistics.subscriberCount),
    videoCount: formatCount(ch.statistics.videoCount),
    viewCount: formatCount(ch.statistics.viewCount),
    customUrl: ch.snippet.customUrl ?? '',
  };
}

// ── 개발/미리보기용 목업 데이터 ─────────────────────────────
export const MOCK_VIDEOS: YouTubeVideo[] = [
  {
    id: 'mock1',
    title: '아침 건강 루틴 공개 | 이뮨 부스터 실제 복용법',
    description: '매일 아침 5분 건강 루틴을 공개합니다. 이뮨 부스터 Pro와 함께하는 면역력 강화 방법을 알려드립니다.',
    thumbnail: '',
    publishedAt: '2026-08-01T09:00:00Z',
    viewCount: '12.4K',
    likeCount: '843',
    duration: '8:24',
    tags: ['루틴', '면역력', '건강'],
    url: 'https://www.youtube.com/watch?v=mock1',
  },
  {
    id: 'mock2',
    title: '30일 다이어트 클린즈 비포&애프터',
    description: '30일 동안 다이어트 클린즈를 복용한 실제 결과를 공개합니다.',
    thumbnail: '',
    publishedAt: '2026-07-20T09:00:00Z',
    viewCount: '8.9K',
    likeCount: '612',
    duration: '11:05',
    tags: ['다이어트', '지방연소', '클린즈'],
    url: 'https://www.youtube.com/watch?v=mock2',
  },
  {
    id: 'mock3',
    title: '수면의 질 테스트 | 슬립 & 리커버리 2주 후기',
    description: '수면 트래커로 측정한 슬립 & 리커버리 복용 전후 수면 데이터를 공개합니다.',
    thumbnail: '',
    publishedAt: '2026-07-10T09:00:00Z',
    viewCount: '6.2K',
    likeCount: '489',
    duration: '6:47',
    tags: ['수면개선', '회복', '리커버리'],
    url: 'https://www.youtube.com/watch?v=mock3',
  },
  {
    id: 'mock4',
    title: '콜라겐 먹어도 피부에 효과 없다고? 진실 공개',
    description: '콜라겐 흡수율에 대한 오해와 진실, 실제 효과를 보는 올바른 복용법을 알려드립니다.',
    thumbnail: '',
    publishedAt: '2026-07-01T09:00:00Z',
    viewCount: '21.7K',
    likeCount: '1.4K',
    duration: '14:32',
    tags: ['콜라겐', '피부', '미용'],
    url: 'https://www.youtube.com/watch?v=mock4',
  },
  {
    id: 'mock5',
    title: '장 건강이 면역력을 결정한다 | 프로바이오틱스 완벽 가이드',
    description: '장내 유익균을 늘리는 생활 습관과 프로바이오틱스 선택 기준을 정리했습니다.',
    thumbnail: '',
    publishedAt: '2026-06-25T09:00:00Z',
    viewCount: '9.3K',
    likeCount: '731',
    duration: '12:18',
    tags: ['장건강', '유산균', '면역'],
    url: 'https://www.youtube.com/watch?v=mock5',
  },
  {
    id: 'mock6',
    title: 'Omega-3 vs 크릴오일 | 혈관 건강 어떤 게 더 좋을까?',
    description: '오메가3와 크릴오일의 차이점, 흡수율, 가격 대비 효과를 비교 분석합니다.',
    thumbnail: '',
    publishedAt: '2026-06-15T09:00:00Z',
    viewCount: '15.8K',
    likeCount: '1.1K',
    duration: '9:55',
    tags: ['오메가3', '혈관', '심장건강'],
    url: 'https://www.youtube.com/watch?v=mock6',
  },
];

export const MOCK_CHANNEL: YouTubeChannel = {
  id: 'mock_channel',
  title: 'DoxHayx 건강채널',
  description: '건강기능식품 리뷰 및 건강한 라이프스타일 콘텐츠',
  thumbnail: '',
  subscriberCount: '24.1K',
  videoCount: '87',
  viewCount: '1.2M',
  customUrl: '@doxhayx',
};
