import Link from 'next/link';
import { fetchChannelVideos, fetchChannelInfo, type YouTubeVideo } from '@/lib/youtube';

export const revalidate = 3600; // 1시간 캐시

function VideoCard({ video }: { video: YouTubeVideo }) {
  const tagColors: Record<string, string> = {
    루틴: 'bg-red-900/40 text-red-400',
    면역력: 'bg-green-900/40 text-green-400',
    다이어트: 'bg-orange-900/40 text-orange-400',
    지방연소: 'bg-orange-900/40 text-orange-400',
    수면개선: 'bg-blue-900/40 text-blue-400',
    클린즈: 'bg-purple-900/40 text-purple-400',
    콜라겐: 'bg-pink-900/40 text-pink-400',
    피부: 'bg-pink-900/40 text-pink-400',
    미용: 'bg-pink-900/40 text-pink-400',
    장건강: 'bg-yellow-900/40 text-yellow-400',
    혈관: 'bg-red-900/40 text-red-400',
  };

  const tagColor = video.tags[0]
    ? (tagColors[video.tags[0]] ?? 'bg-gray-700 text-gray-400')
    : 'bg-gray-700 text-gray-400';

  const dateLabel = new Date(video.publishedAt).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gray-800 rounded-2xl overflow-hidden hover:bg-gray-750 hover:ring-1 hover:ring-red-500/40 transition-all group block"
    >
      {/* 썸네일 */}
      <div className="relative bg-gray-700 h-44 flex items-center justify-center overflow-hidden">
        {video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
            <span className="text-5xl opacity-30">▶</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl ml-1">▶</span>
          </div>
        </div>
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
          {video.duration}
        </span>
      </div>

      {/* 정보 */}
      <div className="p-4">
        <div className="flex flex-wrap gap-1 mb-2">
          {video.tags.slice(0, 2).map(tag => (
            <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${tagColors[tag] ?? 'bg-gray-700 text-gray-400'}`}>
              {tag}
            </span>
          ))}
          {!video.tags.length && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${tagColor}`}>콘텐츠</span>
          )}
        </div>
        <h3 className="font-semibold text-sm text-white mb-2 leading-snug line-clamp-2">{video.title}</h3>
        <p className="text-xs text-gray-400 line-clamp-2 mb-3">{video.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>👁 {video.viewCount}</span>
            <span>👍 {video.likeCount}</span>
          </div>
          <span>{dateLabel}</span>
        </div>
      </div>
    </a>
  );
}

export default async function YouTubePage() {
  const [videos, channel] = await Promise.all([
    fetchChannelVideos(12),
    fetchChannelInfo(),
  ]);

  const isMock = !process.env.YT_API_KEY;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-black text-sm">D</div>
            <span className="font-black text-lg">DoxHayx</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">홈</Link>
            <Link href="/products" className="text-gray-400 hover:text-white transition-colors">전체 제품</Link>
            <Link href="/youtube" className="text-red-400 font-medium">YouTube</Link>
          </nav>
          <Link href="/products" className="bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-green-700 transition-colors">
            쇼핑하기
          </Link>
        </div>
      </header>

      {/* 채널 히어로 */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-950 py-14 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-4xl flex-shrink-0">
            {channel?.thumbnail
              ? <img src={channel.thumbnail} alt={channel?.title} className="w-full h-full rounded-full object-cover" />
              : '🎬'}
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
              <h1 className="text-2xl font-black">{channel?.title ?? 'DoxHayx 건강채널'}</h1>
              {isMock && (
                <span className="text-xs bg-yellow-900/60 text-yellow-400 px-2 py-0.5 rounded-full">미리보기</span>
              )}
            </div>
            <p className="text-gray-400 text-sm mb-4 max-w-md">{channel?.description}</p>
            <div className="flex items-center gap-6 justify-center md:justify-start text-sm">
              <div className="text-center">
                <div className="font-bold text-lg text-white">{channel?.subscriberCount}</div>
                <div className="text-gray-500 text-xs">구독자</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-white">{channel?.videoCount}</div>
                <div className="text-gray-500 text-xs">동영상</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-white">{channel?.viewCount}</div>
                <div className="text-gray-500 text-xs">총 조회수</div>
              </div>
            </div>
          </div>
          <div className="md:ml-auto flex gap-3">
            <a
              href={`https://www.youtube.com/${channel?.customUrl ?? '@doxhayx'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors"
            >
              ▶ 채널 구독
            </a>
          </div>
        </div>
      </section>

      {/* 개발 모드 배너 */}
      {isMock && (
        <div className="bg-yellow-900/20 border-b border-yellow-800/40 px-4 py-3">
          <div className="max-w-6xl mx-auto text-center text-sm text-yellow-400">
            ⚠️ <strong>개발 미리보기 모드</strong> — 실제 YouTube 데이터 연동은{' '}
            <code className="bg-yellow-900/40 px-1 rounded">.env.local</code>에{' '}
            <code className="bg-yellow-900/40 px-1 rounded">YT_API_KEY</code>와{' '}
            <code className="bg-yellow-900/40 px-1 rounded">YT_CHANNEL_ID</code>를 설정하세요.
          </div>
        </div>
      )}

      {/* 영상 그리드 */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold">최신 콘텐츠</h2>
              <p className="text-gray-500 text-sm mt-1">영상에서 소개한 제품을 바로 쇼핑몰에서 구매하세요</p>
            </div>
            <span className="text-gray-600 text-sm">{videos.length}개 영상</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      </section>

      {/* 쇼핑몰 CTA */}
      <section className="py-14 px-4 bg-gray-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-3">영상에서 본 제품, 지금 바로 구매</h2>
          <p className="text-gray-400 mb-6">DoxHayx 쇼핑몰에서 영상에서 소개된 모든 제품을 확인하세요.</p>
          <Link
            href="/products"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-full font-bold text-base transition-colors"
          >
            전체 제품 보기 →
          </Link>
        </div>
      </section>
    </div>
  );
}
