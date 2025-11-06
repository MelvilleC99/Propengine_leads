"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Filters } from "@/components/property-lead-insights/filters";
import { OverviewCards } from "@/components/property-lead-insights/overview-cards";
import { PropertyCard } from "@/components/property-lead-insights/property-card";
import { SuburbsCard } from "@/components/property-lead-insights/suburbs-card";
import { PricePointCard } from "@/components/property-lead-insights/price-point-card";
import { SourceBreakdownCard } from "@/components/property-lead-insights/source-breakdown-card";
import { AgentsCard } from "@/components/property-lead-insights/agents-card";
import { fetchDashboardData } from "@/lib/property-lead-insights/api";
import type { DashboardData } from "@/lib/property-lead-insights/types";

export default function PropertyLeadInsightsPage() {
  // Filter states
  const [dateRange, setDateRange] = useState("30days");
  const [selectedAgency, setSelectedAgency] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState("all");
  
  // Data state
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data whenever filters change
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        const dashboardData = await fetchDashboardData({
          dateRange,
          agency: selectedAgency !== "all" ? selectedAgency : undefined,
          agent: selectedAgent !== "all" ? selectedAgent : undefined,
        });
        
        setData(dashboardData);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [dateRange, selectedAgency, selectedAgent]);

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Property Lead Insights
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Track property engagement and lead behavior
          </p>
        </div>

        {/* Filters */}
        <Filters
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedAgency={selectedAgency}
          onAgencyChange={setSelectedAgency}
          selectedAgent={selectedAgent}
          onAgentChange={setSelectedAgent}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Data Display */}
        {!loading && !error && data && (
          <>
            {/* Overview Metrics */}
            <OverviewCards data={data.overview} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Left Column - Top 10 Properties (2/3 width) */}
              <div className="lg:col-span-2 space-y-3 md:space-y-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  Top 10 Most Enquired Properties
                </h2>
                {data.topProperties.length > 0 ? (
                  data.topProperties.map((property) => (
                    <PropertyCard 
                      key={property.id} 
                      property={property}
                      filters={{
                        dateRange,
                        agency: selectedAgency !== "all" ? selectedAgency : undefined,
                        agent: selectedAgent !== "all" ? selectedAgent : undefined,
                      }}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No properties found for the selected filters.</p>
                  </div>
                )}
              </div>

              {/* Right Column - Insight Cards (1/3 width) */}
              <div className="space-y-4 md:space-y-6">
                <SuburbsCard data={data.topSuburbs} />
                <PricePointCard data={data.priceDistribution} />
                <SourceBreakdownCard data={data.sourceBreakdown} />
                <AgentsCard data={data.topAgents} />
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
