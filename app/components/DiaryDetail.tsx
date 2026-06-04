'use client';

import { DiaryEntry } from '../types/diary';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MapPin, Calendar, Tag, X, Pencil, Trash2 } from 'lucide-react';

const moodEmoji: Record<DiaryEntry['mood'], string> = {
  happy: '😊',
  excited: '🤩',
  peaceful: '😌',
  tired: '😴',
  sad: '😢',
};

const moodLabel: Record<DiaryEntry['mood'], string> = {
  happy: '행복',
  excited: '설레임',
  peaceful: '평화',
  tired: '피곤',
  sad: '슬픔',
};

const weatherEmoji: Record<DiaryEntry['weather'], string> = {
  sunny: '☀️',
  cloudy: '⛅',
  rainy: '🌧️',
  snowy: '❄️',
  windy: '💨',
};

const weatherLabel: Record<DiaryEntry['weather'], string> = {
  sunny: '맑음',
  cloudy: '흐림',
  rainy: '비',
  snowy: '눈',
  windy: '바람',
};

interface Props {
  diary: DiaryEntry;
  onClose: () => void;
  onEdit: (diary: DiaryEntry) => void;
  onDelete: (id: string) => void;
}

export default function DiaryDetail({ diary, onClose, onEdit, onDelete }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {diary.imageUrl && (
          <div className="relative h-72">
            <img
              src={diary.imageUrl}
              alt={diary.title}
              className="w-full h-full object-cover rounded-t-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-t-2xl" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {!diary.imageUrl && (
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <div />
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex-1 pr-4">{diary.title}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(diary)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
              >
                <Pencil size={14} />
                수정
              </button>
              <button
                onClick={() => {
                  if (confirm('이 일기를 삭제할까요?')) {
                    onDelete(diary.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
              >
                <Trash2 size={14} />
                삭제
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-5 pb-5 border-b">
            <span className="flex items-center gap-1.5">
              <MapPin size={16} className="text-blue-500" />
              <strong className="text-gray-700">{diary.location}</strong>
              {diary.country && <span>, {diary.country}</span>}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={16} className="text-green-500" />
              {format(new Date(diary.date), 'yyyy년 M월 d일 (EEEE)', { locale: ko })}
            </span>
            <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
              {moodEmoji[diary.mood]} {moodLabel[diary.mood]}
            </span>
            <span className="bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-xs font-medium">
              {weatherEmoji[diary.weather]} {weatherLabel[diary.weather]}
            </span>
          </div>

          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
            {diary.content}
          </div>

          {diary.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {diary.tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full"
                >
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t text-xs text-gray-400">
            작성: {format(new Date(diary.createdAt), 'yyyy.MM.dd HH:mm')}
            {diary.updatedAt !== diary.createdAt && (
              <> · 수정: {format(new Date(diary.updatedAt), 'yyyy.MM.dd HH:mm')}</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
