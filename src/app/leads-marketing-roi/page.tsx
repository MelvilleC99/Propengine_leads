"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Filters } from "@/components/leads-marketing-roi/filters";
import { OverviewCards } from "@/components/leads-marketing-roi/overview-cards";
import { RankingCards } from "@/components/leads-marketing-roi/ranking-cards";
import { loadSalesData, loadLeadsData } from "@/lib/dataLoader";
import { loadAgencySpend } from "@/lib/leads-marketing-roi/dataLoader";
import {
  calculateOverallROI,
  calculateAgencyROI,
  getUniqueAgencies,
  filterByDateRange,
} from "@/lib/leads-marketing-roi/calculations";
import type { SalesRecord, LeadRecord } from "@/types/data";
import type { AgencySpend } from "@/lib/leads-marketing-roi/calculations";
import { startOfYear, subMonths } from "date-fns";

export default function LeadsMarketingROIDashboard() {
  const [salesData, setSalesData] = useState<SalesRecord[]>([]);
  const [leadsData, setLeadsData] = useState<LeadRecord[]>([]);
  const [agencySpends, setAgencySpends] = useState<AgencySpend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [agencies, setAgencies] = useState<string[]>([]);
  const [selectedAgency, setSelectedAgency] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [sales, leads, spends] = await Promise.all([
          loadSalesData(),
          loadLeadsData(),
          loadAgencySpend(),
        ]);
        
        setSalesData(sales);
        setLeadsData(leads);
        setAgencySpends(spends);
        
        // Extract unique agencies from spend data
        const uniqueAgencies = getUniqueAgencies(spends);
        setAgencies(uniqueAgencies);
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please refresh the page.");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply filters
  const filteredData = () => {
    // Filter by date range - consistent with sales dashboard
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    const now = new Date();
    
    // Always exclude October
    const maxDate = new Date(2025, 8, 30); // Sep 30, 2025

    switch (dateRange) {
      case "ytd":
        startDate = startOfYear(new Date(2025, 0, 1));
        endDate = maxDate;
        break;
      case "6months":
        // Last 6 complete months: Apr-Sep
        startDate = new Date(2025, 3, 1); // April 1
        endDate = maxDate;
        break;
      case "3months":
        // Last 3 complete months: Jul-Sep
        startDate = new Date(2025, 6, 1); // July 1
        endDate = maxDate;
        break;
      case "1month":
        // Last complete month: September only
        startDate = new Date(2025, 8, 1); // Sep 1
        endDate = maxDate; // Sep 30
        break;
      default:
        // "all" - Jan 1 to Sep 30, 2025
        startDate = new Date(2025, 0, 1);
        endDate = maxDate;
        break;
    }

    const filteredSales = filterByDateRange(salesData, startDate, endDate);
    const filteredLeads = filterByDateRange(leadsData, startDate, endDate);

    return { sales: filteredSales, leads: filteredLeads, startDate, endDate };
  };

  const currentData = filteredData();

  // Calculate metrics with date range for proper month calculation
  const overallMetrics = calculateOverallROI(
    currentData.leads,
    currentData.sales,
    agencySpends,
    selectedAgency,
    currentData.startDate,
    currentData.endDate
  );

  const agencyMetrics = calculateAgencyROI(
    currentData.leads,
    currentData.sales,
    agencySpends,
    currentData.startDate,
    currentData.endDate
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-900 mb-2">
              Loading data...
            </div>
            <p className="text-gray-500">Please wait while we fetch your data</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-xl font-semibold text-red-600 mb-2">
              Error loading data
            </div>
            <p className="text-gray-500">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Spend & ROI</h1>
          <p className="text-gray-600">
            Marketing spend efficiency and lead performance analysis (Jan-Sep 2025)
          </p>
        </div>

        {/* Filters */}
        <Filters
          agencies={agencies}
          selectedAgency={selectedAgency}
          onAgencyChange={setSelectedAgency}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        {/* Overview Cards */}
        <OverviewCards 
          p24Metrics={overallMetrics.p24} 
          ppMetrics={overallMetrics.pp}
        />

        {/* Rankings */}
        <RankingCards agencyMetrics={agencyMetrics} />
      </div>
    </DashboardLayout>
  );
}