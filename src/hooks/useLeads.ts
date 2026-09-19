import { useState, useEffect, useCallback, useMemo } from 'react';
import { Lead, LeadStatus } from '../types/lead';
import { leadService } from '../services/leadService';

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
  deleteLead: (id: string) => Promise<void>;
  stats: {
    total: number;
    qualified: number;
    needsWebsite: number;
    contacted: number;
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

  const deleteLead = useCallback(async (id: string) => {
    try {
      await leadService.deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (err: any) {
      setError(err?.message || 'Failed to delete lead');
    }
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Status filter
      if (selectedStatus !== 'all' && lead.status !== selectedStatus) {
        return false;
      }
      // Text search filter
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const matchesName = lead.name.toLowerCase().includes(query);
        const matchesCity = lead.location.city.toLowerCase().includes(query);
        const matchesCategory = lead.category.toLowerCase().includes(query);
        const matchesInstagram = lead.social.instagram?.handle?.toLowerCase().includes(query);
        return matchesName || matchesCity || matchesCategory || matchesInstagram;
      }
      return true;
    });
  }, [leads, selectedStatus, searchFilter]);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      qualified: leads.filter((l) => l.status === 'qualified').length,
      needsWebsite: leads.filter((l) => !l.website.hasWebsite).length,
      contacted: leads.filter((l) => l.status === 'contacted').length,
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
    deleteLead,
    stats,
  };
}
