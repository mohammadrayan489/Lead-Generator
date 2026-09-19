import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface TopLeadSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  totalMatches?: number;
  totalLeads?: number;
  placeholder?: string;
  className?: string;
  id?: string;
}

export const TopLeadSearchBar: React.FC<TopLeadSearchBarProps> = ({
  value,
  onChange,
  totalMatches,
  totalLeads,
  placeholder = 'Search leads by name or company...',
  className = '',
  id = 'top-leads-search-input',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut: Pressing '/' or 'Cmd+K' / 'Ctrl+K' focuses this search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if already in another editable element
      const target = e.target as HTMLElement | null;
      const isInput =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;

      if (
        (e.key === '/' && !isInput) ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && !isInput)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (value) {
        onChange('');
      } else {
        inputRef.current?.blur();
      }
    }
  };

  const isFiltering = value.trim().length > 0;

  return (
    <div
      className={`relative flex items-center w-full group ${className}`}
      id={`${id}-container`}
    >
      <div className="relative w-full flex items-center">
        {/* Leading Search Icon */}
        <div className="absolute left-3 pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
          <Search className="w-4 h-4" />
        </div>

        {/* Real-time Search Input */}
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search and filter leads by name or company"
          autoComplete="off"
          spellCheck="false"
          className="w-full pl-9 pr-20 sm:pr-24 py-1.5 sm:py-2 text-xs sm:text-sm bg-slate-100/80 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/60 transition-all shadow-2xs"
        />

        {/* Trailing Controls: Clear Button, Match Count & Shortcut Badge */}
        <div className="absolute right-2 flex items-center gap-1.5">
          {isFiltering ? (
            <>
              {typeof totalMatches === 'number' && (
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full select-none ${
                    totalMatches > 0
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/60'
                      : 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900/60'
                  }`}
                  title={`${totalMatches} matching leads`}
                >
                  {totalMatches} {totalMatches === 1 ? 'match' : 'matches'}
                </span>
              )}
              <button
                type="button"
                id={`${id}-clear-btn`}
                onClick={handleClear}
                className="p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 rounded-md transition-colors cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
                title="Clear filter (Esc)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-200/50 dark:bg-slate-700/50 border border-slate-300/60 dark:border-slate-600/60 rounded select-none pointer-events-none">
              <span className="text-[11px]">⌘</span>K
            </kbd>
          )}
        </div>
      </div>
    </div>
  );
};
