'use client';

import { useState, useMemo } from 'react';
import { useDiaryStore } from './store/diaryStore';
import { DiaryEntry } from './types/diary';
import DiaryCard from './components/DiaryCard';
import DiaryForm from './components/DiaryForm';
import DiaryDetail from './components/DiaryDetail';
import SearchBar from './components/SearchBar';
import StatsBar from './components/StatsBar';
import { Plus, BookOpen } from 'lucide-react';

type SortOption = 'newest' | 'oldest' | 'location';

export default function Home() {
  const { diaries, isLoaded, addDiary, updateDiary, deleteDiary, searchDiaries } = useDiaryStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDiary, setEditingDiary] = useState<DiaryEntry | undefined>();
  const [viewingDiary, setViewingDiary] = useState<DiaryEntry | undefined>();
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterMood, setFilterMood] = useState<DiaryEntry['mood'] | 'all'>('all');

  const filteredAndSorted = useMemo(() => {
    let result = searchQuery ? searchDiaries(searchQuery) : [...diaries];

    if (filterMood !== 'all') {
      result = result.filter(d => d.mood === filterMood);
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      return a.location.localeCompare(b.location);
    });

    return result;
  }, [diaries, searchQuery, sortBy, filterMood, searchDiaries]);

  const handleSubmit = (data: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingDiary) {
      updateDiary(editingDiary.id, data);
    } else {
      addDiary(data);
    }
    setShowForm(false);
    setEditingDiary(undefined);
  };

  const handleEdit = (diary: DiaryEntry) => {
    setEditingDiary(diary);
    setViewingDiary(undefined);
    setShowForm(true);
  };

  const moodFilters: { value: DiaryEntry['mood'] | 'all'; label: string; emoji: string }[] = [
    { value: 'all', label: '전체', emoji: '🌍' },
    { value: 'happy', label: '행복', emoji: '😊' },
    { value: 'excited', label: '설레임', emoji: '🤩' },
    { value: 'peaceful', label: '평화', emoji: '😌' },
    { value: 'tired', label: '피곤', emoji: '😴' },
    { value: 'sad', label: '슬픔', emoji: '😢' },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-lg">불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="text-blue-500" size={28} />
            <div>
              <h1 className="text-xl font-bold text-gray-800">여행 일기</h1>
              <p className="text-xs text-gray-400">소중한 여행의 기억을 남겨보세요</p>
            </div>
          </div>
          <button
            onClick={() => { setEditingDiary(undefined); setShowForm(true); }}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
          >
            <Plus size={18} />
            새 일기
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <StatsBar diaries={diaries} />

        {/* Search & Filter */}
        <div className="mb-6 space-y-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex flex-wrap gap-2">
              {moodFilters.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilterMood(f.value)}
                  className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
                    filterMood === f.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {f.emoji} {f.label}
                </button>
              ))}
            </div>

            <div className="ml-auto">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="newest">최신순</option>
                <option value="oldest">오래된순</option>
                <option value="location">장소순</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results info */}
        {searchQuery && (
          <p className="text-sm text-gray-500 mb-4">
            &quot;{searchQuery}&quot; 검색 결과: {filteredAndSorted.length}개
          </p>
        )}

        {/* Diary Grid */}
        {filteredAndSorted.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchQuery ? '검색 결과가 없습니다' : '아직 작성한 일기가 없어요'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery ? '다른 검색어를 시도해보세요' : '첫 번째 여행 일기를 작성해보세요!'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => { setEditingDiary(undefined); setShowForm(true); }}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
              >
                일기 작성하기
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSorted.map(diary => (
              <DiaryCard
                key={diary.id}
                diary={diary}
                onEdit={handleEdit}
                onDelete={deleteDiary}
                onClick={setViewingDiary}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showForm && (
        <DiaryForm
          diary={editingDiary}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditingDiary(undefined); }}
        />
      )}

      {viewingDiary && (
        <DiaryDetail
          diary={viewingDiary}
          onClose={() => setViewingDiary(undefined)}
          onEdit={handleEdit}
          onDelete={deleteDiary}
        />
      )}
    </div>
  );
}
