export interface PropertyLeadFilters {
  dateRange: string;
  agency?: string;
  agent?: string;
}

export async function fetchDashboardData(filters: PropertyLeadFilters) {
  try {
    const params = new URLSearchParams({
      dateRange: filters.dateRange,
      ...(filters.agency && { agency: filters.agency }),
      ...(filters.agent && { agent: filters.agent }),
    });

    const response = await fetch(`/api/property-lead-insights?${params}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('API Error:', errorData);
      throw new Error(`Failed to fetch dashboard data: ${errorData.error || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

export async function fetchPropertyDetails(
  propertyId: number,
  filters: PropertyLeadFilters
) {
  try {
    const params = new URLSearchParams({
      propertyId: propertyId.toString(),
      dateRange: filters.dateRange,
      ...(filters.agency && { agency: filters.agency }),
      ...(filters.agent && { agent: filters.agent }),
    });

    const response = await fetch(`/api/property-lead-insights/details?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch property details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching property details:', error);
    throw error;
  }
}

export async function fetchFilterOptions() {
  try {
    const response = await fetch('/api/property-lead-insights/filter-options');
    
    if (!response.ok) {
      throw new Error('Failed to fetch filter options');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
}
