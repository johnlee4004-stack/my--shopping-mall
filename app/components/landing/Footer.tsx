export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {/* 브랜드 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black text-lg">D</div>
              <div>
                <div className="font-black text-white leading-tight">Dox-Hayx</div>
                <div className="text-xs text-orange-500">집수리 전문</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              망가진 일상을 빠르고 확실하게 복구합니다.<br />
              인천 전 지역, 오늘 바로 출동 가능합니다.
            </p>
          </div>

          {/* 연락처 */}
          <div>
            <h4 className="text-white font-bold mb-4">연락처</h4>
            <ul className="space-y-2 text-sm">
              <li>📞 <a href="tel:032-721-7720" className="hover:text-white transition-colors">032-721-7720</a></li>
              <li>💬 <a href="https://open.kakao.com/o/doxhayx" className="hover:text-white transition-colors">카카오톡 채널 상담</a></li>
              <li>📧 <a href="mailto:hello@doxhayx.com" className="hover:text-white transition-colors">hello@doxhayx.com</a></li>
              <li>⏰ 평일·주말 08:00 – 20:00</li>
              <li>🚨 긴급 누수 24시간 대응</li>
            </ul>
          </div>

          {/* 서비스 지역 */}
          <div>
            <h4 className="text-white font-bold mb-4">주요 서비스 지역</h4>
            <p className="text-sm leading-loose text-gray-500">
              인천 부평구 · 연수구 · 남동구 · 미추홀구 · 서구 · 계양구 · 중구 · 동구 · 강화군 · 옹진군
            </p>
            <p className="text-xs mt-3 text-gray-600 leading-relaxed">
              인천 집수리 · 인천 누수 수리 · 인천 전기 수리 ·
              인천 배관 수리 · 인천 도배 · 인천 당일 출동
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© 2026 Dox-Hayx. All rights reserved.</p>
          <p>사업자등록번호: 000-00-00000 · 대표: 이○○ · 인천광역시 부평구</p>
        </div>
      </div>
    </footer>
  );
}
