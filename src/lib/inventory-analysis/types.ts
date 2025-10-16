export interface PropertyRecord {
  price: number;
  location: string;
  propertyType: string;
  status: string;
  agency: string;
  agentName: string;
  listingDate: Date;
  offerDate: Date | null;
}

export interface MovementMetrics {
  newListings: number;
  soldListings: number;
  currentStock: number;
}

export interface AgingBreakdown {
  lessThanMonth: { count: number; value: number };
  oneToTwoMonths: { count: number; value: number };
  twoToThreeMonths: { count: number; value: number };
  threeMonthsPlus: { count: number; value: number };
}

export interface ValueMetrics {
  newStockValue: number;
  soldStockValue: number;
  currentStockValue: number;
}

export interface SuburbStock {
  suburb: string;
  count: number;
  value: number;
}
