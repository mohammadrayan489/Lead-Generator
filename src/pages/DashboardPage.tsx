import React, { useState, useEffect } from 'react';
import { useLeads } from '../hooks/useLeads';
import { useLeadPipeline } from '../hooks/useLeadPipeline';
import { useTheme } from '../hooks/useTheme';
import { SearchBar } from '../components/SearchBar';
import { LeadCard } from '../components/LeadCard';
import { LeadDetailModal } from '../components/LeadDetailModal';
import { PipelineProgress } from '../components/PipelineProgress';
import { EmptyState } from '../components/EmptyState';
import { SummaryHeader } from '../components/SummaryHeader';
import { ThemeToggle } from '../components/ThemeToggle';
import { TopLeadSearchBar } from '../components/TopLeadSearchBar';
import { Lead, LeadStatus } from '../types/lead';
import {
  Sparkles,
  Search,
  RefreshCw,
  Trash2,
  AlertTriangle,
  X,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const userId = 'demo_workspace_user';
  const { theme, toggleTheme } = useTheme();
  const {
    leads,
    filteredLeads,
    isLoading: isLeadsLoading,
    selectedStatus,
    searchFilter,
    setSelectedStatus,
    setSearchFilter,
    refreshLeads,
    updateLeadStatus,
    updateLead,
    deleteLead,
    deleteSelectedLeads,
    deleteAllLeads,
    stats,
  } = useLeads(userId);

  const { isProcessing, progress, runPipeline } = useLeadPipeline(() => {
    refreshLeads();
  });

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [isClearingAll, setIsClearingAll] = useState(false);
  const [showDeleteSelectedConfirm, setShowDeleteSelectedConfirm] = useState(false);

  const handleUpdateLead = (id: string, updates: Partial<Lead>) => {
    updateLead(id, updates);
    setSelectedLead((prev) => (prev && prev.id === id ? { ...prev, ...updates } : prev));
  };

  const handleToggleSelect = (id: string) => {
    setSelectedLeadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (filteredLeads.length > 0 && selectedLeadIds.size === filteredLeads.length) {
      setSelectedLeadIds(new Set());
    } else {
      setSelectedLeadIds(new Set(filteredLeads.map((l) => l.id)));
    }
  };

  const handleRequestDeleteLead = (lead: Lead) => {
    setLeadToDelete(lead);
  };

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    if (selectedLead?.id === id) {
      setSelectedLead((prev) => (prev ? { ...prev, status } : null));
    }
    await updateLeadStatus(id, status);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (leadToDelete) setLeadToDelete(null);
        if (showDeleteAllConfirm) setShowDeleteAllConfirm(false);
        if (showDeleteSelectedConfirm) setShowDeleteSelectedConfirm(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [leadToDelete, showDeleteAllConfirm, showDeleteSelectedConfirm]);

  const handleConfirmDeleteSingle = async () => {
    if (!leadToDelete) return;
    const id = leadToDelete.id;
    if (selectedLead?.id === id) {
      setSelectedLead(null);
    }
    setSelectedLeadIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    await deleteLead(id);
    setLeadToDelete(null);
  };

  const handleConfirmDeleteSelected = async () => {
    const ids = Array.from(selectedLeadIds);
    if (ids.length === 0) return;
    if (selectedLead && ids.includes(selectedLead.id)) {
      setSelectedLead(null);
    }
    await deleteSelectedLeads(ids);
    setSelectedLeadIds(new Set());
    setShowDeleteSelectedConfirm(false);
  };

  const handleConfirmDeleteAll = async () => {
    setIsClearingAll(true);
    try {
      setSelectedLead(null);
      setSelectedLeadIds(new Set());
      await deleteAllLeads();
      setShowDeleteAllConfirm(false);
    } finally {
      setIsClearingAll(false);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      await runPipeline(query, userId);
    } catch (err) {
      console.error('Pipeline execution error:', err);
    }
  };

  const statusOptions: { value: LeadStatus | 'all'; label: string; count?: number }[] = [
    { value: 'all', label: 'All Leads', count: stats.total },
    { value: 'new', label: 'New', count: leads.filter((l) => l.status === 'new').length },
    { value: 'contacted', label: 'Contacted', count: stats.contacted },
    { value: 'qualified', label: 'Qualified', count: stats.qualified },
    { value: 'lost', label: 'Lost', count: leads.filter((l) => l.status === 'lost').length },
    { value: 'discovered', label: 'Discovered', count: leads.filter((l) => l.status === 'discovered').length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Application Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 dark:text-white leading-none">
                  Lead-Generator
                </h1>
                <span className="text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 px-1.5 py-0.5 rounded">
                  Jammu & Kashmir
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden xl:block">
                Jammu & Kashmir business lead research, qualification & WhatsApp outreach
              </p>
            </div>
          </div>

          {/* Top Search Input Bar for Real-time Lead Filtering */}
          <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-1 sm:mx-4">
            <TopLeadSearchBar
              id="top-dashboard-search-input"
              value={searchFilter}
              onChange={setSearchFilter}
              totalMatches={filteredLeads.length}
              totalLeads={leads.length}
              placeholder="Search J&K leads by name, company, city..."
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Dark Mode Toggle Button */}
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

            <button
              onClick={() => refreshLeads()}
              disabled={isLeadsLoading}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Refresh leads list"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLeadsLoading ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Sync Data</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-200/50 dark:border-indigo-700/50">
              JK
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Natural Language Prompt Area */}
        <div className="mb-8">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Jammu & Kashmir Lead Discovery
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5">
              Discover, verify, and qualify high-potential client leads across Srinagar, Jammu, and the Kashmir Valley.
            </p>
          </div>

          <SearchBar onSearch={handleSearch} isLoading={isProcessing} />
        </div>

        {/* Live Pipeline Status Feedback */}
        {progress && <PipelineProgress progress={progress} />}

        {/* Summary Header: Total Leads Count and Breakdown by Status */}
        <SummaryHeader
          leads={leads}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          needsWebsiteCount={stats.needsWebsite}
          onClearAll={() => setShowDeleteAllConfirm(true)}
        />

        {/* Lead Management Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden transition-colors">
          {/* Controls bar: Status filter tabs & Quick filter input */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900">
            {/* Status tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {statusOptions.map((opt) => {
                const isActive = selectedStatus === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedStatus(opt.value)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {typeof opt.count === 'number' && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? 'bg-slate-700 dark:bg-slate-300 text-slate-200 dark:text-slate-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {opt.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* In-memory quick filter */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by name, company, city..."
                className="w-full pl-8 pr-8 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-0.5"
                  title="Clear filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Bulk Selection & Action Toolbar (Only shown when leads exist) */}
          {stats.total > 0 && (
            <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium select-none">
                  <input
                    type="checkbox"
                    checked={filteredLeads.length > 0 && selectedLeadIds.size === filteredLeads.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <span>
                    {selectedLeadIds.size > 0
                      ? `${selectedLeadIds.size} of ${filteredLeads.length} selected`
                      : `Select all (${filteredLeads.length})`}
                  </span>
                </label>

                {selectedLeadIds.size > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedLeadIds(new Set())}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 underline text-[11px] cursor-pointer"
                  >
                    Clear selection
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedLeadIds.size > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteSelectedConfirm(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800/80 transition-colors shadow-xs cursor-pointer"
                    title="Delete currently selected leads"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected ({selectedLeadIds.size})</span>
                  </button>
                )}

                <button
                  type="button"
                  id="clear-all-leads-btn"
                  onClick={() => setShowDeleteAllConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-800/60 transition-colors cursor-pointer"
                  title="Clear all leads from the current list"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                  <span>Clear All Leads</span>
                </button>
              </div>
            </div>
          )}

          {/* Leads Grid or Empty State */}
          <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/40 min-h-[300px]">
            {filteredLeads.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onStatusChange={handleStatusChange}
                    onSelectLead={(l) => setSelectedLead(l)}
                    onDeleteLead={handleRequestDeleteLead}
                    onUpdateLead={handleUpdateLead}
                    isSelected={selectedLeadIds.has(lead.id)}
                    onToggleSelect={handleToggleSelect}
                  />
                ))}
              </div>
            ) : leads.length > 0 ? (
              <div
                id="no-matching-leads-view"
                className="text-center py-12 px-4 max-w-md mx-auto"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  No matching leads found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {searchFilter ? (
                    <>
                      No leads matching <span className="font-semibold text-slate-700 dark:text-slate-300">"{searchFilter}"</span>
                      {selectedStatus !== 'all' ? ` in ${selectedStatus} status` : ''}.
                    </>
                  ) : (
                    <>No leads currently found in {selectedStatus} status.</>
                  )}
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  {searchFilter && (
                    <button
                      type="button"
                      id="clear-search-filter-empty-btn"
                      onClick={() => setSearchFilter('')}
                      className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline px-2 py-1 cursor-pointer"
                    >
                      Clear search filter
                    </button>
                  )}
                  {selectedStatus !== 'all' && (
                    <button
                      type="button"
                      id="reset-status-filter-empty-btn"
                      onClick={() => setSelectedStatus('all')}
                      className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:underline px-2 py-1 cursor-pointer"
                    >
                      Show all statuses
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <EmptyState onSelectPreset={handleSearch} />
            )}
          </div>
        </div>
      </main>

      {/* Modal View for detailed lead qualification & WhatsApp pitch */}
      <LeadDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onStatusChange={handleStatusChange}
        onUpdateLead={handleUpdateLead}
        onDeleteLead={handleRequestDeleteLead}
      />

      {/* Confirmation Modal for Delete Single Lead */}
      {leadToDelete && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setLeadToDelete(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Lead?</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  Are you sure you want to delete <strong className="text-slate-900 dark:text-white font-semibold">{leadToDelete.name}</strong>
                  {leadToDelete.location?.city ? ` in ${leadToDelete.location.city}` : ''}?
                </p>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 rounded-lg p-2.5 space-y-1">
                  <p>
                    All associated qualification insights, conversation notes, and personalized WhatsApp pitches will be permanently deleted.
                  </p>
                  <p className="text-rose-600 dark:text-rose-400 font-medium">This action cannot be undone.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setLeadToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSingle}
                className="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete Lead</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Confirmation Modal for Clear All Leads */}
      {showDeleteAllConfirm && (
        <div
          id="clear-all-leads-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-all-leads-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => !isClearingAll && setShowDeleteAllConfirm(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white" id="clear-all-leads-title">
                  Clear All Leads?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  Are you sure you want to empty your lead list? This will permanently delete all{' '}
                  <strong className="text-slate-900 dark:text-white font-semibold">{stats.total} leads</strong> from your current workspace.
                </p>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 rounded-lg p-3 space-y-1.5">
                  <div className="font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                    <span>This action will permanently erase:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
                    <li>All {stats.total} prospect business records</li>
                    <li>Qualification scores and verified attributes</li>
                    <li>Custom conversation notes and generated WhatsApp pitches</li>
                  </ul>
                  <p className="text-rose-600 dark:text-rose-400 font-medium pt-0.5">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                id="cancel-clear-all-leads-btn"
                disabled={isClearingAll}
                onClick={() => setShowDeleteAllConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-clear-all-leads-btn"
                disabled={isClearingAll}
                onClick={handleConfirmDeleteAll}
                className="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isClearingAll ? 'Clearing Leads...' : 'Yes, Clear All Leads'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete Selected */}
      {showDeleteSelectedConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Selected Leads?</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  Are you sure you want to delete the <strong className="text-slate-900 dark:text-white">{selectedLeadIds.size} selected leads</strong>? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowDeleteSelectedConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSelected}
                className="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete Selected</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
