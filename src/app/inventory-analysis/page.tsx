"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Filters } from "@/components/inventory-analysis/filters";
import { MovementCards } from "@/components/inventory-analysis/movement-cards";
import { AgingCard } from "@/components/inventory-analysis/aging-card";
import { SuburbCard } from "@/components/inventory-analysis/suburb-card";
import { loadPropertyData } from "@/lib/dataLoader";
import {
  getUniqueAgencies,
  filterByAgencies,
  calculateMovementMetrics,
  calculateAgingBreakdown,
  calculateValueMetrics,
  calculateTopSuburbs,
  calculateAverageStockTurn,
} from "@/lib/inventory-analysis/calculations";
import type { PropertyRecord } from "@/lib/inventory-analysis/types";
import { subMonths, subWeeks, startOfYear, parseISO } from "date-fns";

export default function InventoryAnalysisDashboard() {
  const [propertyData, setPropertyData] = useState<PropertyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [agencies, setAgencies] = useState<string[]>([]);
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await loadPropertyData();
        setPropertyData(data as unknown as PropertyRecord[]);
        
        // Extract unique agencies
        const uniqueAgencies = getUniqueAgencies(data as unknown as PropertyRecord[]);
        setAgencies(uniqueAgencies);
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading property data:", err);
        setError("Failed to load property data. Please refresh the page.");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply filters
  const getFilteredData = () => {
    let filtered = propertyData;

    // Filter by agencies
    if (selectedAgencies.length > 0) {
      filtered = filterByAgencies(filtered, selectedAgencies);
    }

    return filtered;
  };

  // Calculate date range
  const getDateRange = (): { startDate: Date | null; endDate: Date | null } => {
    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    switch (dateRange) {
      case "1week":
        startDate = subWeeks(now, 1);
        break;
      case "1month":
        startDate = subMonths(now, 1);
        break;
      case "ytd":
        startDate = startOfYear(now);
        break;
      case "custom":
        if (customStartDate) startDate = parseISO(customStartDate);
        if (customEndDate) endDate = parseISO(customEndDate);
        break;
      default:
        break;
    }

    return { startDate, endDate };
  };

  const filteredData = getFilteredData();
  const { startDate, endDate } = getDateRange();

  // Calculate metrics
  const movementMetrics = calculateMovementMetrics(filteredData, startDate, endDate);
  const agingBreakdown = calculateAgingBreakdown(filteredData, endDate);
  const valueMetrics = calculateValueMetrics(filteredData, startDate, endDate);
  const topSuburbs = calculateTopSuburbs(filteredData, endDate, 5);
  const averageStockTurn = calculateAverageStockTurn(filteredData, startDate, endDate);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-900 mb-2">
              Loading property data...
            </div>
            <p className="text-gray-500">Please wait while we fetch your inventory</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Inventory Analysis</h1>
          <p className="text-gray-600">
            Track property inventory movement, aging, and values
          </p>
        </div>

        {/* Filters */}
        <Filters
          agencies={agencies}
          selectedAgencies={selectedAgencies}
          onAgenciesChange={setSelectedAgencies}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          customStartDate={customStartDate}
          customEndDate={customEndDate}
          onCustomDateChange={(start, end) => {
            setCustomStartDate(start);
            setCustomEndDate(end);
          }}
        />

        {/* Movement Metrics */}
        <MovementCards 
          metrics={movementMetrics} 
          values={valueMetrics} 
          averageStockTurn={averageStockTurn}
        />

        {/* Stock Aging + Suburb Analysis */}
        <div className="grid gap-4 md:grid-cols-2">
          <AgingCard aging={agingBreakdown} />
          <SuburbCard suburbs={topSuburbs} />
        </div>
      </div>
    </DashboardLayout>
  );
}
