'use client';

import { useState, useEffect } from 'react';
import { Phone, Menu, X } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { label: '서비스', href: '#services' },
    { label: '작업 사례', href: '#gallery' },
    { label: '신뢰 보증', href: '#trust' },
    { label: '서비스 지역', href: '#area' },
    { label: '고객 후기', href: '#reviews' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur-sm py-3'
    }`}>
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* 로고 */}
        <a href="#" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black text-lg">D</div>
          <div>
            <div className="font-black text-gray-900 leading-tight text-base">Dox-Hayx</div>
            <div className="text-xs text-orange-500 font-medium leading-tight">집수리 전문</div>
          </div>
        </a>

        {/* 데스크탑 네비 */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className="text-sm text-gray-600 hover:text-orange-500 font-medium transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        {/* 전화 버튼 */}
        <div className="flex items-center gap-3">
          <a
            href="tel:032-000-0000"
            className="hidden sm:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
          >
            <Phone size={15} />
            032-000-0000
          </a>
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="메뉴"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-1 shadow-lg">
          {navLinks.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-gray-700 font-medium border-b border-gray-50 last:border-0"
            >
              {l.label}
            </a>
          ))}
          <a
            href="tel:032-000-0000"
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-3 rounded-xl font-bold text-sm mt-3 justify-center"
          >
            <Phone size={15} />
            지금 바로 전화 상담
          </a>
        </div>
      )}
    </header>
  );
}
