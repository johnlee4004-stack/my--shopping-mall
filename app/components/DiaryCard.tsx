'use client';

import { DiaryEntry } from '../types/diary';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MapPin, Calendar, Tag, Pencil, Trash2 } from 'lucide-react';

const moodEmoji: Record<DiaryEntry['mood'], string> = {
  happy: '😊',
  excited: '🤩',
  peaceful: '😌',
  tired: '😴',
  sad: '😢',
};

const weatherEmoji: Record<DiaryEntry['weather'], string> = {
  sunny: '☀️',
  cloudy: '⛅',
  rainy: '🌧️',
  snowy: '❄️',
  windy: '💨',
};

const moodLabel: Record<DiaryEntry['mood'], string> = {
  happy: '행복',
  excited: '설레임',
  peaceful: '평화',
  tired: '피곤',
  sad: '슬픔',
};

interface Props {
  diary: DiaryEntry;
  onEdit: (diary: DiaryEntry) => void;
  onDelete: (id: string) => void;
  onClick: (diary: DiaryEntry) => void;
}

export default function DiaryCard({ diary, onEdit, onDelete, onClick }: Props) {
  return (
    <div
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
      onClick={() => onClick(diary)}
    >
      {diary.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={diary.imageUrl}
            alt={diary.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm">
              {weatherEmoji[diary.weather]}
            </span>
            <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm">
              {moodEmoji[diary.mood]} {moodLabel[diary.mood]}
            </span>
          </div>
        </div>
      )}
      {!diary.imageUrl && (
        <div className="h-24 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
          <span className="text-5xl">{moodEmoji[diary.mood]}</span>
        </div>
      )}

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{diary.title}</h3>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <MapPin size={14} className="text-blue-500" />
            {diary.location}, {diary.country}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} className="text-green-500" />
            {format(new Date(diary.date), 'yyyy.MM.dd', { locale: ko })}
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{diary.content}</p>

        {diary.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {diary.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="flex items-center gap-1 bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
            {diary.tags.length > 3 && (
              <span className="text-xs text-gray-400">+{diary.tags.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => onEdit(diary)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors px-3 py-1 rounded-lg hover:bg-blue-50"
          >
            <Pencil size={14} />
            수정
          </button>
          <button
            onClick={() => {
              if (confirm('이 일기를 삭제할까요?')) onDelete(diary.id);
            }}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-1 rounded-lg hover:bg-red-50"
          >
            <Trash2 size={14} />
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
