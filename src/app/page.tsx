import Link from 'next/link';
import { fetchChannelVideos } from '@/lib/youtube';

export const revalidate = 3600;

const categories = [
  { name: '면역력', icon: '🛡️', count: 3 },
  { name: '체중관리', icon: '🔥', count: 2 },
  { name: '수면/회복', icon: '🌙', count: 2 },
  { name: '피부/미용', icon: '✨', count: 2 },
  { name: '장건강', icon: '🦠', count: 3 },
  { name: '혜관/심장', icon: '🐟', count: 2 },
];

const featured = [
  { id: 1, name: '이뮨 부스터 Pro', price: 89000, original: 120000, icon: '🛡️', tag: 'BEST', rating: 4.8, sold: 1240 },
  { id: 2, name: '다이어트 클린즈', price: 69000, original: 89000, icon: '🔥', tag: 'NEW', rating: 4.6, sold: 430 },
  { id: 3, name: '슬립 & 리커버리', price: 79000, original: 99000, icon: '🌙', tag: '', rating: 4.9, sold: 890 },
  { id: 4, name: '콜라겐 뼷티 복합', price: 99000, original: 130000, icon: '✨', tag: '', rating: 4.8, sold: 670 },
];

export default async function Home() {
  const videos = await fetchChannelVideos(3);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-black text-sm">D</div>
            <span className="font-black text-lg">DoxHayx 쇼핑맰</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">홈</Link>
            <Link href="/products" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">전체 제품</Link>
            <Link href="/youtube" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">YouTube 콘텐츠</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button className="text-gray-500 dark:text-gray-400 text-sm">🔍</button>
            <button className="bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-medium">구매하기</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-black text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-red-400 text-sm font-medium">▶ YouTube 콘텐츠 연동 스토어</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              영상에서 보고<br />
              <span className="text-green-400">지금 바로 구매</span>
            </h1>
            <p className="text-gray-400 mb-6 text-lg">콘텐츠에서 소개한 바로 그 제품. DoxHayx 유튜브 채널에서 직접 확인하고 스토어에서 매일을 시작하세요.</p>
            <div className="flex gap-3">
              <Link href="/products" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-bold transition-colors">
                제품 보기
              </Link>
              <a href="#youtube" className="border border-gray-600 hover:border-gray-400 text-gray-300 px-6 py-3 rounded-full font-bold transition-colors">
                YouTube 살펴보기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold mb-5">카테고리</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <button key={cat.name} className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all">
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                <span className="text-xs text-gray-400">{cat.count}종</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">인기 제품</h2>
            <Link href="/products" className="text-sm text-green-600 dark:text-green-400 hover:underline">전체 보기 →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p) => (
              <div key={p.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-lg hover:border-green-400/40 transition-all">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 h-24 flex items-center justify-center">
                  <span className="text-4xl">{p.icon}</span>
                </div>
                <div className="p-4">
                  {p.tag && (
                    <span className={`text-xs px-2 py-0.5 rounded-full mb-2 inline-block font-medium ${
                      p.tag === 'BEST' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' :
                      'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                    }`}>{p.tag}</span>
                  )}
                  <h3 className="font-bold text-sm mb-1">{p.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs text-gray-500">{p.rating} ({p.sold.toLocaleString()}님)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm">₩{p.price.toLocaleString()}</div>
                      <div className="text-xs text-gray-400 line-through">₩{p.original.toLocaleString()}</div>
                    </div>
                    <button className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-xl hover:bg-green-700 transition-colors">구매</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Content Section */}
      <section id="youtube" className="py-10 px-4 bg-gray-900 dark:bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-red-500 text-2xl">▶</span>
              <div>
                <h2 className="text-xl font-bold">YouTube 연동 콘텐츠</h2>
                <p className="text-gray-400 text-sm">영상에서 소개한 제품을 바로 구매하세요</p>
              </div>
            </div>
            <Link href="/youtube" className="text-sm text-red-400 hover:text-red-300 transition-colors">
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videos.map((video) => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 rounded-2xl overflow-hidden hover:ring-1 hover:ring-red-500/40 transition-all group block"
              >
                <div className="relative bg-gray-700 h-36 flex items-center justify-center">
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl opacity-20">▶</span>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl ml-1">▶</span>
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">{video.duration}</span>
                </div>
                <div className="p-4">
                  {video.tags[0] && (
                    <span className="text-xs px-2 py-0.5 rounded-full mb-2 inline-block bg-red-900/40 text-red-400">
                      {video.tags[0]}
                    </span>
                  )}
                  <h3 className="font-semibold text-sm mb-2 leading-snug line-clamp-2">{video.title}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>👁 {video.viewCount}</span>
                    <span>{video.duration}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-black text-sm">D</div>
                <span className="font-black text-white">DoxHayx</span>
              </div>
              <p className="text-sm max-w-xs">유튜브 콘텐츠와 연계된 건강기능식품 직접 판매 쇼핑맰</p>
            </div>
            <div className="flex gap-8 text-sm">
              <div>
                <div className="text-white font-semibold mb-2">쇼핑맰</div>
                <div className="space-y-1"><div>전체 제품</div><div>신규입점</div><div>베스트 셀러</div></div>
              </div>
              <div>
                <div className="text-white font-semibold mb-2">콘텐츠</div>
                <div className="space-y-1"><div>YouTube</div><div>Instagram</div><div>TikTok</div></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-xs text-center">
            © 2026 DoxHayx. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
