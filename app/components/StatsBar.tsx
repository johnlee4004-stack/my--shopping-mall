'use client';

import { DiaryEntry } from '../types/diary';
import { BookOpen, MapPin, Globe } from 'lucide-react';

interface Props {
  diaries: DiaryEntry[];
}

export default function StatsBar({ diaries }: Props) {
  const countries = new Set(diaries.map(d => d.country).filter(Boolean)).size;
  const locations = new Set(diaries.map(d => d.location)).size;

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
        <div className="bg-blue-100 p-3 rounded-xl">
          <BookOpen size={20} className="text-blue-600" />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-800">{diaries.length}</div>
          <div className="text-xs text-gray-500">총 일기</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
        <div className="bg-green-100 p-3 rounded-xl">
          <MapPin size={20} className="text-green-600" />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-800">{locations}</div>
          <div className="text-xs text-gray-500">방문 장소</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
        <div className="bg-purple-100 p-3 rounded-xl">
          <Globe size={20} className="text-purple-600" />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-800">{countries}</div>
          <div className="text-xs text-gray-500">방문 국가</div>
        </div>
      </div>
    </div>
  );
}
