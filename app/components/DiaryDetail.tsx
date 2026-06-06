'use client';

import { DiaryEntry } from '../types/diary';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MapPin, Calendar, Tag, X, Pencil, Trash2 } from 'lucide-react';

const moodEmoji: Record<DiaryEntry['mood'], string> = {
  happy: '😊', excited: '🤩', peaceful: '😌', tired: '😴', sad: '😢',
};
const moodLabel: Record<DiaryEntry['mood'], string> = {
  happy: '행복', excited: '설레임', peaceful: '평화', tired: '피곤', sad: '슬픔',
};
const weatherEmoji: Record<DiaryEntry['weather'], string> = {
  sunny: '☀️', cloudy: '⛅', rainy: '🌧️', snowy: '❄️', windy: '💨',
};
const weatherLabel: Record<DiaryEntry['weather'], string> = {
  sunny: '맑음', cloudy: '흐림', rainy: '비', snowy: '눈', windy: '바람',
};

interface Props {
  diary: DiaryEntry;
  onClose: () => void;
  onEdit: (diary: DiaryEntry) => void;
  onDelete: (id: string) => void;
}

export default function DiaryDetail({ diary, onClose, onEdit, onDelete }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center sm:p-4">
      {/* 배경 */}
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={onClose} />

      {/* 패널 */}
      <div className="relative bg-white w-full rounded-t-3xl sm:rounded-2xl sm:max-w-2xl sm:w-full max-h-[92dvh] sm:max-h-[90vh] flex flex-col animate-slide-up sm:animate-fade-in overflow-hidden">

        {/* 히어로 이미지 */}
        {diary.imageUrl ? (
          <div className="relative h-56 sm:h-72 flex-shrink-0">
            <img src={diary.imageUrl} alt={diary.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
            >
              <X size={20} />
            </button>
            {/* 제목 오버레이 */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h2 className="text-white text-xl sm:text-2xl font-bold drop-shadow-lg">{diary.title}</h2>
            </div>
          </div>
        ) : (
          <div className="flex-shrink-0">
            {/* 모바일 드래그 핸들 */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-800 flex-1 pr-4 line-clamp-1">{diary.title}</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={22} />
              </button>
            </div>
          </div>
        )}

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 sm:px-6 py-4 space-y-4">
            {/* 이미지 있을 때 모바일 드래그 핸들 */}
            {diary.imageUrl && (
              <div className="sm:hidden flex justify-center -mt-2 mb-0">
                <div className="w-10 h-1 rounded-full bg-gray-200" />
              </div>
            )}

            {/* 메타 정보 칩 */}
            <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
              <span className="flex items-center gap-1.5 bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full">
                <MapPin size={13} className="text-blue-500" />
                <strong>{diary.location}</strong>
                {diary.country && <span className="text-gray-500">, {diary.country}</span>}
              </span>
              <span className="flex items-center gap-1.5 bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full">
                <Calendar size={13} className="text-green-500" />
                {format(new Date(diary.date), 'yyyy년 M월 d일', { locale: ko })}
              </span>
              <span className="bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full font-medium">
                {moodEmoji[diary.mood]} {moodLabel[diary.mood]}
              </span>
              <span className="bg-sky-50 text-sky-700 px-3 py-1.5 rounded-full font-medium">
                {weatherEmoji[diary.weather]} {weatherLabel[diary.weather]}
              </span>
            </div>

            {/* 일기 내용 */}
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
              {diary.content}
            </p>

            {/* 태그 */}
            {diary.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {diary.tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-blue-50 text-blue-600 text-xs sm:text-sm px-3 py-1.5 rounded-full"
                  >
                    <Tag size={11} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* 작성/수정 시각 */}
            <p className="text-xs text-gray-400 pt-1 border-t">
              작성: {format(new Date(diary.createdAt), 'yyyy.MM.dd HH:mm')}
              {diary.updatedAt !== diary.createdAt && (
                <> · 수정: {format(new Date(diary.updatedAt), 'yyyy.MM.dd HH:mm')}</>
              )}
            </p>

            <div className="h-2" />
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="flex-shrink-0 border-t bg-white px-5 sm:px-6 py-3 pb-safe">
          <div className="flex gap-3">
            <button
              onClick={() => onEdit(diary)}
              className="flex-1 flex items-center justify-center gap-2 border border-blue-200 text-blue-600 py-3 rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-colors font-semibold text-sm"
            >
              <Pencil size={15} />
              수정
            </button>
            <button
              onClick={() => {
                if (confirm('이 일기를 삭제할까요?')) { onDelete(diary.id); onClose(); }
              }}
              className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-500 py-3 rounded-xl hover:bg-red-50 active:bg-red-100 transition-colors font-semibold text-sm"
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
