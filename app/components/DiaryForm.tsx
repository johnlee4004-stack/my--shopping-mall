'use client';

import { useState, useEffect } from 'react';
import { DiaryEntry, MoodType, WeatherType } from '../types/diary';
import { X, Plus } from 'lucide-react';

const moods: { value: MoodType; label: string; emoji: string }[] = [
  { value: 'happy', label: '행복', emoji: '😊' },
  { value: 'excited', label: '설레임', emoji: '🤩' },
  { value: 'peaceful', label: '평화', emoji: '😌' },
  { value: 'tired', label: '피곤', emoji: '😴' },
  { value: 'sad', label: '슬픔', emoji: '😢' },
];

const weathers: { value: WeatherType; label: string; emoji: string }[] = [
  { value: 'sunny', label: '맑음', emoji: '☀️' },
  { value: 'cloudy', label: '흐림', emoji: '⛅' },
  { value: 'rainy', label: '비', emoji: '🌧️' },
  { value: 'snowy', label: '눈', emoji: '❄️' },
  { value: 'windy', label: '바람', emoji: '💨' },
];

interface Props {
  diary?: DiaryEntry;
  onSubmit: (data: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function DiaryForm({ diary, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType>('happy');
  const [weather, setWeather] = useState<WeatherType>('sunny');
  const [tags, setTags] = useState<string[]>([]);
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
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !content.trim()) return;
    onSubmit({ title, location, country, date, content, mood, weather, tags, imageUrl: imageUrl || undefined });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800">
            {diary ? '일기 수정' : '새 여행 일기 작성'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="여행의 제목을 입력하세요"
              className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">장소 *</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="예: 에펠탑"
                className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">국가</label>
              <input
                type="text"
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder="예: 프랑스"
                className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">기분</label>
            <div className="flex gap-2 flex-wrap">
              {moods.map(m => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm transition-colors ${
                    mood === m.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">날씨</label>
            <div className="flex gap-2 flex-wrap">
              {weathers.map(w => (
                <button
                  key={w.value}
                  type="button"
                  onClick={() => setWeather(w.value)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm transition-colors ${
                    weather === w.value
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {w.emoji} {w.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">내용 *</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="여행에 대한 이야기를 자유롭게 써보세요..."
              rows={5}
              className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">태그</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full"
                >
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="태그 입력 후 Enter"
                className="flex-1 border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-blue-500 text-white px-4 py-2.5 rounded-xl hover:bg-blue-600 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이미지 URL (선택)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-colors font-medium"
            >
              {diary ? '수정하기' : '작성하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
