import Link from 'next/link';

const products = [
  { id: 1, name: '이뮨 부스터 Pro', cat: '면역력', price: 89000, original: 120000, icon: '🛡️', tag: 'BEST', rating: 4.8, reviews: 234, desc: '비타민 C, 아연, 에키나시아 복합 면역 강화 포뮤러' },
  { id: 2, name: '다이어트 클린즈', cat: '체중관리', price: 69000, original: 89000, icon: '🔥', tag: 'NEW', rating: 4.6, reviews: 89, desc: '체중관리를 돕는 천연 식물성 포뮤러' },
  { id: 3, name: '슬립 & 리커버리', cat: '수면/회복', price: 79000, original: 99000, icon: '🌙', tag: '', rating: 4.9, reviews: 178, desc: '마그네슈 & L-테아니 수면 지원 포뮤러' },
  { id: 4, name: '오메가-3 프리미엄', cat: '혈관/심장', price: 59000, original: 75000, icon: '🐟', tag: '', rating: 4.7, reviews: 312, desc: 'rTG 형태의 고순도 EPA+DHA 포뮤러' },
  { id: 5, name: '콜라겐 뷰티 복합', cat: '피부/미용', price: 99000, original: 130000, icon: '✨', tag: '', rating: 4.8, reviews: 156, desc: '저분자 콜라겐 + 히알루론산 피부 탄력 & 보습' },
  { id: 6, name: '프로바이오틱스 50억', cat: '장건강', price: 49000, original: 65000, icon: '🦠', tag: '', rating: 4.5, reviews: 445, desc: '50억 CFU 복합 유산균 데일리 포뮤러' },
];

export default function Products() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 dark:text-white">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-black text-sm">D</div>
            <span className="font-black">DoxHayx 쇼핑몰</span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">← 홈</Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black mb-6">전체 제품</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <div key={p.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-md hover:border-green-400/40 dark:hover:border-green-700/40 transition-all">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 h-28 flex items-center justify-center">
                <span className="text-5xl">{p.icon}</span>
              </div>
              <div className="p-5">
                {p.tag && (
                  <span className={`text-xs px-2 py-0.5 rounded-full mb-2 inline-block font-medium ${
                    p.tag === 'BEST' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' :
                    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                  }`}>{p.tag}</span>
                )}
                <h3 className="font-bold text-base mb-1">{p.name}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full mb-2 inline-block">{p.cat}</span>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{p.desc}</p>
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="text-sm">{p.rating}</span>
                  <span className="text-xs text-gray-400">({p.reviews}리븷으)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-black">₩{p.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-400 line-through">₩{p.original.toLocaleString()}</div>
                  </div>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors">구매하기</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

