// Property Lead Insights Types

export interface PropertyLeadFilters {
  dateRange: string;
  agency?: string;
  agent?: string;
}

export interface OverviewMetrics {
  totalProperties: number;
  totalEnquiries: number;
  uniqueLeads: number;
  conversionRate: string;
}

export interface Property {
  id: number;
  propertyName: string;
  reference: string;
  suburb: string;
  price: number;
  totalEnquiries: number;
  uniqueLeads: number;
  lastEnquired: string;
  hasOffer: boolean;
  agency: string;
  agent: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
}

export interface PropertyDetails {
  uniqueLeads: number;
  totalEnquiries: number;
  firstEnquired: string;
  lastEnquired: string;
  sourceBreakdown: {
    property24: number;
    privateProperty: number;
    website: number;
    other: number;
  };
  topLeads: LeadInfo[];
}

export interface LeadInfo {
  id: number;
  name: string;
  timesEnquired: number;
  totalProperties: number;
  budgetRange: string;
  suburbs: string[];
  lastActive: string;
}

export interface Suburb {
  name: string;
  enquiries: number;
  uniqueLeads: number;
  percentage: string;
}

export interface PriceRange {
  range: string;
  count: number;
  percentage: string;
}

export interface Source {
  name: string;
  count: number;
  percentage: string;
  color: string;
}

export interface Agent {
  name: string;
  agency: string;
  leadCount: number;
  enquiryCount: number;
}

export interface FilterOptions {
  agencies: string[];
  agents: string[];
}

export interface DashboardData {
  overview: OverviewMetrics;
  topProperties: Property[];
  topSuburbs: Suburb[];
  priceDistribution: PriceRange[];
  sourceBreakdown: Source[];
  topAgents: Agent[];
}
