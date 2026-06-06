'use client';

import { useState, useEffect } from 'react';
import { DiaryEntry, MoodType, WeatherType } from '../types/diary';
import { X, Plus, ChevronDown } from 'lucide-react';

const moods: { value: MoodType; label: string; emoji: string }[] = [
  { value: 'happy',   label: '행복',  emoji: '😊' },
  { value: 'excited', label: '설레임', emoji: '🤩' },
  { value: 'peaceful',label: '평화',  emoji: '😌' },
  { value: 'tired',   label: '피곤',  emoji: '😴' },
  { value: 'sad',     label: '슬픔',  emoji: '😢' },
];

const weathers: { value: WeatherType; label: string; emoji: string }[] = [
  { value: 'sunny',  label: '맑음', emoji: '☀️' },
  { value: 'cloudy', label: '흐림', emoji: '⛅' },
  { value: 'rainy',  label: '비',   emoji: '🌧️' },
  { value: 'snowy',  label: '눈',   emoji: '❄️' },
  { value: 'windy',  label: '바람', emoji: '💨' },
];

interface Props {
  diary?: DiaryEntry;
  onSubmit: (data: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function DiaryForm({ diary, onSubmit, onCancel }: Props) {
  const [title, setTitle]       = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry]   = useState('');
  const [date, setDate]         = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent]   = useState('');
  const [mood, setMood]         = useState<MoodType>('happy');
  const [weather, setWeather]   = useState<WeatherType>('sunny');
  const [tags, setTags]         = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (diary) {
      setTitle(diary.title);
      setLocation(diary.location);
      setCountry(diary.country);
      setDate(diary.date);
      setContent(diary.content);
      setMood(diary.mood);
      setWeather(diary.weather);
      setTags(diary.tags);
      setImageUrl(diary.imageUrl || '');
    }
  }, [diary]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) { setTags(p => [...p, t]); setTagInput(''); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !content.trim()) return;
    onSubmit({ title, location, country, date, content, mood, weather, tags, imageUrl: imageUrl || undefined });
  };

  return (
    /* 배경 오버레이 */
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center sm:p-4">
      {/* 반투명 배경 */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onCancel}
      />

      {/* 모달 패널 */}
      <div className="relative bg-white w-full rounded-t-3xl sm:rounded-2xl sm:max-w-2xl sm:w-full max-h-[92dvh] sm:max-h-[90vh] flex flex-col animate-slide-up sm:animate-fade-in">
        {/* 모바일 드래그 핸들 */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3 sm:py-4 border-b">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            {diary ? '일기 수정' : '새 여행 일기'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* 폼 본문 */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">제목 *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="여행의 제목을 입력하세요"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* 장소 / 국가 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">장소 *</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="예: 에펠탑"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">국가</label>
              <input
                type="text"
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder="예: 프랑스"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* 날짜 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">날짜</label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
              />
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* 기분 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">기분</label>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {moods.map(m => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    mood === m.value ? 'bg-blue-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <span>{m.emoji}</span> {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* 날씨 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">날씨</label>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {weathers.map(w => (
                <button
                  key={w.value}
                  type="button"
                  onClick={() => setWeather(w.value)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    weather === w.value ? 'bg-emerald-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <span>{w.emoji}</span> {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">내용 *</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="여행에 대한 이야기를 자유롭게 써보세요..."
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              required
            />
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">태그</label>
            {tags.length > 0 && (
              <div className="flex gap-2 mb-2 flex-wrap">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-blue-50 text-blue-600 text-xs px-3 py-1.5 rounded-full"
                  >
                    #{tag}
                    <button type="button" onClick={() => setTags(p => p.filter(t => t !== tag))}>
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="태그 입력 후 Enter"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-blue-500 text-white px-4 py-3 rounded-xl hover:bg-blue-600 active:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* 이미지 URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">이미지 URL <span className="text-gray-400 font-normal">(선택)</span></label>
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* 여백 (iOS 키보드 대비) */}
          <div className="h-4" />
        </form>

        {/* 하단 버튼 - sticky */}
        <div className="px-5 sm:px-6 py-4 border-t bg-white rounded-b-3xl sm:rounded-b-2xl pb-safe">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-gray-200 text-gray-600 py-3.5 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-sm"
            >
              취소
            </button>
            <button
              form=""
              onClick={handleSubmit as unknown as React.MouseEventHandler}
              className="flex-2 flex-grow-[2] bg-blue-500 text-white py-3.5 rounded-xl hover:bg-blue-600 active:bg-blue-700 transition-colors font-semibold text-sm shadow-sm"
            >
              {diary ? '수정하기' : '작성하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
