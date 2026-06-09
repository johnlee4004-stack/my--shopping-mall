'use client';

const services = [
  { emoji: '🚿', title: '누수·방수', desc: '욕실·베란다·지붕 누수 탐지 및 방수 시공', badge: '긴급 출동' },
  { emoji: '⚡', title: '전기·조명', desc: '콘센트·스위치 교체, 형광등·LED 교체, 누전 점검', badge: '' },
  { emoji: '🔧', title: '설비·배관', desc: '수도꼭지 교체, 하수구 막힘, 변기·세면대 수리', badge: '' },
  { emoji: '🚪', title: '문·창호', desc: '현관문·방문·창문 잠금장치, 경첩, 유리 교체', badge: '' },
  { emoji: '🎨', title: '도배·마루', desc: '벽지·장판 교체, 실리콘·코킹, 도색 작업', badge: '' },
  { emoji: '🏗️', title: '인테리어', desc: '소규모 철거, 선반 설치, 욕실·주방 리모델링', badge: '인기' },
];

export default function Services() {
  const scrollToForm = () => {
    document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-orange-500 font-bold text-sm tracking-widest uppercase">Services</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 mb-4">
            집 안 어디든, 빠르게 해결합니다
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            작은 나사 하나부터 전면 리모델링까지 — 숙련된 전문 기술자가 직접 방문합니다.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {services.map(s => (
            <div
              key={s.title}
              className="relative group bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-200 rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1"
              onClick={scrollToForm}
            >
              {s.badge && (
                <span className="absolute top-3 right-3 text-xs font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full">
                  {s.badge}
                </span>
              )}
              <div className="text-4xl mb-3">{s.emoji}</div>
              <h3 className="font-bold text-gray-900 text-base mb-1">{s.title}</h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-lg shadow-orange-500/20 hover:-translate-y-0.5"
          >
            내 집 수리 견적 받기 →
          </button>
          <p className="text-gray-400 text-sm mt-3">📋 문의 후 1시간 이내 전문 상담원이 연락드립니다</p>
        </div>
      </div>
    </section>
  );
}
