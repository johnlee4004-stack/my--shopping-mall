'use client';

import { Search, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

export default function SearchBar({ value, onChange, autoFocus }: Props) {
  return (
    <div className="relative">
      <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="제목, 장소, 국가, 내용, 태그로 검색..."
        autoFocus={autoFocus}
        className="w-full pl-11 pr-10 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
