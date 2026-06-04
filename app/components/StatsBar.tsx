'use client';

import { DiaryEntry } from '../types/diary';
import { BookOpen, MapPin, Globe } from 'lucide-react';

interface Props {
  diaries: DiaryEntry[];
}

export default function StatsBar({ diaries }: Props) {
  const countries = new Set(diaries.map(d => d.country).filter(Boolean)).size;
  const locations = new Set(diaries.map(d => d.location)).size;

  const stats = [
    { icon: BookOpen, label: '총 일기', value: diaries.length, bg: 'bg-blue-100', color: 'text-blue-600' },
    { icon: MapPin,   label: '방문 장소', value: locations, bg: 'bg-green-100', color: 'text-green-600' },
    { icon: Globe,    label: '방문 국가', value: countries, bg: 'bg-purple-100', color: 'text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {stats.map(s => (
        <div key={s.label} className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm flex items-center gap-2 sm:gap-3">
          <div className={`${s.bg} p-2 sm:p-3 rounded-xl flex-shrink-0`}>
            <s.icon size={16} className={`${s.color} sm:hidden`} />
            <s.icon size={20} className={`${s.color} hidden sm:block`} />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-800">{s.value}</div>
            <div className="text-xs text-gray-500 truncate">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
