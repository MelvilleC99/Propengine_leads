import { getDbConnection } from './db';
import type { RowDataPacket } from 'mysql2/promise';
import mysql from 'mysql2/promise';

// =====================================================
// OVERVIEW METRICS
// =====================================================

export async function getOverviewMetrics(filters: {
  dateRange: string;
  agency?: string;
  agent?: string;
}) {
  const conn = await getDbConnection();
  
  const whereClause = buildWhereClause(filters);
  
  const query = `
    SELECT 
      COUNT(DISTINCT residential_sale_id) as totalProperties,
      COUNT(*) as totalEnquiries,
      COUNT(DISTINCT lead_id) as uniqueLeads,
      SUM(CASE WHEN converted_to_offer = 1 THEN 1 ELSE 0 END) as conversions
    FROM gold.lead_property_interest
    ${whereClause}
  `;
  
  const [rows] = await conn.query<RowDataPacket[]>(query);
  const data = rows[0];
  
  return {
    totalProperties: data.totalProperties || 0,
    totalEnquiries: data.totalEnquiries || 0,
    uniqueLeads: data.uniqueLeads || 0,
    conversionRate: data.totalEnquiries > 0 
      ? ((data.conversions / data.totalEnquiries) * 100).toFixed(1)
      : '0.0',
  };
}

// =====================================================
// TOP 10 PROPERTIES
// =====================================================

export async function getTopProperties(filters: {
  dateRange: string;
  agency?: string;
  agent?: string;
}) {
  const conn = await getDbConnection();
  
  const whereClause = buildWhereClause(filters);
  
  const query = `
    SELECT 
      lpi.residential_sale_id,
      lpi.property_name,
      lpi.listing_reference as reference,
      lpi.suburb_name as suburb,
      lpi.listing_price as price,
      COUNT(*) as totalEnquiries,
      COUNT(DISTINCT lpi.lead_id) as uniqueLeads,
      MAX(lpi.inquiry_date) as lastEnquired,
      MAX(CASE WHEN lpi.converted_to_offer = 1 THEN 1 ELSE 0 END) as hasOffer,
      MAX(lpi.listing_office_name) as agency,
      MAX(lpi.listing_agent_name) as agent,
      MAX(lpi.property_type) as propertyType,
      MAX(lpi.bedrooms) as bedrooms,
      MAX(lpi.bathrooms) as bathrooms
    FROM gold.lead_property_interest lpi
    ${whereClause}
    GROUP BY 
      lpi.residential_sale_id,
      lpi.property_name,
      lpi.listing_reference,
      lpi.suburb_name,
      lpi.listing_price
    ORDER BY totalEnquiries DESC, uniqueLeads DESC
    LIMIT 10
  `;
  
  const [rows] = await conn.query<RowDataPacket[]>(query);
  
  return rows.map(row => ({
    id: row.residential_sale_id,
    propertyName: row.property_name || 'Unknown Property',
    reference: row.reference || `Property #${row.residential_sale_id}`,
    suburb: row.suburb || 'Unknown Suburb',
    price: row.price || 0,
    totalEnquiries: row.totalEnquiries || 0,
    uniqueLeads: row.uniqueLeads || 0,
    lastEnquired: row.lastEnquired,
    hasOffer: row.hasOffer === 1,
    agency: row.agency || 'Unknown Agency',
    agent: row.agent || 'Unknown Agent',
    propertyType: row.propertyType || 'Unknown Type',
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
  }));
}

// =====================================================
// PROPERTY DETAILS (for expanded view)
// =====================================================

export async function getPropertyDetails(
  propertyId: number,
  filters: {
    dateRange: string;
    agency?: string;
    agent?: string;
  }
) {
  const conn = await getDbConnection();
  
  const whereClause = buildWhereClause(filters);
  
  // Get engagement overview
  const engagementQuery = `
    SELECT 
      COUNT(DISTINCT lead_id) as uniqueLeads,
      COUNT(*) as totalEnquiries,
      MIN(inquiry_date) as firstEnquired,
      MAX(inquiry_date) as lastEnquired
    FROM gold.lead_property_interest
    WHERE residential_sale_id = ?
    ${whereClause.replace('WHERE', 'AND')}
  `;
  
  const [engagementRows] = await conn.query<RowDataPacket[]>(engagementQuery, [propertyId]);
  const engagement = engagementRows[0];
  
  // Get source breakdown
  const sourceQuery = `
    SELECT 
      lead_source_name,
      COUNT(*) as count
    FROM gold.lead_property_interest
    WHERE residential_sale_id = ?
    ${whereClause.replace('WHERE', 'AND')}
    GROUP BY lead_source_name
  `;
  
  const [sourceRows] = await conn.query<RowDataPacket[]>(sourceQuery, [propertyId]);
  
  const sourceBreakdown = {
    property24: 0,
    privateProperty: 0,
    website: 0,
    other: 0,
  };
  
  sourceRows.forEach(row => {
    const source = row.lead_source_name?.toLowerCase() || '';
    if (source.includes('property24') || source.includes('p24')) {
      sourceBreakdown.property24 += row.count;
    } else if (source.includes('private') || source.includes('pp')) {
      sourceBreakdown.privateProperty += row.count;
    } else if (source.includes('website')) {
      sourceBreakdown.website += row.count;
    } else {
      sourceBreakdown.other += row.count;
    }
  });
  
  // Get top interested leads
  const leadsQuery = `
    SELECT 
      lpi.lead_id,
      lpi.lead_first_name,
      lpi.lead_last_name,
      COUNT(*) as timesEnquired,
      MAX(lpi.inquiry_date) as lastActive
    FROM gold.lead_property_interest lpi
    WHERE lpi.residential_sale_id = ?
    ${whereClause.replace('WHERE', 'AND')}
    GROUP BY lpi.lead_id, lpi.lead_first_name, lpi.lead_last_name
    ORDER BY timesEnquired DESC
    LIMIT 5
  `;
  
  const [leadsRows] = await conn.query<RowDataPacket[]>(leadsQuery, [propertyId]);
  
  // Get additional lead info for each top lead
  const topLeads = await Promise.all(
    leadsRows.map(async (lead) => {
      // Get total properties this lead has viewed
      const [totalPropsRows] = await conn.query<RowDataPacket[]>(
        `SELECT COUNT(DISTINCT residential_sale_id) as total 
         FROM gold.lead_property_interest 
         WHERE lead_id = ?`,
        [lead.lead_id]
      );
      
      // Get suburbs this lead is exploring
      const [suburbRows] = await conn.query<RowDataPacket[]>(
        `SELECT DISTINCT suburb_name 
         FROM gold.lead_property_interest 
         WHERE lead_id = ? AND suburb_name IS NOT NULL
         LIMIT 5`,
        [lead.lead_id]
      );
      
      // Get budget range (min and max prices viewed)
      const [budgetRows] = await conn.query<RowDataPacket[]>(
        `SELECT 
           MIN(listing_price) as minPrice,
           MAX(listing_price) as maxPrice
         FROM gold.lead_property_interest 
         WHERE lead_id = ? AND listing_price IS NOT NULL`,
        [lead.lead_id]
      );
      
      const budget = budgetRows[0];
      const budgetRange = budget.minPrice && budget.maxPrice
        ? `R${(budget.minPrice / 1000).toFixed(0)}K - R${(budget.maxPrice / 1000).toFixed(0)}K`
        : 'Unknown';
      
      return {
        id: lead.lead_id,
        name: `${lead.lead_first_name || ''} ${lead.lead_last_name || ''}`.trim() || 'Unknown',
        timesEnquired: lead.timesEnquired,
        totalProperties: totalPropsRows[0].total,
        budgetRange,
        suburbs: suburbRows.map(row => row.suburb_name),
        lastActive: lead.lastActive,
      };
    })
  );
  
  return {
    uniqueLeads: engagement.uniqueLeads,
    totalEnquiries: engagement.totalEnquiries,
    firstEnquired: engagement.firstEnquired,
    lastEnquired: engagement.lastEnquired,
    sourceBreakdown,
    topLeads,
  };
}

// =====================================================
// TOP SUBURBS
// =====================================================

export async function getTopSuburbs(filters: {
  dateRange: string;
  agency?: string;
  agent?: string;
}) {
  const conn = await getDbConnection();
  
  const whereClause = buildWhereClause(filters);
  
  const query = `
    SELECT 
      suburb_name as suburb,
      COUNT(*) as enquiries,
      COUNT(DISTINCT lead_id) as uniqueLeads
    FROM gold.lead_property_interest
    ${whereClause}
    AND suburb_name IS NOT NULL
    GROUP BY suburb_name
    ORDER BY enquiries DESC
    LIMIT 10
  `;
  
  const [rows] = await conn.query<RowDataPacket[]>(query);
  
  const total = rows.reduce((sum, row) => sum + row.enquiries, 0);
  
  return rows.map(row => ({
    name: row.suburb,
    enquiries: row.enquiries,
    uniqueLeads: row.uniqueLeads,
    percentage: total > 0 ? ((row.enquiries / total) * 100).toFixed(1) : '0',
  }));
}

// =====================================================
// PRICE POINT DISTRIBUTION
// =====================================================

export async function getPriceDistribution(filters: {
  dateRange: string;
  agency?: string;
  agent?: string;
}) {
  const conn = await getDbConnection();
  
  const whereClause = buildWhereClause(filters);
  
  const query = `
    SELECT 
      CASE
        WHEN listing_price < 500000 THEN 'Under R500K'
        WHEN listing_price >= 500000 AND listing_price < 1000000 THEN 'R500K - R1M'
        WHEN listing_price >= 1000000 AND listing_price < 2000000 THEN 'R1M - R2M'
        WHEN listing_price >= 2000000 THEN 'Over R2M'
        ELSE 'Unknown'
      END as priceRange,
      COUNT(*) as count
    FROM gold.lead_property_interest
    ${whereClause}
    AND listing_price IS NOT NULL
    GROUP BY priceRange
    ORDER BY 
      CASE priceRange
        WHEN 'Under R500K' THEN 1
        WHEN 'R500K - R1M' THEN 2
        WHEN 'R1M - R2M' THEN 3
        WHEN 'Over R2M' THEN 4
        ELSE 5
      END
  `;
  
  const [rows] = await conn.query<RowDataPacket[]>(query);
  
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  
  return rows.map(row => ({
    range: row.priceRange,
    count: row.count,
    percentage: total > 0 ? ((row.count / total) * 100).toFixed(0) : '0',
  }));
}

// =====================================================
// SOURCE BREAKDOWN
// =====================================================

export async function getSourceBreakdown(filters: {
  dateRange: string;
  agency?: string;
  agent?: string;
}) {
  const conn = await getDbConnection();
  
  const whereClause = buildWhereClause(filters);
  
  const query = `
    SELECT 
      lead_source_name,
      COUNT(*) as count
    FROM gold.lead_property_interest
    ${whereClause}
    GROUP BY lead_source_name
  `;
  
  const [rows] = await conn.query<RowDataPacket[]>(query);
  
  const sources = {
    property24: 0,
    privateProperty: 0,
    website: 0,
    other: 0,
  };
  
  rows.forEach(row => {
    const source = row.lead_source_name?.toLowerCase() || '';
    if (source.includes('property24') || source.includes('p24')) {
      sources.property24 += row.count;
    } else if (source.includes('private') || source.includes('pp')) {
      sources.privateProperty += row.count;
    } else if (source.includes('website')) {
      sources.website += row.count;
    } else {
      sources.other += row.count;
    }
  });
  
  const total = Object.values(sources).reduce((sum, val) => sum + val, 0);
  
  return [
    {
      name: 'Property24',
      count: sources.property24,
      percentage: total > 0 ? ((sources.property24 / total) * 100).toFixed(1) : '0',
      color: 'bg-blue-600',
    },
    {
      name: 'Private Property',
      count: sources.privateProperty,
      percentage: total > 0 ? ((sources.privateProperty / total) * 100).toFixed(1) : '0',
      color: 'bg-green-600',
    },
    {
      name: 'Website',
      count: sources.website,
      percentage: total > 0 ? ((sources.website / total) * 100).toFixed(1) : '0',
      color: 'bg-purple-600',
    },
    {
      name: 'Other',
      count: sources.other,
      percentage: total > 0 ? ((sources.other / total) * 100).toFixed(1) : '0',
      color: 'bg-gray-600',
    },
  ].filter(s => s.count > 0);
}

// =====================================================
// TOP AGENTS
// =====================================================

export async function getTopAgents(filters: {
  dateRange: string;
  agency?: string;
  agent?: string;
}) {
  const conn = await getDbConnection();
  
  const whereClause = buildWhereClause(filters);
  
  const query = `
    SELECT 
      listing_agent_name as agentName,
      listing_office_name as agency,
      COUNT(DISTINCT lead_id) as leadCount,
      COUNT(*) as enquiryCount
    FROM gold.lead_property_interest
    ${whereClause}
    AND listing_agent_name IS NOT NULL
    GROUP BY listing_agent_name, listing_office_name
    ORDER BY leadCount DESC, enquiryCount DESC
    LIMIT 10
  `;
  
  const [rows] = await conn.query<RowDataPacket[]>(query);
  
  return rows.map(row => ({
    name: row.agentName,
    agency: row.agency || 'Unknown',
    leadCount: row.leadCount,
    enquiryCount: row.enquiryCount,
  }));
}

// =====================================================
// FILTER OPTIONS (for dropdowns)
// =====================================================

export async function getFilterOptions() {
  const conn = await getDbConnection();
  
  // Get agencies
  const [agencyRows] = await conn.query<RowDataPacket[]>(
    `SELECT DISTINCT listing_office_name as name
     FROM gold.lead_property_interest
     WHERE listing_office_name IS NOT NULL
     ORDER BY listing_office_name`
  );
  
  // Get agents
  const [agentRows] = await conn.query<RowDataPacket[]>(
    `SELECT DISTINCT listing_agent_name as name
     FROM gold.lead_property_interest
     WHERE listing_agent_name IS NOT NULL
     ORDER BY listing_agent_name`
  );
  
  return {
    agencies: agencyRows.map(row => row.name),
    agents: agentRows.map(row => row.name),
  };
}

// =====================================================
// HELPER: Build WHERE clause based on filters
// =====================================================

function buildWhereClause(filters: {
  dateRange: string;
  agency?: string;
  agent?: string;
}): string {
  const conditions: string[] = [];
  
  // Date range filter
  if (filters.dateRange && filters.dateRange !== 'all') {
    const days = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
      '6months': 180,
    }[filters.dateRange];
    
    if (days) {
      conditions.push(`inquiry_date >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)`);
    }
  }
  
  // Agency filter
  if (filters.agency && filters.agency !== 'all') {
    conditions.push(`listing_office_name = ${mysql.escape(filters.agency)}`);
  }
  
  // Agent filter
  if (filters.agent && filters.agent !== 'all') {
    conditions.push(`listing_agent_name = ${mysql.escape(filters.agent)}`);
  }
  
  return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
}
