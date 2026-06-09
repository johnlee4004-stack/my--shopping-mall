'use client';

import { useEffect } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel, onConfirm]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-fade-in">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle size={28} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">일기 삭제</h3>
            <p className="text-sm text-gray-500">{message}</p>
          </div>
          <div className="flex gap-3 w-full mt-1">
            <button
              onClick={onCancel}
              className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-sm"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 active:bg-red-700 transition-colors font-semibold text-sm flex items-center justify-center gap-1.5"
            >
              <Trash2 size={15} />
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
