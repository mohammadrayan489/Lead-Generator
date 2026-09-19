import { Lead, LeadStatus } from '../types/lead';
import { PIPELINE_STATUS_CONFIG, ORDERED_PIPELINE_STATUSES } from '../components/StatusSelector';

export interface StatusBreakdownItem {
  status: LeadStatus;
  label: string;
  description?: string;
  count: number;
  percentage: number;
  dotColor: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  hoverBgColor: string;
}

export interface LeadsSummaryData {
  totalLeads: number;
  breakdown: StatusBreakdownItem[];
}

/**
 * Calculates total count of leads and a complete breakdown of leads by status,
 * including counts, percentages, and display styling.
 */
export function calculateLeadsStatusSummary(
  leads: Lead[],
  includedStatuses: LeadStatus[] = ORDERED_PIPELINE_STATUSES
): LeadsSummaryData {
  const totalLeads = leads.length;

  // Build a map of status -> count
  const countMap = new Map<LeadStatus, number>();
  for (const lead of leads) {
    const current = countMap.get(lead.status) || 0;
    countMap.set(lead.status, current + 1);
  }

  // Determine all statuses to display: ordered list first, plus any status present in leads
  const statusSet = new Set<LeadStatus>(includedStatuses);
  for (const lead of leads) {
    if (lead.status) {
      statusSet.add(lead.status);
    }
  }

  const breakdown: StatusBreakdownItem[] = Array.from(statusSet).map((status) => {
    const count = countMap.get(status) || 0;
    const percentage = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
    const config = PIPELINE_STATUS_CONFIG[status] || {
      value: status,
      label: status.charAt(0).toUpperCase() + status.slice(1),
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      dot: 'bg-slate-400',
      border: 'border-slate-200',
      hoverBg: 'hover:bg-slate-100',
    };

    return {
      status,
      label: config.label,
      description: config.description,
      count,
      percentage,
      dotColor: config.dot,
      textColor: config.text,
      bgColor: config.bg,
      borderColor: config.border,
      hoverBgColor: config.hoverBg,
    };
  });

  return {
    totalLeads,
    breakdown,
  };
}
