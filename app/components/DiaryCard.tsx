'use client';

import { useState } from 'react';
import { DiaryEntry } from '../types/diary';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MapPin, Calendar, Tag, Pencil, Trash2 } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

const moodEmoji: Record<DiaryEntry['mood'], string> = {
  happy: '😊', excited: '🤩', peaceful: '😌', tired: '😴', sad: '😢',
};
const moodLabel: Record<DiaryEntry['mood'], string> = {
  happy: '행복', excited: '설레임', peaceful: '평화', tired: '피곤', sad: '슬픔',
};
const weatherEmoji: Record<DiaryEntry['weather'], string> = {
  sunny: '☀️', cloudy: '⛅', rainy: '🌧️', snowy: '❄️', windy: '💨',
};

interface Props {
  diary: DiaryEntry;
  onEdit: (diary: DiaryEntry) => void;
  onDelete: (id: string) => void;
  onClick: (diary: DiaryEntry) => void;
}

export default function DiaryCard({ diary, onEdit, onDelete, onClick }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
    <div
      className="bg-white rounded-2xl shadow-sm overflow-hidden active:scale-[0.98] hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={() => onClick(diary)}
    >
      {/* 이미지 */}
      {diary.imageUrl ? (
        <div className="relative h-44 sm:h-48 overflow-hidden">
          <img
            src={diary.imageUrl}
            alt={diary.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-3 right-3 flex gap-1.5">
            <span className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs">
              {weatherEmoji[diary.weather]}
            </span>
            <span className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-medium">
              {moodEmoji[diary.mood]} {moodLabel[diary.mood]}
            </span>
          </div>
          {/* 모바일: 제목을 이미지 위에 오버레이 */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:hidden">
            <h3 className="text-white font-bold text-base drop-shadow line-clamp-1">{diary.title}</h3>
          </div>
        </div>
      ) : (
        <div className="h-20 sm:h-24 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
          <span className="text-4xl sm:text-5xl">{moodEmoji[diary.mood]}</span>
        </div>
      )}

      <div className="p-4 sm:p-5">
        {/* 데스크탑 제목 */}
        <h3 className="hidden sm:block text-lg font-bold text-gray-800 mb-2 line-clamp-1">
          {diary.title}
        </h3>
        {/* 모바일 제목 (이미지 없을 때만) */}
        {!diary.imageUrl && (
          <h3 className="sm:hidden text-base font-bold text-gray-800 mb-2 line-clamp-1">
            {diary.title}
          </h3>
        )}

        {/* 장소 & 날짜 */}
        <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
          <span className="flex items-center gap-1 min-w-0">
            <MapPin size={12} className="text-blue-500 flex-shrink-0" />
            <span className="truncate">{diary.location}{diary.country ? `, ${diary.country}` : ''}</span>
          </span>
          <span className="flex items-center gap-1 flex-shrink-0">
            <Calendar size={12} className="text-green-500" />
            {format(new Date(diary.date), 'yy.MM.dd', { locale: ko })}
          </span>
        </div>

        {/* 내용 미리보기 */}
        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 mb-3">
          {diary.content}
        </p>

        {/* 태그 */}
        {diary.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {diary.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="flex items-center gap-0.5 bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full"
              >
                <Tag size={9} />
                {tag}
              </span>
            ))}
            {diary.tags.length > 3 && (
              <span className="text-xs text-gray-400">+{diary.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex justify-end gap-1" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => onEdit(diary)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50 active:bg-blue-100 min-h-[36px]"
          >
            <Pencil size={13} />
            수정
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 active:bg-red-100 min-h-[36px]"
          >
            <Trash2 size={13} />
            삭제
          </button>
        </div>
      </div>
    </div>

    {showConfirm && (
      <ConfirmDialog
        message="이 일기를 삭제하면 복구할 수 없습니다."
        onConfirm={() => { onDelete(diary.id); setShowConfirm(false); }}
        onCancel={() => setShowConfirm(false)}
      />
    )}
    </>
  );
}
