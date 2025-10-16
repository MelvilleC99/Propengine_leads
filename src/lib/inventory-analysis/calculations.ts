import { parseISO, isAfter, isBefore, differenceInDays, isWithinInterval } from "date-fns";
import type { PropertyRecord, MovementMetrics, AgingBreakdown, ValueMetrics } from "./types";

/**
 * Get unique agencies from property data
 */
export function getUniqueAgencies(data: PropertyRecord[]): string[] {
  const agencies = new Set(data.map(record => record.agency));
  return Array.from(agencies).sort();
}

/**
 * Filter properties by selected agencies
 */
export function filterByAgencies(
  data: PropertyRecord[],
  selectedAgencies: string[]
): PropertyRecord[] {
  if (selectedAgencies.length === 0) return data;
  return data.filter(record => selectedAgencies.includes(record.agency));
}

/**
 * Calculate movement metrics for a given period
 * - New Listings: Properties listed during the period
 * - Sold Listings: Properties with offers during the period
 * - Current Stock: Properties that are currently active (listed but no offer yet)
 */
export function calculateMovementMetrics(
  data: PropertyRecord[],
  startDate: Date | null,
  endDate: Date | null
): MovementMetrics {
  const now = new Date();
  const periodEnd = endDate || now;
  
  // New Listings: Properties listed during the period
  let newListings = 0;
  if (startDate) {
    newListings = data.filter(record => 
      isWithinInterval(record.listingDate, { start: startDate, end: periodEnd })
    ).length;
  } else {
    newListings = data.length;
  }

  // Sold Listings: Properties with offer dates during the period
  let soldListings = 0;
  if (startDate) {
    soldListings = data.filter(record => 
      record.offerDate && 
      isWithinInterval(record.offerDate, { start: startDate, end: periodEnd })
    ).length;
  } else {
    soldListings = data.filter(record => record.offerDate !== null).length;
  }

  // Current Stock: Properties with no offer date (or offer date is after period end)
  const currentStock = data.filter(record => 
    !record.offerDate || isAfter(record.offerDate, periodEnd)
  ).length;

  return {
    newListings,
    soldListings,
    currentStock,
  };
}

/**
 * Calculate stock aging breakdown for current inventory
 */
export function calculateAgingBreakdown(
  data: PropertyRecord[],
  endDate: Date | null
): AgingBreakdown {
  const now = new Date();
  const referenceDate = endDate || now;

  // Only consider properties that are currently in stock (no offer or offer after reference date)
  const currentStock = data.filter(record => 
    !record.offerDate || isAfter(record.offerDate, referenceDate)
  );

  const aging = {
    lessThanMonth: { count: 0, value: 0 },
    oneToTwoMonths: { count: 0, value: 0 },
    twoToThreeMonths: { count: 0, value: 0 },
    threeMonthsPlus: { count: 0, value: 0 },
  };

  currentStock.forEach(record => {
    const daysOld = differenceInDays(referenceDate, record.listingDate);
    
    if (daysOld < 30) {
      aging.lessThanMonth.count++;
      aging.lessThanMonth.value += record.price;
    } else if (daysOld < 60) {
      aging.oneToTwoMonths.count++;
      aging.oneToTwoMonths.value += record.price;
    } else if (daysOld < 90) {
      aging.twoToThreeMonths.count++;
      aging.twoToThreeMonths.value += record.price;
    } else {
      aging.threeMonthsPlus.count++;
      aging.threeMonthsPlus.value += record.price;
    }
  });

  return aging;
}

/**
 * Calculate value metrics for a given period
 */
export function calculateValueMetrics(
  data: PropertyRecord[],
  startDate: Date | null,
  endDate: Date | null
): ValueMetrics {
  const now = new Date();
  const periodEnd = endDate || now;

  // New Stock Value: Total value of properties listed during the period
  let newStockValue = 0;
  if (startDate) {
    newStockValue = data
      .filter(record => 
        isWithinInterval(record.listingDate, { start: startDate, end: periodEnd })
      )
      .reduce((sum, record) => sum + record.price, 0);
  } else {
    newStockValue = data.reduce((sum, record) => sum + record.price, 0);
  }

  // Sold Stock Value: Total value of properties with offers during the period
  let soldStockValue = 0;
  if (startDate) {
    soldStockValue = data
      .filter(record => 
        record.offerDate && 
        isWithinInterval(record.offerDate, { start: startDate, end: periodEnd })
      )
      .reduce((sum, record) => sum + record.price, 0);
  } else {
    soldStockValue = data
      .filter(record => record.offerDate !== null)
      .reduce((sum, record) => sum + record.price, 0);
  }

  // Current Stock Value: Total value of properties currently in inventory
  const currentStockValue = data
    .filter(record => !record.offerDate || isAfter(record.offerDate, periodEnd))
    .reduce((sum, record) => sum + record.price, 0);

  return {
    newStockValue,
    soldStockValue,
    currentStockValue,
  };
}

/**
 * Format currency for display (South African Rand)
 */
export function formatCurrency(amount: number): string {
  return `R ${amount.toLocaleString('en-ZA')}`;
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1000000000) {
    return `R ${(num / 1000000000).toFixed(1)}B`;
  }
  if (num >= 1000000) {
    return `R ${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `R ${(num / 1000).toFixed(1)}K`;
  }
  return `R ${num.toLocaleString('en-ZA')}`;
}


/**
 * Calculate top suburbs by current stock levels with average turn time
 */
export function calculateTopSuburbs(
  data: PropertyRecord[],
  endDate: Date | null,
  limit: number = 5
): Array<{ suburb: string; count: number; value: number; avgTurn: number }> {
  const now = new Date();
  const referenceDate = endDate || now;

  // Only consider properties that are currently in stock
  const currentStock = data.filter(record => 
    !record.offerDate || isAfter(record.offerDate, referenceDate)
  );

  // Group by location
  const suburbMap = new Map<string, { count: number; value: number }>();
  
  currentStock.forEach(record => {
    const existing = suburbMap.get(record.location) || { count: 0, value: 0 };
    suburbMap.set(record.location, {
      count: existing.count + 1,
      value: existing.value + record.price,
    });
  });

  // Calculate average turn time for each suburb
  const suburbTurnMap = calculateSuburbStockTurn(data, endDate);

  // Convert to array and sort by count descending
  const suburbs = Array.from(suburbMap.entries())
    .map(([suburb, data]) => ({
      suburb,
      count: data.count,
      value: data.value,
      avgTurn: suburbTurnMap.get(suburb) || 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return suburbs;
}

/**
 * Calculate average days to sell (stock turn) for properties with offers
 */
export function calculateAverageStockTurn(
  data: PropertyRecord[],
  startDate: Date | null,
  endDate: Date | null
): number {
  const now = new Date();
  const periodEnd = endDate || now;

  // Get properties with offers in the period
  let propertiesWithOffers: PropertyRecord[];
  
  if (startDate) {
    propertiesWithOffers = data.filter(record => 
      record.offerDate && 
      isWithinInterval(record.offerDate, { start: startDate, end: periodEnd })
    );
  } else {
    propertiesWithOffers = data.filter(record => record.offerDate !== null);
  }

  if (propertiesWithOffers.length === 0) return 0;

  // Calculate days between listing and offer for each property
  const totalDays = propertiesWithOffers.reduce((sum, record) => {
    if (record.offerDate) {
      const days = differenceInDays(record.offerDate, record.listingDate);
      return sum + days;
    }
    return sum;
  }, 0);

  return Math.round(totalDays / propertiesWithOffers.length);
}

/**
 * Calculate average stock turn per suburb
 */
export function calculateSuburbStockTurn(
  data: PropertyRecord[],
  endDate: Date | null
): Map<string, number> {
  const suburbTurnMap = new Map<string, number>();

  // Group properties with offers by suburb
  const propertiesWithOffers = data.filter(record => record.offerDate !== null);

  const suburbGroups = new Map<string, PropertyRecord[]>();
  propertiesWithOffers.forEach(record => {
    const existing = suburbGroups.get(record.location) || [];
    existing.push(record);
    suburbGroups.set(record.location, existing);
  });

  // Calculate average for each suburb
  suburbGroups.forEach((properties, suburb) => {
    const totalDays = properties.reduce((sum, record) => {
      if (record.offerDate) {
        const days = differenceInDays(record.offerDate, record.listingDate);
        return sum + days;
      }
      return sum;
    }, 0);
    
    const avgDays = Math.round(totalDays / properties.length);
    suburbTurnMap.set(suburb, avgDays);
  });

  return suburbTurnMap;
}
