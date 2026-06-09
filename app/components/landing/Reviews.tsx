'use client';

import { Star } from 'lucide-react';

const reviews = [
  {
    name: '박*연',
    area: '인천 연수구',
    service: '욕실 누수',
    stars: 5,
    date: '2026.05.28',
    text: '화장실 바닥에서 물이 새서 급히 연락했는데, 30분도 안 돼서 오셨어요. 원인을 바로 파악하고 당일 처리해 주셔서 너무 감사했습니다. 작업도 깔끔하고 설명도 친절하셨어요.',
  },
  {
    name: '이*준',
    area: '인천 부평구',
    service: '전기 콘센트 교체',
    stars: 5,
    date: '2026.05.15',
    text: '방문 전에 기술자분 이름이랑 경력을 문자로 알려주시더라고요. 처음에 살짝 의아했는데 오히려 안심이 됐어요. 작업도 빠르고 추가 요금 없이 견적대로 처리해 주셨습니다.',
  },
  {
    name: '김*희',
    area: '인천 남동구',
    service: '문 잠금장치 교체',
    stars: 5,
    date: '2026.04.30',
    text: '사진 찍어서 보냈더니 바로 예상 견적을 알려주셨어요. 다른 업체는 무조건 방문해야 한다고 했는데, 투명하게 알려주니 신뢰가 갔어요. 결과물도 완벽했습니다!',
  },
  {
    name: '최*아',
    area: '인천 서구',
    service: '도배 전면 교체',
    stars: 5,
    date: '2026.04.10',
    text: 'A/S 보증이 진짜였어요. 도배 후 한쪽 귀퉁이가 살짝 들렸는데, 연락하니까 다음날 바로 오셔서 완벽하게 처리해 주셨습니다. 비용도 안 받으셨고요. 주변에 추천 많이 하고 있어요.',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-orange-500 font-bold text-sm tracking-widest uppercase">Reviews</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 mb-4">
            고객 후기
          </h2>
          {/* 종합 평점 */}
          <div className="inline-flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl px-6 py-3 mt-2">
            <div className="text-4xl font-black text-yellow-500">4.9</div>
            <div>
              <div className="flex gap-0.5 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-gray-500 text-xs">누적 후기 247건 기준</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {reviews.map((r, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-gray-900">{r.name} <span className="text-gray-400 font-normal text-sm">· {r.area}</span></div>
                  <div className="text-orange-500 text-xs font-semibold mt-0.5">{r.service}</div>
                </div>
                <div className="text-right">
                  <StarRating count={r.stars} />
                  <div className="text-gray-400 text-xs mt-1">{r.date}</div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
