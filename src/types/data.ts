// Shared type definitions for dashboard data

export interface SalesRecord {
  id: number;
  lead_source: string | null;
  reported_date: string;
  registered_date: string | null;
  purchase_amount: number;
  commission_amount: number;
  web_reference: string | null;
  account_name: string;
  agent_names: string | null;
  name: string;
  sales_leads_count: number;
  sales_leads_responded: number;
  sales_response_rate: number;
  avg_sales_response_time_minutes: number;
  lead_source_p24_count: number;
  lead_source_pp_count: number;
  lead_source_website_count: number;
  lead_source_other_count: number;
  commission_percentage: number;
  nett_commission_amount: number;
  royalty_fees_amount: number;
  days_to_close: number;
  listed_date: string | null;
  account_id: number;
  buyer_enquiry_source_id: number | null;
  data_error: boolean;
  has_lead_source: boolean;
  has_web_reference: boolean;
}

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

export interface OverviewMetrics {
  totalLeads: number;
  responseRate: number;
  propertiesSold: number;
  totalRevenue: number;
  totalCommission: number;
  leadsPerSale: number;
}

export interface LeadSourceBreakdown {
  source: string;
  count: number;
  percentage: number;
  revenue: number;
  revenuePercentage: number;
  commission: number;
  commissionPercentage: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  count: number;
}
