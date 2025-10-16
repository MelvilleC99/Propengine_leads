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
  const [selectedMonths, setSelectedMonths] = useState<number[]>([8, 9]); // Default: Aug & Sep
  const [viewMode, setViewMode] = useState<"overview" | "performance">("overview"); // Toggle between views

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
    // Filter by date range and months
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    const now = new Date();
    
    // If specific months are selected, use them
    if (selectedMonths.length > 0) {
      // Find min and max months
      const minMonth = Math.min(...selectedMonths);
      const maxMonth = Math.max(...selectedMonths);
      
      startDate = new Date(2025, minMonth - 1, 1); // month is 0-indexed
      endDate = new Date(2025, maxMonth, 0); // Last day of maxMonth
    } else {
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
        {/* Header with View Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lead Spend & ROI</h1>
            <p className="text-gray-600">
              Marketing spend efficiency and lead performance analysis (Jan-Sep 2025)
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("overview")}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                viewMode === "overview"
                  ? "bg-gray-900 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode("performance")}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                viewMode === "performance"
                  ? "bg-gray-900 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Agency Performance
            </button>
          </div>
        </div>

        {/* Filters */}
        <Filters
          agencies={agencies}
          selectedAgency={selectedAgency}
          onAgencyChange={setSelectedAgency}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedMonths={selectedMonths}
          onMonthsChange={setSelectedMonths}
        />

        {/* Conditional Rendering based on View Mode */}
        {viewMode === "overview" ? (
          <OverviewCards 
            p24Metrics={overallMetrics.p24} 
            ppMetrics={overallMetrics.pp}
          />
        ) : (
          <RankingCards agencyMetrics={agencyMetrics} />
        )}
      </div>
    </DashboardLayout>
  );
}