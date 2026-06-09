'use client';

import { useState } from 'react';
import { Phone, X } from 'lucide-react';

export default function FloatingContact() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* 모바일 고정 하단 바 */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 grid grid-cols-2 border-t border-gray-200 bg-white pb-safe shadow-2xl">
        <a
          href="tel:032-721-7720"
          className="flex items-center justify-center gap-2 py-4 text-white bg-gray-800 font-bold text-sm active:bg-gray-700"
        >
          <Phone size={18} />
          전화 상담
        </a>
        <a
          href="https://open.kakao.com/o/doxhayx"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-4 text-gray-900 bg-yellow-400 font-bold text-sm active:bg-yellow-500"
        >
          <span className="text-lg">💬</span>
          카카오톡 상담
        </a>
      </div>

      {/* 데스크탑 플로팅 버튼 */}
      <div className="hidden sm:flex fixed bottom-8 right-6 z-50 flex-col items-end gap-3">
        {expanded && (
          <div className="flex flex-col gap-2 items-end animate-fade-in">
            <a
              href="tel:032-721-7720"
              className="flex items-center gap-2 bg-gray-800 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-xl hover:bg-gray-700 transition-colors whitespace-nowrap"
            >
              <Phone size={16} />
              032-721-7720 전화 상담
            </a>
            <a
              href="https://open.kakao.com/o/doxhayx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-5 py-3 rounded-2xl font-bold text-sm shadow-xl hover:bg-yellow-500 transition-colors whitespace-nowrap"
            >
              <span className="text-lg leading-none">💬</span>
              카카오톡 상담
            </a>
          </div>
        )}

        <button
          onClick={() => setExpanded(p => !p)}
          className="w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-2xl shadow-orange-500/40 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          aria-label="상담하기"
          style={{ boxShadow: '0 8px 32px rgba(249,115,22,0.4)' }}
        >
          {expanded ? <X size={22} /> : <span className="text-2xl">🐕</span>}
        </button>
      </div>
    </>
  );
}
