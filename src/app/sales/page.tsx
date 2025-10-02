"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Filters } from "@/components/sales-dashboard/filters";
import { MetricsCards } from "@/components/sales-dashboard/metrics-cards";
import { LeadSourceCards } from "@/components/sales-dashboard/lead-source-cards";
import { RevenueChart } from "@/components/sales-dashboard/revenue-chart";
import { loadSalesData, loadLeadsData } from "@/lib/dataLoader";
import {
  calculateOverviewMetrics,
  calculateLeadSourceBreakdown,
  calculateMonthlyRevenue,
  getUniqueAgencies,
  filterByAgencies,
  filterByDateRange,
} from "@/lib/sales-dashboard/calculations";
import type { SalesRecord, LeadRecord } from "@/types/data";
import { subMonths, startOfYear } from "date-fns";

export default function SalesDashboard() {
  const [salesData, setSalesData] = useState<SalesRecord[]>([]);
  const [leadsData, setLeadsData] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [agencies, setAgencies] = useState<string[]>([]);
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState("all");

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [sales, leads] = await Promise.all([
          loadSalesData(),
          loadLeadsData(),
        ]);
        
        setSalesData(sales);
        setLeadsData(leads);
        
        // Extract unique agencies
        const uniqueAgencies = getUniqueAgencies(sales);
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
    let filtered = salesData;

    // Filter by agencies
    if (selectedAgencies.length > 0) {
      filtered = filterByAgencies(filtered, selectedAgencies);
    }

    // Filter by date range
    let startDate: Date | null = null;
    const endDate: Date | null = null;
    const now = new Date();

    switch (dateRange) {
      case "ytd":
        startDate = startOfYear(now);
        break;
      case "6months":
        startDate = subMonths(now, 6);
        break;
      case "3months":
        startDate = subMonths(now, 3);
        break;
      case "1month":
        startDate = subMonths(now, 1);
        break;
      default:
        break;
    }

    if (startDate || endDate) {
      filtered = filterByDateRange(filtered, startDate, endDate);
    }

    return filtered;
  };

  const currentData = filteredData();

  // Calculate metrics
  const metrics = calculateOverviewMetrics(currentData, leadsData);
  const leadSourceBreakdown = calculateLeadSourceBreakdown(currentData);
  const monthlyRevenue = calculateMonthlyRevenue(currentData);

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
          <h1 className="text-3xl font-bold text-gray-900">Sales & Leads Dashboard</h1>
          <p className="text-gray-600">
            Overview of sales performance and lead metrics
          </p>
        </div>

        {/* Filters */}
        <Filters
          agencies={agencies}
          selectedAgencies={selectedAgencies}
          onAgenciesChange={setSelectedAgencies}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        {/* Metrics Cards */}
        <MetricsCards metrics={metrics} />

        {/* Lead Source Cards */}
        {leadSourceBreakdown.length > 0 && (
          <LeadSourceCards breakdown={leadSourceBreakdown} />
        )}

        {/* Revenue Chart */}
        {monthlyRevenue.length > 0 && (
          <RevenueChart data={monthlyRevenue} />
        )}
      </div>
    </DashboardLayout>
  );
}
