import React, { useState } from 'react';
import { useLeads } from '../hooks/useLeads';
import { useLeadPipeline } from '../hooks/useLeadPipeline';
import { SearchBar } from '../components/SearchBar';
import { LeadCard } from '../components/LeadCard';
import { LeadDetailModal } from '../components/LeadDetailModal';
import { PipelineProgress } from '../components/PipelineProgress';
import { EmptyState } from '../components/EmptyState';
import { Lead, LeadStatus } from '../types/lead';
import {
  Sparkles,
  Layers,
  CheckCircle2,
  Globe,
  MessageCircle,
  Search,
  RefreshCw,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const userId = 'demo_workspace_user';
  const {
    filteredLeads,
    isLoading: isLeadsLoading,
    selectedStatus,
    searchFilter,
    setSelectedStatus,
    setSearchFilter,
    refreshLeads,
    updateLeadStatus,
    stats,
  } = useLeads(userId);

  const { isProcessing, progress, runPipeline } = useLeadPipeline(() => {
    refreshLeads();
  });

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleSearch = async (query: string) => {
    try {
      await runPipeline(query, userId);
    } catch (err) {
      console.error('Pipeline execution error:', err);
    }
  };

  const statusOptions: { value: LeadStatus | 'all'; label: string; count?: number }[] = [
    { value: 'all', label: 'All Leads', count: stats.total },
    { value: 'qualified', label: 'Qualified', count: stats.qualified },
    { value: 'discovered', label: 'Discovered' },
    { value: 'verified', label: 'Verified' },
    { value: 'contacted', label: 'Contacted', count: stats.contacted },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Application Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 leading-none">
                  Lead-Generator
                </h1>
                <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 px-1.5 py-0.5 rounded">
                  AI Workspace
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                Business lead research, qualification & WhatsApp outreach
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refreshLeads()}
              disabled={isLeadsLoading}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
              title="Refresh leads list"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLeadsLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Data</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              LG
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Natural Language Prompt Area */}
        <div className="mb-8">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              AI Business Lead Discovery
            </h2>
            <p className="text-sm text-slate-600 mt-1.5">
              Enter target requirements in plain English to discover, verify, and qualify sales prospects.
            </p>
          </div>

          <SearchBar onSearch={handleSearch} isLoading={isProcessing} />
        </div>

        {/* Live Pipeline Status Feedback */}
        {progress && <PipelineProgress progress={progress} />}

        {/* Workspace Metrics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
              <span>Total Leads</span>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Stored in database</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-emerald-700 text-xs font-medium mb-1">
              <span>Qualified</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-700">{stats.qualified}</div>
            <div className="text-[11px] text-emerald-600 mt-0.5">High sales potential</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-amber-700 text-xs font-medium mb-1">
              <span>No Website</span>
              <Globe className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-amber-700">{stats.needsWebsite}</div>
            <div className="text-[11px] text-amber-600 mt-0.5">Prime web dev pitch</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-indigo-700 text-xs font-medium mb-1">
              <span>Contacted</span>
              <MessageCircle className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-indigo-700">{stats.contacted}</div>
            <div className="text-[11px] text-indigo-600 mt-0.5">Outreach initiated</div>
          </div>
        </div>

        {/* Lead Management Section */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          {/* Controls bar: Status filter tabs & Quick filter input */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
            {/* Status tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {statusOptions.map((opt) => {
                const isActive = selectedStatus === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedStatus(opt.value)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {typeof opt.count === 'number' && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? 'bg-slate-700 text-slate-200'
                            : 'bg-slate-100 text-slate-600'
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
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter results by name or city..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Leads Grid or Empty State */}
          <div className="p-4 sm:p-6 bg-slate-50/50 min-h-[300px]">
            {filteredLeads.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onStatusChange={updateLeadStatus}
                    onSelectLead={(l) => setSelectedLead(l)}
                  />
                ))}
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
        onStatusChange={updateLeadStatus}
      />
    </div>
  );
};
