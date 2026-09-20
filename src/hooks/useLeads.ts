import { useState, useEffect, useCallback, useMemo } from 'react';
import { Lead, LeadStatus } from '../types/lead';
import { leadService } from '../services/leadService';
import { filterLeadsBySearch } from '../utils/leadSearchFilter';

export interface UseLeadsReturn {
  leads: Lead[];
  filteredLeads: Lead[];
  isLoading: boolean;
  error: string | null;
  selectedStatus: LeadStatus | 'all';
  searchFilter: string;
  setSelectedStatus: (status: LeadStatus | 'all') => void;
  setSearchFilter: (filter: string) => void;
  refreshLeads: () => Promise<void>;
  updateLeadStatus: (id: string, status: LeadStatus) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  deleteSelectedLeads: (ids: string[]) => Promise<void>;
  deleteAllLeads: (purgeAll?: boolean) => Promise<void>;
  addStreamedLead: (lead: Lead) => void;
  stats: {
    total: number;
    newLeads: number;
    qualified: number;
    needsWebsite: number;
    contacted: number;
    lost: number;
  };
}

export function useLeads(userId: string = 'demo_workspace_user'): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | 'all'>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const refreshLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await leadService.getAllLeads(userId);
      setLeads(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refreshLeads();
  }, [refreshLeads]);

  const updateLeadStatus = useCallback(
    async (id: string, status: LeadStatus) => {
      try {
        await leadService.updateLead(id, { status });
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status, updatedAt: new Date().toISOString() } : l))
        );
      } catch (err: any) {
        setError(err?.message || 'Failed to update lead status');
      }
    },
    []
  );

  const updateLead = useCallback(
    async (id: string, updates: Partial<Lead>) => {
      try {
        await leadService.updateLead(id, updates);
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l))
        );
      } catch (err: any) {
        setError(err?.message || 'Failed to update lead');
      }
    },
    []
  );

  const deleteLead = useCallback(async (id: string) => {
    try {
      await leadService.deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (err: any) {
      setError(err?.message || 'Failed to delete lead');
    }
  }, []);

  const deleteSelectedLeads = useCallback(async (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    try {
      await leadService.batchDeleteLeads(ids);
      const idSet = new Set(ids);
      setLeads((prev) => prev.filter((l) => !idSet.has(l.id)));
    } catch (err: any) {
      setError(err?.message || 'Failed to delete selected leads');
    }
  }, []);

  const deleteAllLeads = useCallback(
    async (purgeAll: boolean = false) => {
      try {
        await leadService.deleteAllLeads(userId, purgeAll);
        setLeads([]);
      } catch (err: any) {
        setError(err?.message || 'Failed to delete all leads');
      }
    },
    [userId]
  );

  const addStreamedLead = useCallback((lead: Lead) => {
    setLeads((prev) => {
      const exists = prev.some((l) => l.id === lead.id);
      if (exists) {
        return prev.map((l) => (l.id === lead.id ? lead : l));
      }
      return [lead, ...prev];
    });
  }, []);

  const filteredLeads = useMemo(() => {
    const statusFiltered =
      selectedStatus === 'all' ? leads : leads.filter((l) => l.status === selectedStatus);
    return filterLeadsBySearch(statusFiltered, searchFilter);
  }, [leads, selectedStatus, searchFilter]);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      newLeads: leads.filter((l) => l.status === 'new' || l.status === 'discovered').length,
      qualified: leads.filter((l) => l.status === 'qualified').length,
      needsWebsite: leads.filter((l) => !l.website.hasWebsite).length,
      contacted: leads.filter((l) => l.status === 'contacted').length,
      lost: leads.filter((l) => l.status === 'lost' || l.status === 'unqualified').length,
    };
  }, [leads]);

  return {
    leads,
    filteredLeads,
    isLoading,
    error,
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
    addStreamedLead,
    stats,
  };
}
