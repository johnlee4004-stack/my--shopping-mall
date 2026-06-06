'use client';

import { useState, useMemo, useEffect } from 'react';
import { useDiaryStore } from './store/diaryStore';
import { DiaryEntry } from './types/diary';
import DiaryCard from './components/DiaryCard';
import DiaryForm from './components/DiaryForm';
import DiaryDetail from './components/DiaryDetail';
import SearchBar from './components/SearchBar';
import StatsBar from './components/StatsBar';
import { Plus, BookOpen, Search, Home, SlidersHorizontal } from 'lucide-react';

type SortOption = 'newest' | 'oldest' | 'location';
type TabType = 'home' | 'search' | 'filter';

export default function HomePage() {
  const { diaries, isLoaded, addDiary, updateDiary, deleteDiary, searchDiaries } = useDiaryStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDiary, setEditingDiary] = useState<DiaryEntry | undefined>();
  const [viewingDiary, setViewingDiary] = useState<DiaryEntry | undefined>();
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterMood, setFilterMood] = useState<DiaryEntry['mood'] | 'all'>('all');
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // PWA 숏컷: ?action=new 로 실행 시 바로 작성 폼 열기
  useEffect(() => {
    const handler = () => { setEditingDiary(undefined); setShowForm(true); };
    window.addEventListener('open-new-diary', handler);
    return () => window.removeEventListener('open-new-diary', handler);
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = searchQuery ? searchDiaries(searchQuery) : [...diaries];
    if (filterMood !== 'all') result = result.filter(d => d.mood === filterMood);
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      return a.location.localeCompare(b.location);
    });
    return result;
  }, [diaries, searchQuery, sortBy, filterMood, searchDiaries]);

  const handleSubmit = (data: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingDiary) updateDiary(editingDiary.id, data);
    else addDiary(data);
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
        <div className="flex flex-col items-center gap-3">
          <BookOpen className="text-blue-400 animate-pulse" size={40} />
          <p className="text-gray-400">불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* ── 헤더 ── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="text-blue-500" size={24} />
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">여행 일기</h1>
              <p className="text-xs text-gray-400 hidden sm:block">소중한 여행의 기억을 남겨보세요</p>
            </div>
          </div>
          {/* 데스크탑 전용 버튼 */}
          <button
            onClick={() => { setEditingDiary(undefined); setShowForm(true); }}
            className="hidden sm:flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
          >
            <Plus size={18} />
            새 일기
          </button>
        </div>
      </header>

      {/* ── 메인 콘텐츠 ── */}
      <main className="max-w-6xl mx-auto px-4 pt-6 pb-28 sm:pb-10">
        <StatsBar diaries={diaries} />

        {/* 검색 (모바일: search 탭일 때 / 데스크탑: 항상) */}
        <div className={`mb-4 ${activeTab !== 'search' ? 'hidden sm:block' : 'block'}`}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* 필터 (모바일: filter 탭일 때 / 데스크탑: 항상) */}
        <div className={`mb-6 ${activeTab !== 'filter' ? 'hidden sm:block' : 'block'}`}>
          <div className="flex items-center gap-3">
            {/* 기분 필터 - 가로 스크롤 */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 pb-1">
              {moodFilters.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilterMood(f.value)}
                  className={`flex-shrink-0 text-sm px-3 py-1.5 rounded-full transition-colors ${
                    filterMood === f.value
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {f.emoji} {f.label}
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="flex-shrink-0 text-sm border border-gray-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="newest">최신순</option>
              <option value="oldest">오래된순</option>
              <option value="location">장소순</option>
            </select>
          </div>
        </div>

        {/* 검색 결과 안내 */}
        {searchQuery && (
          <p className="text-sm text-gray-500 mb-4">
            &quot;{searchQuery}&quot; 검색 결과: {filteredAndSorted.length}개
          </p>
        )}

        {/* 일기 목록 */}
        {filteredAndSorted.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fade-in">
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

      {/* ── 모바일 하단 내비게이션 ── */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl transition-colors ${
              activeTab === 'home' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <Home size={22} />
            <span className="text-xs font-medium">홈</span>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl transition-colors ${
              activeTab === 'search' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <Search size={22} />
            <span className="text-xs font-medium">검색</span>
          </button>
          <button
            onClick={() => setActiveTab('filter')}
            className={`flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl transition-colors ${
              activeTab === 'filter' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <SlidersHorizontal size={22} />
            <span className="text-xs font-medium">필터</span>
          </button>
        </div>
      </nav>

      {/* ── 모바일 FAB ── */}
      <button
        onClick={() => { setEditingDiary(undefined); setShowForm(true); }}
        className="sm:hidden fixed bottom-20 right-5 z-40 w-14 h-14 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white rounded-full shadow-lg flex items-center justify-center transition-all"
        aria-label="새 일기 작성"
        style={{ boxShadow: '0 4px 20px rgba(59,130,246,0.5)' }}
      >
        <Plus size={26} />
      </button>

      {/* ── 모달 ── */}
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
