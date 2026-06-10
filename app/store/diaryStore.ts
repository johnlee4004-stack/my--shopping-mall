'use client';

import { useState, useEffect, useCallback } from 'react';
import { DiaryEntry } from '../types/diary';
import { sampleDiaries } from '../data/sampleDiaries';

const STORAGE_KEY = 'travel-diaries';

export function useDiaryStore() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setDiaries(JSON.parse(stored));
    } else {
      setDiaries(sampleDiaries);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleDiaries));
    }
    setIsLoaded(true);
  }, []);

  const save = useCallback((entries: DiaryEntry[]) => {
    setDiaries(entries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, []);

  const addDiary = useCallback((entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: DiaryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDiaries(prev => {
      const updated = [newEntry, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    return newEntry;
  }, []);

  const updateDiary = useCallback((id: string, updates: Partial<DiaryEntry>) => {
    setDiaries(prev => {
      const updated = prev.map(d =>
        d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteDiary = useCallback((id: string) => {
    setDiaries(prev => {
      const updated = prev.filter(d => d.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const searchDiaries = useCallback((query: string) => {
    const q = query.toLowerCase();
    return diaries.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.location.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.content.toLowerCase().includes(q) ||
      d.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [diaries]);

  return { diaries, isLoaded, addDiary, updateDiary, deleteDiary, searchDiaries, save };
}
