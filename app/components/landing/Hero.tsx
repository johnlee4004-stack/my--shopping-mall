'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Clock, Shield, Star, ArrowRight } from 'lucide-react';

// 실제 현장 사진으로 교체 예정 — public/gallery/ 폴더에 업로드 후 경로 변경
// 예: before: '/gallery/bathroom-leak-before.jpg', after: '/gallery/bathroom-leak-after.jpg'
const slides = [
  {
    before: 'https://images.unsplash.com/photo-1620626011761-996317702b4b?w=800&q=80',
    after:  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
    label: '욕실 누수 → 완벽 수리',
  },
  {
    before: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80',
    after:  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    label: '도배·도색 → 새집처럼',
  },
  {
    before: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80',
    after:  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80',
    label: '전기 설비 → 안전 시공',
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [showAfter, setShowAfter] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setShowAfter(p => !p);
      if (!showAfter) {
        setTimeout(() => setActiveSlide(p => (p + 1) % slides.length), 600);
      }
    }, 3000);
    return () => clearInterval(t);
  }, [showAfter]);

  const scrollToForm = () => {
    document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden pt-16">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 opacity-20">
        <img
          src={showAfter ? slides[activeSlide].after : slides[activeSlide].before}
          alt=""
          className="w-full h-full object-cover transition-opacity duration-700"
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        {/* 좌측: 카피 */}
        <div className="text-white">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            인천 전 지역 · 오늘 바로 출동 가능
          </div>

          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            망가진 일상,<br />
            <span className="text-orange-400">Dox-Hayx</span>가<br />
            빠르게 복구합니다.
          </h1>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            인천 집수리 고민, 이제 사진 한 장으로 해결하세요.<br className="hidden sm:block" />
            숙련된 전문가가 <strong className="text-white">1시간 이내</strong> 연락드립니다.
          </p>

          {/* 신뢰 배지 */}
          <div className="flex flex-wrap gap-4 mb-8">
            {[
              { icon: Clock, text: '30분 내 출동' },
              { icon: Shield, text: '1년 무상 AS' },
              { icon: Star, text: '후기 4.9점' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-2 rounded-xl text-sm text-white">
                <Icon size={14} className="text-orange-400" />
                {text}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={scrollToForm}
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5"
            >
              무료 견적 문의하기
              <ArrowRight size={20} />
            </button>
            <a
              href="tel:032-721-7720"
              className="flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white text-white px-6 py-4 rounded-2xl font-bold text-base transition-all hover:bg-white/10"
            >
              📞 032-721-7720
            </a>
          </div>
        </div>

        {/* 우측: 비포/애프터 카드 */}
        <div className="hidden md:block">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border-4 border-white/10">
            <img
              src={slides[activeSlide].before}
              alt="Before"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${showAfter ? 'opacity-0' : 'opacity-100'}`}
            />
            <img
              src={slides[activeSlide].after}
              alt="After"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${showAfter ? 'opacity-100' : 'opacity-0'}`}
            />
            {/* 라벨 */}
            <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold shadow ${showAfter ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {showAfter ? '✓ 시공 후' : '× 시공 전'}
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-xl text-center">
              {slides[activeSlide].label}
            </div>
          </div>
          {/* 슬라이드 닷 */}
          <div className="flex justify-center gap-2 mt-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === activeSlide ? 'bg-orange-400 w-6' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 스크롤 유도 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
        <ChevronDown size={28} />
      </div>
    </section>
  );
}
