// Helper functions for Leads Performance page

import { parse } from 'date-fns';

export interface LeadRecord {
  'Date (SAST)': string;
  Franchise: string;
  'Web reference': string;
  Source: string;
  'Lead WA No.': string;
  'Lead Name': string;
  'Agent WA. No Notified': string;
  'Agent Name': string;
  Status: string;
  'Agent Notification Status': string;
  'Agent Response Time': number;
  'Unique Log ID': string;
  lead_type: 'Sales' | 'Rental';
}

export interface AgentData {
  agent_name: string;
  agent_notified: number;
  agent_responded: number;
  grand_total: number;
  response_rate: number;
}

export interface AgencyData {
  agency: string;
  agent_notified: number;
  agent_responded: number;
  grand_total: number;
  response_rate: number;
}

export interface LeadSource {
  source: string;
  count: number;
  percentage: number;
}

/**
 * Parse lead date from format "18 Sept 2025, 03:24:24"
 */
export function parseLeadDate(dateString: string): Date {
  return parse(dateString, 'dd MMM yyyy, HH:mm:ss', new Date());
}

/**
 * Filter leads by date range
 */
export function filterLeadsByDateRange(
  leads: LeadRecord[],
  startDate: Date | null,
  endDate: Date | null
): LeadRecord[] {
  if (!startDate && !endDate) return leads;
  
  return leads.filter(lead => {
    const leadDate = parseLeadDate(lead['Date (SAST)']);
    if (startDate && leadDate < startDate) return false;
    if (endDate && leadDate > endDate) return false;
    return true;
  });
}

/**
 * Aggregate leads by agent
 */
export function aggregateByAgent(leads: LeadRecord[]): AgentData[] {
  const agentMap = new Map<string, { notified: number; responded: number; total: number }>();
  
  leads.forEach(lead => {
    const agentName = lead['Agent Name'];
    if (!agentName || agentName.trim() === '') return;
    
    const current = agentMap.get(agentName) || { notified: 0, responded: 0, total: 0 };
    current.total++;
    
    if (lead.Status === 'Agent Notified') {
      current.notified++;
    } else if (lead.Status === 'Agent Responded') {
      current.responded++;
    }
    
    agentMap.set(agentName, current);
  });
  
  return Array.from(agentMap.entries()).map(([agent_name, stats]) => ({
    agent_name,
    agent_notified: stats.notified,
    agent_responded: stats.responded,
    grand_total: stats.total,
    response_rate: stats.total > 0 ? (stats.responded / stats.total) * 100 : 0
  }));
}

/**
 * Aggregate leads by Property Engine agency
 */
export function aggregatePEAgencies(leads: LeadRecord[]): AgencyData[] {
  const agencyMap = new Map<string, { notified: number; responded: number; total: number }>();
  
  leads.forEach(lead => {
    const agency = lead.Franchise;
    if (!agency || agency.trim() === '' || !agency.startsWith('PE')) return;
    
    const current = agencyMap.get(agency) || { notified: 0, responded: 0, total: 0 };
    current.total++;
    
    if (lead.Status === 'Agent Notified') {
      current.notified++;
    } else if (lead.Status === 'Agent Responded') {
      current.responded++;
    }
    
    agencyMap.set(agency, current);
  });
  
  return Array.from(agencyMap.entries()).map(([agency, stats]) => ({
    agency,
    agent_notified: stats.notified,
    agent_responded: stats.responded,
    grand_total: stats.total,
    response_rate: stats.total > 0 ? (stats.responded / stats.total) * 100 : 0
  }));
}

/**
 * Aggregate competitor agencies
 */
export function aggregateCompetitorAgencies(leads: LeadRecord[]): Array<{
  org_name: string;
  agency: string;
  leads: number;
  leads_responded: number;
  response_rate: number;
}> {
  const agencyMap = new Map<string, { leads: number; responded: number }>();
  
  leads.forEach(lead => {
    const agency = lead.Franchise;
    if (!agency || agency.trim() === '' || agency.startsWith('PE')) return;
    
    const current = agencyMap.get(agency) || { leads: 0, responded: 0 };
    current.leads++;
    
    if (lead.Status === 'Agent Responded') {
      current.responded++;
    }
    
    agencyMap.set(agency, current);
  });
  
  return Array.from(agencyMap.entries()).map(([agency, stats]) => ({
    org_name: 'Competitor Agency',
    agency: agency,
    leads: stats.leads,
    leads_responded: stats.responded,
    response_rate: stats.leads > 0 ? (stats.responded / stats.leads) * 100 : 0
  }));
}

/**
 * Calculate top lead sources
 */
export function calculateLeadSources(leads: LeadRecord[]): LeadSource[] {
  const sourceCount: Record<string, number> = {};
  
  leads.forEach(lead => {
    const source = lead.Source;
    if (source && lead.lead_type === 'Sales') {
      sourceCount[source] = (sourceCount[source] || 0) + 1;
    }
  });
  
  const totalLeads = Object.values(sourceCount).reduce((sum, count) => sum + count, 0);
  
  return Object.entries(sourceCount)
    .map(([source, count]) => ({
      source,
      count,
      percentage: totalLeads > 0 ? (count / totalLeads) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}
