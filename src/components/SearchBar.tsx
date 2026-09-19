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
        <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm focus-within:border-indigo-600 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-950/60 transition-all">
          <div className="pl-4 pr-2 text-slate-400 dark:text-slate-500">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Find 30 bridal boutiques in Srinagar with active Instagram and no website"
            className="w-full py-3.5 pr-24 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent focus:outline-none text-sm sm:text-base font-normal"
            disabled={isLoading}
          />
          {query && !isLoading && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-md mr-2 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Preset suggestions */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
          Example queries:
        </span>
        {SEARCH_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handleSelectPreset(preset.query)}
            disabled={isLoading}
            className="text-xs bg-white dark:bg-slate-850 dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-750 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-2.5 py-1 rounded-md transition-colors text-left cursor-pointer"
          >
            {preset.title}
          </button>
        ))}
      </div>
    </div>
  );
};
