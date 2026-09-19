import React, { useState } from 'react';
import { Search, Loader2, Sparkles, X } from 'lucide-react';
import { SEARCH_PRESETS } from '../data/searchPresets';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleSelectPreset = (presetQuery: string) => {
    setQuery(presetQuery);
    if (!isLoading) {
      onSearch(presetQuery);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-white border border-slate-300 rounded-xl shadow-sm focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <div className="pl-4 pr-2 text-slate-400">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Find 50 fashion businesses in Srinagar with strong Instagram presence and no website"
            className="w-full py-3.5 pr-24 text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none text-sm sm:text-base font-normal"
            disabled={isLoading}
          />
          {query && !isLoading && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md mr-2 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Preset suggestions */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          Example queries:
        </span>
        {SEARCH_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handleSelectPreset(preset.query)}
            disabled={isLoading}
            className="text-xs bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-indigo-600 px-2.5 py-1 rounded-md transition-colors text-left"
          >
            {preset.title}
          </button>
        ))}
      </div>
    </div>
  );
};
