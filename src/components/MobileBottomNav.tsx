import React, { useState } from 'react';
import {
  Sparkles,
  LayoutGrid,
  Layers,
  Kanban,
  Star,
  ChevronUp,
  X,
} from 'lucide-react';
import { NicheId, NICHE_DEFINITIONS } from '../utils/nicheClassifier';

export type MobileTab = 'discover' | 'leads' | 'niches' | 'pipeline' | 'pitched';

interface MobileBottomNavProps {
  currentTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  totalLeadsCount: number;
  pitchedLeadsCount: number;
  selectedNiche: NicheId | 'all';
  onSelectNiche: (niche: NicheId | 'all') => void;
  nicheCounts: Partial<Record<NicheId, number>>;
  onScrollToTop?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  totalLeadsCount,
  pitchedLeadsCount,
  selectedNiche,
  onSelectNiche,
  nicheCounts,
  onScrollToTop,
}) => {
  const [showNicheSheet, setShowNicheSheet] = useState(false);

  const orderedNicheKeys: NicheId[] = [
    'gyms',
    'bridal_jewelry',
    'cafes_dining',
    'contractors',
    'fashion_boutique',
    'handicrafts_artisan',
    'saffron_dryfruits',
    'hospitality_tourism',
    'other',
  ];

  const handleNicheTabClick = () => {
    if (currentTab === 'niches') {
      // If already on niches, toggle the quick-select sheet for even easier navigation
      setShowNicheSheet((prev) => !prev);
    } else {
      onSelectTab('niches');
    }
  };

  const handleSelectNicheFromSheet = (nicheId: NicheId | 'all') => {
    onSelectNiche(nicheId);
    onSelectTab('niches');
    setShowNicheSheet(false);
  };

  return (
    <>
      {/* Quick Niche Drawer / Bottom Sheet for Mobile */}
      {showNicheSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150 sm:hidden">
          <div
            className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-2xl shadow-2xl p-4 max-h-[75vh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
            style={{ paddingBottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px))' }}
          >
            {/* Sheet Handle & Header */}
            <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-3" />
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Kashmir Niches Quick Jump
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select a targeted industry sector in Kashmir
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNicheSheet(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* All Niches Reset Option */}
            <div className="mt-3 space-y-1.5">
              <button
                type="button"
                onClick={() => handleSelectNicheFromSheet('all')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  selectedNiche === 'all'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 font-semibold shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>All Niches (Full Database)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 font-bold">
                  {totalLeadsCount}
                </span>
              </button>

              {/* Individual Kashmir Niches */}
              {orderedNicheKeys.map((nicheId) => {
                const def = NICHE_DEFINITIONS[nicheId];
                const count = nicheCounts[nicheId] || 0;
                const isSelected = selectedNiche === nicheId;
                const NIcon = def.icon;

                return (
                  <button
                    key={nicheId}
                    type="button"
                    onClick={() => handleSelectNicheFromSheet(nicheId)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs'
                        : `${def.badgeBg} ${def.badgeText} border ${def.badgeBorder} hover:opacity-90`
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-white/70 dark:bg-slate-900/60'
                        }`}
                      >
                        <NIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left truncate">
                        <div className="font-semibold truncate">{def.label}</div>
                        <div
                          className={`text-[10px] truncate ${
                            isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {def.description}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                        isSelected
                          ? 'bg-white text-indigo-700'
                          : 'bg-black/10 dark:bg-white/15'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Static Fixed Bottom Navigation Menu Bar */}
      <nav
        id="mobile-bottom-static-menu"
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.35)] transition-colors block sm:hidden"
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)',
        }}
      >
        <div className="grid grid-cols-5 h-14 items-stretch px-1">
          {/* 1. Discover Tab */}
          <button
            type="button"
            id="mobile-nav-discover-btn"
            onClick={() => onSelectTab('discover')}
            className={`flex flex-col items-center justify-center relative py-1 px-0.5 text-center transition-all cursor-pointer select-none active:scale-95 ${
              currentTab === 'discover'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
            }`}
          >
            {currentTab === 'discover' && (
              <span className="absolute top-0 w-8 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
            <div className="relative">
              <Sparkles
                className={`w-4 h-4 transition-transform ${
                  currentTab === 'discover' ? 'scale-110' : ''
                }`}
              />
            </div>
            <span className="text-[10px] mt-1 tracking-tight leading-none">Discover</span>
          </button>

          {/* 2. All Leads Tab */}
          <button
            type="button"
            id="mobile-nav-leads-btn"
            onClick={() => onSelectTab('leads')}
            className={`flex flex-col items-center justify-center relative py-1 px-0.5 text-center transition-all cursor-pointer select-none active:scale-95 ${
              currentTab === 'leads'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
            }`}
          >
            {currentTab === 'leads' && (
              <span className="absolute top-0 w-8 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
            <div className="relative">
              <LayoutGrid
                className={`w-4 h-4 transition-transform ${
                  currentTab === 'leads' ? 'scale-110' : ''
                }`}
              />
              {totalLeadsCount > 0 && (
                <span className="absolute -top-1.5 -right-3 text-[9px] font-bold px-1 py-0.2 rounded-full bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 leading-tight">
                  {totalLeadsCount > 99 ? '99+' : totalLeadsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight leading-none">All Leads</span>
          </button>

          {/* 3. Niches Tab */}
          <button
            type="button"
            id="mobile-nav-niches-btn"
            onClick={handleNicheTabClick}
            className={`flex flex-col items-center justify-center relative py-1 px-0.5 text-center transition-all cursor-pointer select-none active:scale-95 ${
              currentTab === 'niches'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
            }`}
            title="Click to view Kashmir Niches, click again to open quick picker"
          >
            {currentTab === 'niches' && (
              <span className="absolute top-0 w-8 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
            <div className="relative">
              <Layers
                className={`w-4 h-4 transition-transform ${
                  currentTab === 'niches' ? 'scale-110' : ''
                }`}
              />
              {selectedNiche !== 'all' && (
                <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              )}
            </div>
            <div className="flex items-center gap-0.5 mt-1 leading-none">
              <span className="text-[10px] tracking-tight">Niches</span>
              <ChevronUp
                className={`w-2.5 h-2.5 opacity-60 transition-transform ${
                  showNicheSheet ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {/* 4. Pipeline Tab */}
          <button
            type="button"
            id="mobile-nav-pipeline-btn"
            onClick={() => onSelectTab('pipeline')}
            className={`flex flex-col items-center justify-center relative py-1 px-0.5 text-center transition-all cursor-pointer select-none active:scale-95 ${
              currentTab === 'pipeline'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
            }`}
          >
            {currentTab === 'pipeline' && (
              <span className="absolute top-0 w-8 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
            <div className="relative">
              <Kanban
                className={`w-4 h-4 transition-transform ${
                  currentTab === 'pipeline' ? 'scale-110' : ''
                }`}
              />
            </div>
            <span className="text-[10px] mt-1 tracking-tight leading-none">Pipeline</span>
          </button>

          {/* 5. Pitched ★ Tab (WhatsApp ready/contacted leads) */}
          <button
            type="button"
            id="mobile-nav-pitched-btn"
            onClick={() => onSelectTab('pitched')}
            className={`flex flex-col items-center justify-center relative py-1 px-0.5 text-center transition-all cursor-pointer select-none active:scale-95 ${
              currentTab === 'pitched'
                ? 'text-amber-500 dark:text-amber-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 font-medium'
            }`}
          >
            {currentTab === 'pitched' && (
              <span className="absolute top-0 w-8 h-0.5 bg-amber-500 dark:bg-amber-400 rounded-full" />
            )}
            <div className="relative">
              <Star
                className={`w-4 h-4 transition-transform ${
                  currentTab === 'pitched'
                    ? 'fill-amber-400 text-amber-500 scale-110'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              {pitchedLeadsCount > 0 && (
                <span className="absolute -top-1.5 -right-3 text-[9px] font-bold px-1 py-0.2 rounded-full bg-amber-500 text-white leading-tight">
                  {pitchedLeadsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight leading-none">
              {currentTab === 'pitched' ? 'Pitched ★' : 'Pitched'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
