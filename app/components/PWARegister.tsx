'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

export default function PWARegister() {
  const [installPrompt, setInstallPrompt] = useState<Event & { prompt: () => void } | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // 서비스 워커 등록
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // 설치 프롬프트 캡처 (Android Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as Event & { prompt: () => void });
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // 이미 설치된 경우 배너 숨기기
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowBanner(false);
    }

    // URL에 ?action=new 가 있으면 새 일기 트리거
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'new') {
      window.dispatchEvent(new CustomEvent('open-new-diary'));
      window.history.replaceState({}, '', '/');
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-center gap-3 animate-slide-up">
      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
        <img src="/icon-192x192.png" alt="앱 아이콘" className="w-full h-full" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm">여행 일기 설치</p>
        <p className="text-xs text-gray-500 truncate">홈 화면에 추가하고 오프라인에서도 사용</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <button
          onClick={handleInstall}
          className="flex items-center gap-1 bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          <Download size={12} />
          설치
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="text-xs text-gray-400 hover:text-gray-600 text-center"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
