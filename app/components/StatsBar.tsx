'use client';

import { DiaryEntry } from '../types/diary';
import { BookOpen, MapPin, Globe, CalendarDays } from 'lucide-react';

interface Props {
  diaries: DiaryEntry[];
}

export default function StatsBar({ diaries }: Props) {
  const countries = new Set(diaries.map(d => d.country).filter(Boolean)).size;
  const locations = new Set(diaries.map(d => d.location)).size;
  const travelDays = new Set(diaries.map(d => d.date)).size;

  const stats = [
    { icon: BookOpen,     label: '총 일기',   value: diaries.length, bg: 'bg-blue-100',   color: 'text-blue-600' },
    { icon: CalendarDays, label: '여행 일수',  value: travelDays,     bg: 'bg-orange-100', color: 'text-orange-600' },
    { icon: MapPin,       label: '방문 장소',  value: locations,      bg: 'bg-green-100',  color: 'text-green-600' },
    { icon: Globe,        label: '방문 국가',  value: countries,      bg: 'bg-purple-100', color: 'text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
      {stats.map(s => (
        <div key={s.label} className="bg-white rounded-2xl p-2.5 sm:p-4 shadow-sm flex flex-col sm:flex-row items-center sm:gap-3 gap-1 text-center sm:text-left">
          <div className={`${s.bg} p-2 sm:p-3 rounded-xl flex-shrink-0`}>
            <s.icon size={14} className={`${s.color} sm:hidden`} />
            <s.icon size={20} className={`${s.color} hidden sm:block`} />
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-2xl font-bold text-gray-800">{s.value}</div>
            <div className="text-xs text-gray-500 truncate leading-tight">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
