// Sales dashboard specific calculations
import _ from 'lodash';
import { format, parseISO, startOfMonth } from 'date-fns';
import type { 
  SalesRecord, 
  LeadRecord, 
  OverviewMetrics, 
  LeadSourceBreakdown,
  MonthlyRevenue 
} from '@/types/data';

/**
 * Filter sales data by selected agencies
 */
export function filterByAgencies(
  data: SalesRecord[], 
  agencies: string[]
): SalesRecord[] {
  if (agencies.length === 0) return data;
  return data.filter(sale => agencies.includes(sale.account_name));
}

/**
 * Filter data by date range
 */
export function filterByDateRange(
  data: SalesRecord[],
  startDate: Date | null,
  endDate: Date | null
): SalesRecord[] {
  if (!startDate && !endDate) return data;
  
  return data.filter(sale => {
    const saleDate = parseISO(sale.reported_date);
    if (startDate && saleDate < startDate) return false;
    if (endDate && saleDate > endDate) return false;
    return true;
  });
}

/**
 * Calculate overview metrics for the sales dashboard
 */
export function calculateOverviewMetrics(
  salesData: SalesRecord[],
  leadsData: LeadRecord[]
): OverviewMetrics {
  // Total leads - ALL sales leads from raw data
  const salesLeads = leadsData.filter(l => l.lead_type === 'Sales');
  const totalLeads = salesLeads.length;
  
  // Response rate - from sales leads data
  const respondedLeads = salesLeads.filter(l => l.Status === 'Agent Responded');
  const responseRate = salesLeads.length > 0 
    ? (respondedLeads.length / salesLeads.length) * 100 
    : 0;
  
  // Sales with leads (for leads per sale calculation)
  const salesWithLeads = salesData.filter(s => s.sales_leads_count > 0);
  
  // Properties sold - all sales
  const propertiesSold = salesData.length;
  
  // Total revenue - all sales
  const totalRevenue = _.sumBy(salesData, 'purchase_amount');
  
  // Total commission - all sales
  const totalCommission = _.sumBy(salesData, 'commission_amount');
  
  // Leads per sale - use linked leads (3,917) divided by sales with leads (348)
  const linkedLeadsTotal = _.sumBy(salesWithLeads, 'sales_leads_count');
  const leadsPerSale = salesWithLeads.length > 0 
    ? linkedLeadsTotal / salesWithLeads.length 
    : 0;
  
  return {
    totalLeads,
    responseRate,
    propertiesSold,
    totalRevenue,
    totalCommission,
    leadsPerSale
  };
}

/**
 * Calculate lead source breakdown (uses 476 properties with lead_source)
 */
export function calculateLeadSourceBreakdown(
  salesData: SalesRecord[]
): LeadSourceBreakdown[] {
  // Filter to only sales with lead_source
  const salesWithSource = salesData.filter(
    s => s.lead_source !== null && s.lead_source !== '' && s.lead_source !== undefined
  );
  
  // Group by lead source
  const grouped = _.groupBy(salesWithSource, 'lead_source');
  
  const totalCount = salesWithSource.length;
  const totalRevenue = _.sumBy(salesWithSource, 'purchase_amount');
  const totalCommission = _.sumBy(salesWithSource, 'commission_amount');
  
  const breakdown = Object.entries(grouped).map(([source, sales]) => {
    const count = sales.length;
    const revenue = _.sumBy(sales, 'purchase_amount');
    const commission = _.sumBy(sales, 'commission_amount');
    
    return {
      source,
      count,
      percentage: (count / totalCount) * 100,
      revenue,
      revenuePercentage: (revenue / totalRevenue) * 100,
      commission,
      commissionPercentage: (commission / totalCommission) * 100
    };
  });
  
  // Sort by count descending
  return _.orderBy(breakdown, ['count'], ['desc']);
}

/**
 * Calculate monthly revenue
 */
export function calculateMonthlyRevenue(
  salesData: SalesRecord[]
): MonthlyRevenue[] {
  // Group by month
  const grouped = _.groupBy(salesData, (sale) => {
    const date = parseISO(sale.reported_date);
    return format(startOfMonth(date), 'yyyy-MM');
  });
  
  const monthlyData = Object.entries(grouped).map(([monthKey, sales]) => {
    const date = parseISO(monthKey + '-01');
    return {
      month: format(date, 'MMM yyyy'),
      monthKey: monthKey, // Keep for sorting
      revenue: _.sumBy(sales, 'purchase_amount'),
      count: sales.length
    };
  });
  
  // Sort by monthKey (yyyy-MM format) to get chronological order
  return _.sortBy(monthlyData, 'monthKey').map(({ monthKey: _, ...rest }) => rest);
}

/**
 * Get unique agencies for filter
 */
export function getUniqueAgencies(salesData: SalesRecord[]): string[] {
  const agencies = _.uniq(salesData.map(s => s.account_name));
  return _.sortBy(agencies);
}
