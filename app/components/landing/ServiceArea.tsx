'use client';

const areas = [
  { name: '부평구', emoji: '📍', highlight: true },
  { name: '연수구', emoji: '📍', highlight: true },
  { name: '남동구', emoji: '📍', highlight: true },
  { name: '미추홀구', emoji: '📍', highlight: false },
  { name: '서구',  emoji: '📍', highlight: false },
  { name: '계양구', emoji: '📍', highlight: false },
  { name: '중구',  emoji: '📍', highlight: false },
  { name: '동구',  emoji: '📍', highlight: false },
  { name: '강화군', emoji: '📍', highlight: false },
  { name: '옹진군', emoji: '📍', highlight: false },
];

const keywords = [
  '인천 집수리', '인천 누수 수리', '인천 화장실 수리',
  '부평구 집수리', '연수구 집수리', '남동구 누수',
  '인천 전기 수리', '인천 도배', '인천 배관 수리',
  '인천 당일 출동', '인천 집수리 업체 추천',
];

export default function ServiceArea() {
  return (
    <section id="area" className="py-20 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-orange-400 font-bold text-sm tracking-widest uppercase">Service Area</span>
          <h2 className="text-3xl sm:text-4xl font-black mt-2 mb-4">
            인천 전 지역 서비스
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            인천시 10개 군구 전 지역에 서비스망을 운영합니다.<br />
            빠른 출동으로 오래 기다리지 않도록 최선을 다합니다.
          </p>
        </div>

        {/* 지역 배지 */}
        <div className="flex flex-wrap gap-3 justify-center mb-14">
          {areas.map(a => (
            <span
              key={a.name}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold ${
                a.highlight
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 text-gray-300 border border-white/10'
              }`}
            >
              {a.emoji} {a.name}
            </span>
          ))}
        </div>

        {/* 수치 강조 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {[
            { value: '30분', label: '평균 출동 시간' },
            { value: '24h', label: '긴급 누수 대응' },
            { value: '10구', label: '서비스 지역' },
            { value: '247+', label: '누적 고객 후기' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <div className="text-3xl font-black text-orange-400 mb-1">{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* SEO 키워드 텍스트 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-gray-400 text-sm leading-relaxed text-center">
            Dox-Hayx는 <strong className="text-white">인천 지역(부평구, 연수구, 남동구, 미추홀구, 서구, 계양구, 중구, 동구, 강화군, 옹진군)</strong>을 중심으로
            전문 집수리 서비스를 제공합니다. 누수 탐지부터 전기 설비, 소소한 문고리 교체까지 — <strong className="text-orange-400">인천 집수리</strong>의 기준이 되겠습니다.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {keywords.map(k => (
              <span key={k} className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">{k}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
