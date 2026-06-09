'use client';

import { ShieldCheck, Award, Users, Clock, Wrench, ThumbsUp } from 'lucide-react';

const trustPoints = [
  {
    icon: ShieldCheck,
    title: '작업자 실명제',
    desc: '모든 기술자는 이름·경력을 공개하며, 방문 전 사전 정보를 문자로 안내합니다.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Award,
    title: '1년 무상 A/S 보증',
    desc: '시공 후 동일 부위 문제가 재발하면 무상으로 재방문합니다.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Clock,
    title: '30분 내 출동',
    desc: '인천 전 지역 서비스망으로 빠른 출동. 긴급 누수는 24시간 대응합니다.',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: Users,
    title: '숙련 전문 기술자',
    desc: '평균 경력 8년 이상의 분야별 전문 기술자가 직접 시공합니다.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Wrench,
    title: '투명한 견적',
    desc: '숨겨진 추가 비용 없음. 방문 전 예상 견적을 먼저 안내합니다.',
    color: 'bg-pink-100 text-pink-600',
  },
  {
    icon: ThumbsUp,
    title: '고객 만족도 1위',
    desc: '2024년 인천 집수리 플랫폼 고객 후기 평점 4.9 / 5.0 달성.',
    color: 'bg-yellow-100 text-yellow-600',
  },
];

const team = [
  { name: '김○○', role: '누수·방수 전문', career: '경력 12년', emoji: '🔵' },
  { name: '이○○', role: '전기·조명 전문', career: '경력 9년',  emoji: '⚡' },
  { name: '박○○', role: '설비·배관 전문', career: '경력 11년', emoji: '🔧' },
  { name: '최○○', role: '인테리어 전문',  career: '경력 8년',  emoji: '🎨' },
];

export default function TrustSection() {
  return (
    <section id="trust" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-orange-500 font-bold text-sm tracking-widest uppercase">Why Dox-Hayx</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 mb-4">
            "여기라면 믿고 맡길 수 있겠다"
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            단순히 고치는 것을 넘어, 다음에 또 찾고 싶은 서비스를 만듭니다.
          </p>
        </div>

        {/* 신뢰 포인트 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {trustPoints.map(t => (
            <div key={t.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${t.color} rounded-xl flex items-center justify-center mb-4`}>
                <t.icon size={22} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{t.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* 전문가 팀 소개 */}
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 text-center mb-8">소속 전문 기술자 (작업자 실명제)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {team.map(m => (
              <div key={m.name} className="text-center p-4 bg-gray-50 rounded-2xl">
                <div className="text-4xl mb-3">{m.emoji}</div>
                <div className="font-bold text-gray-900 text-base">{m.name} 기술자</div>
                <div className="text-orange-500 text-xs font-semibold mt-0.5">{m.role}</div>
                <div className="text-gray-400 text-xs mt-1">{m.career}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">
            * 방문 전 담당 기술자 프로필을 문자로 안내해 드립니다
          </p>
        </div>
      </div>
    </section>
  );
}
