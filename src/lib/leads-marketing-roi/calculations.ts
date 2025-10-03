// Lead Marketing ROI calculations
import _ from 'lodash';
import { parseISO, format } from 'date-fns';

interface LeadRecord {
  'Date (SAST)': string;
  Franchise: string;
  'Web reference': string;
  Source: string;
  Status: string;
  lead_type: 'Sales' | 'Rental';
}

interface SalesRecord {
  id: number;
  lead_source: string | null;
  reported_date: string;
  account_name: string;
  purchase_amount: number;
  commission_amount: number;
}

interface AgencySpend {
  account_name: string;
  agent_count: number;
  p24_monthly_spend: number;
  pp_monthly_spend: number;
}

interface ROIMetrics {
  totalLeads: number;
  respondedLeads: number;
  totalSales: number;
  totalSpend: number;
  costPerLead: number;
  costPerSale: number;
  effectiveCostPerLead: number;
  wastedCostPerLead: number;
  responseRate: number;
  wastageRate: number;
  wastedSpend: number;
}

interface AgencyROIMetrics extends ROIMetrics {
  account_name: string;
  p24Metrics: ROIMetrics;
  ppMetrics: ROIMetrics;
}

/**
 * Normalize agency names for matching between different data sources
 * Leads CSV uses "RealNet - AgencyName", Spend CSV uses "RealNet AgencyName"
 */
function normalizeAgencyName(name: string): string {
  return name
    .replace(' - ', ' ')  // Remove dash separator
    .replace(/\s*\([^)]*\)/g, '') // Remove anything in parentheses  
    .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
    .trim()
    .toLowerCase();
}

/**
 * Parse lead date from format "18 Sept 2025, 03:24:24"
 */
function parseLeadDate(dateString: string): Date {
  // Remove extra spaces and parse
  const cleanDate = dateString.trim();
  const parts = cleanDate.split(',');
  const datePart = parts[0].trim();
  
  // Parse day month year
  const [day, month, year] = datePart.split(' ');
  const monthMap: { [key: string]: number } = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Sept': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  
  return new Date(parseInt(year), monthMap[month], parseInt(day));
}

/**
 * Filter data by date range (exclude October)
 */
export function filterByDateRange<T extends { reported_date?: string; 'Date (SAST)'?: string }>(
  data: T[],
  startDate: Date | null,
  endDate: Date | null
): T[] {
  if (!startDate && !endDate) return data;
  
  return data.filter(record => {
    let recordDate: Date;
    
    if ('reported_date' in record && record.reported_date) {
      recordDate = parseISO(record.reported_date);
    } else if ('Date (SAST)' in record && record['Date (SAST)']) {
      recordDate = parseLeadDate(record['Date (SAST)']);
    } else {
      return false;
    }
    
    if (startDate && recordDate < startDate) return false;
    if (endDate && recordDate > endDate) return false;
    return true;
  });
}

/**
 * Calculate the number of months based on date range
 */
function calculateMonths(startDate: Date | null, endDate: Date | null): number {
  if (!startDate || !endDate) {
    return 9; // Default Jan-Sep
  }
  
  // Calculate full months between dates
  const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthsDiff = endDate.getMonth() - startDate.getMonth();
  const totalMonths = yearsDiff * 12 + monthsDiff + 1; // +1 to include both start and end month
  
  console.log('calculateMonths:', { startDate, endDate, totalMonths });
  
  return Math.max(1, totalMonths);
}

/**
 * Calculate ROI metrics for a specific source
 */
function calculateSourceMetrics(
  leads: LeadRecord[],
  sales: SalesRecord[],
  monthlySpend: number,
  months: number
): ROIMetrics {
  const totalSpend = monthlySpend * months;
  const totalLeads = leads.length;
  const respondedLeads = leads.filter(l => l.Status === 'Agent Responded').length;
  const totalSales = sales.length;
  
  const responseRate = totalLeads > 0 ? (respondedLeads / totalLeads) * 100 : 0;
  const wastageRate = 100 - responseRate;
  const wastedSpend = totalSpend * (wastageRate / 100);
  
  return {
    totalLeads,
    respondedLeads,
    totalSales,
    totalSpend,
    costPerLead: totalLeads > 0 ? totalSpend / totalLeads : 0,
    costPerSale: totalSales > 0 ? totalSpend / totalSales : 0,
    effectiveCostPerLead: respondedLeads > 0 ? totalSpend / respondedLeads : 0,
    wastedCostPerLead: (totalLeads - respondedLeads) > 0 ? wastedSpend / (totalLeads - respondedLeads) : 0,
    responseRate,
    wastageRate,
    wastedSpend
  };
}

/**
 * Calculate overall ROI metrics
 */
export function calculateOverallROI(
  leadsData: LeadRecord[],
  salesData: SalesRecord[],
  agencySpends: AgencySpend[],
  selectedAgency: string | null,
  startDate: Date | null,
  endDate: Date | null
): { p24: ROIMetrics; pp: ROIMetrics; combined: ROIMetrics } {
  // Calculate months based on date range
  const months = calculateMonths(startDate, endDate);
  // Filter leads (Sales type only)
  const salesLeads = leadsData.filter(l => l.lead_type === 'Sales');
  
  // Filter by agency if selected
  let filteredLeads = salesLeads;
  let filteredSales = salesData;
  
  if (selectedAgency && selectedAgency !== 'all') {
    const normalizedSelected = normalizeAgencyName(selectedAgency);
    filteredLeads = salesLeads.filter(l => 
      normalizeAgencyName(l.Franchise) === normalizedSelected
    );
    filteredSales = salesData.filter(s => 
      normalizeAgencyName(s.account_name) === normalizedSelected
    );
    
    console.log('Agency filter:', {
      selectedAgency,
      normalizedSelected,
      totalSalesLeads: salesLeads.length,
      filteredLeadsCount: filteredLeads.length,
      filteredSalesCount: filteredSales.length,
      sampleFranchises: salesLeads.slice(0, 5).map(l => l.Franchise),
      sampleNormalized: salesLeads.slice(0, 5).map(l => normalizeAgencyName(l.Franchise))
    });
  }
  
  // Separate by source
  const p24Leads = filteredLeads.filter(l => l.Source === 'Property24');
  const ppLeads = filteredLeads.filter(l => l.Source === 'Private Property');
  
  const p24Sales = filteredSales.filter(s => s.lead_source === 'Property24');
  const ppSales = filteredSales.filter(s => s.lead_source === 'Private Property');
  
  // Calculate total monthly spend
  let p24MonthlySpend = 0;
  let ppMonthlySpend = 0;
  
  if (selectedAgency && selectedAgency !== 'all') {
    const agencyData = agencySpends.find(a => a.account_name === selectedAgency);
    if (agencyData) {
      p24MonthlySpend = agencyData.p24_monthly_spend;
      ppMonthlySpend = agencyData.pp_monthly_spend;
    }
  } else {
    p24MonthlySpend = _.sumBy(agencySpends, 'p24_monthly_spend');
    ppMonthlySpend = _.sumBy(agencySpends, 'pp_monthly_spend');
  }
  
  const p24Metrics = calculateSourceMetrics(p24Leads, p24Sales, p24MonthlySpend, months);
  const ppMetrics = calculateSourceMetrics(ppLeads, ppSales, ppMonthlySpend, months);
  
  // Combined metrics
  const combinedMetrics: ROIMetrics = {
    totalLeads: p24Metrics.totalLeads + ppMetrics.totalLeads,
    respondedLeads: p24Metrics.respondedLeads + ppMetrics.respondedLeads,
    totalSales: p24Metrics.totalSales + ppMetrics.totalSales,
    totalSpend: p24Metrics.totalSpend + ppMetrics.totalSpend,
    costPerLead: 0,
    costPerSale: 0,
    effectiveCostPerLead: 0,
    wastedCostPerLead: 0,
    responseRate: 0,
    wastageRate: 0,
    wastedSpend: p24Metrics.wastedSpend + ppMetrics.wastedSpend
  };
  
  const totalLeads = combinedMetrics.totalLeads;
  const respondedLeads = combinedMetrics.respondedLeads;
  const totalSales = combinedMetrics.totalSales;
  const totalSpend = combinedMetrics.totalSpend;
  
  combinedMetrics.costPerLead = totalLeads > 0 ? totalSpend / totalLeads : 0;
  combinedMetrics.costPerSale = totalSales > 0 ? totalSpend / totalSales : 0;
  combinedMetrics.effectiveCostPerLead = respondedLeads > 0 ? totalSpend / respondedLeads : 0;
  combinedMetrics.wastedCostPerLead = (totalLeads - respondedLeads) > 0 
    ? combinedMetrics.wastedSpend / (totalLeads - respondedLeads) : 0;
  combinedMetrics.responseRate = totalLeads > 0 ? (respondedLeads / totalLeads) * 100 : 0;
  combinedMetrics.wastageRate = 100 - combinedMetrics.responseRate;
  
  return {
    p24: p24Metrics,
    pp: ppMetrics,
    combined: combinedMetrics
  };
}

/**
 * Calculate ROI metrics per agency
 */
export function calculateAgencyROI(
  leadsData: LeadRecord[],
  salesData: SalesRecord[],
  agencySpends: AgencySpend[],
  startDate: Date | null,
  endDate: Date | null
): AgencyROIMetrics[] {
  const salesLeads = leadsData.filter(l => l.lead_type === 'Sales');
  const months = calculateMonths(startDate, endDate);
  
  return agencySpends.map(agencySpend => {
    const agencyName = agencySpend.account_name;
    const normalizedSpendName = normalizeAgencyName(agencyName);
    
    // Filter data for this agency using normalized name matching
    const agencyLeads = salesLeads.filter(l => 
      normalizeAgencyName(l.Franchise) === normalizedSpendName
    );
    const agencySales = salesData.filter(s => 
      normalizeAgencyName(s.account_name) === normalizedSpendName
    );
    
    // P24 metrics
    const p24Leads = agencyLeads.filter(l => l.Source === 'Property24');
    const p24Sales = agencySales.filter(s => s.lead_source === 'Property24');
    const p24Metrics = calculateSourceMetrics(
      p24Leads, 
      p24Sales, 
      agencySpend.p24_monthly_spend, 
      months
    );
    
    // PP metrics
    const ppLeads = agencyLeads.filter(l => l.Source === 'Private Property');
    const ppSales = agencySales.filter(s => s.lead_source === 'Private Property');
    const ppMetrics = calculateSourceMetrics(
      ppLeads, 
      ppSales, 
      agencySpend.pp_monthly_spend, 
      months
    );
    
    // Combined metrics for agency
    const totalSpend = p24Metrics.totalSpend + ppMetrics.totalSpend;
    const totalLeads = p24Metrics.totalLeads + ppMetrics.totalLeads;
    const respondedLeads = p24Metrics.respondedLeads + ppMetrics.respondedLeads;
    const totalSales = p24Metrics.totalSales + ppMetrics.totalSales;
    const wastedSpend = p24Metrics.wastedSpend + ppMetrics.wastedSpend;
    
    const responseRate = totalLeads > 0 ? (respondedLeads / totalLeads) * 100 : 0;
    
    return {
      account_name: agencyName,
      totalLeads,
      respondedLeads,
      totalSales,
      totalSpend,
      costPerLead: totalLeads > 0 ? totalSpend / totalLeads : 0,
      costPerSale: totalSales > 0 ? totalSpend / totalSales : 0,
      effectiveCostPerLead: respondedLeads > 0 ? totalSpend / respondedLeads : 0,
      wastedCostPerLead: (totalLeads - respondedLeads) > 0 
        ? wastedSpend / (totalLeads - respondedLeads) : 0,
      responseRate,
      wastageRate: 100 - responseRate,
      wastedSpend,
      p24Metrics,
      ppMetrics
    };
  });
}

/**
 * Get unique agencies for filter
 */
export function getUniqueAgencies(agencySpends: AgencySpend[]): string[] {
  return _.sortBy(agencySpends.map(a => a.account_name));
}

export type { ROIMetrics, AgencyROIMetrics, LeadRecord, SalesRecord, AgencySpend };