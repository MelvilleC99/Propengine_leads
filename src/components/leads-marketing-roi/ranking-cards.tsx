"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AgencyROIMetrics } from "@/lib/leads-marketing-roi/calculations";

interface RankingCardsProps {
  agencyMetrics: AgencyROIMetrics[];
}

export function RankingCards({ agencyMetrics }: RankingCardsProps) {
  const [showBest, setShowBest] = useState(true);

  // Debug: Log agency metrics to see what data we have
  console.log('Agency Metrics:', agencyMetrics.slice(0, 3));
  console.log('Total agencies:', agencyMetrics.length);
  console.log('Agencies with P24 leads:', agencyMetrics.filter(a => a.p24Metrics.totalLeads > 0).length);
  console.log('Agencies with PP leads:', agencyMetrics.filter(a => a.ppMetrics.totalLeads > 0).length);

  const formatCurrency = (value: number): string => {
    return `R${value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatCurrencyShort = (value: number): string => {
    if (value >= 1e6) {
      return `R${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `R${(value / 1e3).toFixed(2)}K`;
    }
    return `R${value.toFixed(2)}`;
  };

  // Filter agencies with actual data
  const validAgencies = agencyMetrics.filter(a => 
    a.totalLeads > 0 || a.totalSales > 0
  );

  // Cost Per Lead Rankings - Filter only agencies with leads for that source
  const cplP24Ranked = agencyMetrics
    .filter(a => a.p24Metrics.totalLeads > 0)
    .sort((a, b) => a.p24Metrics.costPerLead - b.p24Metrics.costPerLead);
  
  const cplPPRanked = agencyMetrics
    .filter(a => a.ppMetrics.totalLeads > 0)
    .sort((a, b) => a.ppMetrics.costPerLead - b.ppMetrics.costPerLead);

  // Cost Per Sale Rankings
  const cpsP24Ranked = agencyMetrics
    .filter(a => a.p24Metrics.totalSales > 0)
    .sort((a, b) => a.p24Metrics.costPerSale - b.p24Metrics.costPerSale);
  
  const cpsPPRanked = agencyMetrics
    .filter(a => a.ppMetrics.totalSales > 0)
    .sort((a, b) => a.ppMetrics.costPerSale - b.ppMetrics.costPerSale);

  // Effective Cost Per Lead Rankings
  const ecplP24Ranked = agencyMetrics
    .filter(a => a.p24Metrics.respondedLeads > 0)
    .sort((a, b) => a.p24Metrics.effectiveCostPerLead - b.p24Metrics.effectiveCostPerLead);
  
  const ecplPPRanked = agencyMetrics
    .filter(a => a.ppMetrics.respondedLeads > 0)
    .sort((a, b) => a.ppMetrics.effectiveCostPerLead - b.ppMetrics.effectiveCostPerLead);

  // Wasted Cost Rankings - sort by TOTAL wasted amount
  // Lower wasted spend is BETTER, so sort ascending for best performers
  const wcplP24Ranked = agencyMetrics
    .filter(a => a.p24Metrics.totalLeads > 0 && (a.p24Metrics.totalLeads - a.p24Metrics.respondedLeads) > 0)
    .sort((a, b) => a.p24Metrics.wastedSpend - b.p24Metrics.wastedSpend); // Ascending = best first
  
  const wcplPPRanked = agencyMetrics
    .filter(a => a.ppMetrics.totalLeads > 0 && (a.ppMetrics.totalLeads - a.ppMetrics.respondedLeads) > 0)
    .sort((a, b) => a.ppMetrics.wastedSpend - b.ppMetrics.wastedSpend); // Ascending = best first

  const getTopOrBottom = <T,>(arr: T[], showBest: boolean, limit: number = 5): T[] => {
    if (showBest) {
      return arr.slice(0, limit);
    } else {
      return arr.slice(-limit).reverse();
    }
  };

  const renderRankingCard = (
    title: string,
    data: AgencyROIMetrics[],
    getCost: (m: AgencyROIMetrics) => number,
    getLeads: (m: AgencyROIMetrics) => number,
    getSales: (m: AgencyROIMetrics) => number,
    showSales: boolean,
    isWasted: boolean = false
  ) => {
    const displayData = getTopOrBottom(data, showBest, 5);

    if (displayData.length === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 text-center py-4">No data available</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-2">Agency</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase pb-2">
                  {isWasted ? 'Total Wasted' : 'Cost'}
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase pb-2">
                  {showSales ? 'Sales' : (isWasted ? 'Non-Resp' : 'Leads')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayData.map((agency) => (
                <tr key={agency.account_name}>
                  <td className="py-2 font-medium text-gray-700 text-xs">
                    {agency.account_name}
                  </td>
                  <td className="py-2 text-right font-semibold text-gray-900 tabular-nums">
                    {isWasted ? formatCurrencyShort(getCost(agency)) : formatCurrency(getCost(agency))}
                  </td>
                  <td className="py-2 text-right text-gray-600 tabular-nums text-xs">
                    {showSales ? getSales(agency) : getLeads(agency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toggle Button */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-gray-300 p-1">
          <Button
            variant={showBest ? "default" : "ghost"}
            onClick={() => setShowBest(true)}
            className="rounded-md px-6"
          >
            Best Performers
          </Button>
          <Button
            variant={!showBest ? "default" : "ghost"}
            onClick={() => setShowBest(false)}
            className="rounded-md px-6"
          >
            Worst Performers
          </Button>
        </div>
      </div>

      {/* Cost Per Lead */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Cost Per Lead</h3>
        <div className="grid grid-cols-2 gap-6">
          {renderRankingCard(
            "Property24",
            cplP24Ranked,
            (m) => m.p24Metrics.costPerLead,
            (m) => m.p24Metrics.totalLeads,
            (m) => m.p24Metrics.totalSales,
            false
          )}
          {renderRankingCard(
            "Private Property",
            cplPPRanked,
            (m) => m.ppMetrics.costPerLead,
            (m) => m.ppMetrics.totalLeads,
            (m) => m.ppMetrics.totalSales,
            false
          )}
        </div>
      </div>

      {/* Cost Per Sale */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Cost Per Sale</h3>
        <div className="grid grid-cols-2 gap-6">
          {renderRankingCard(
            "Property24",
            cpsP24Ranked,
            (m) => m.p24Metrics.costPerSale,
            (m) => m.p24Metrics.totalLeads,
            (m) => m.p24Metrics.totalSales,
            true
          )}
          {renderRankingCard(
            "Private Property",
            cpsPPRanked,
            (m) => m.ppMetrics.costPerSale,
            (m) => m.ppMetrics.totalLeads,
            (m) => m.ppMetrics.totalSales,
            true
          )}
        </div>
      </div>

      {/* Effective Cost Per Lead */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Effective Cost Per Lead</h3>
        <div className="grid grid-cols-2 gap-6">
          {renderRankingCard(
            "Property24",
            ecplP24Ranked,
            (m) => m.p24Metrics.effectiveCostPerLead,
            (m) => m.p24Metrics.respondedLeads,
            (m) => m.p24Metrics.totalSales,
            false
          )}
          {renderRankingCard(
            "Private Property",
            ecplPPRanked,
            (m) => m.ppMetrics.effectiveCostPerLead,
            (m) => m.ppMetrics.respondedLeads,
            (m) => m.ppMetrics.totalSales,
            false
          )}
        </div>
      </div>

      {/* Wasted Cost - Show Total Wasted Amount */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Total Wasted Marketing Spend</h3>
        <div className="grid grid-cols-2 gap-6">
          {renderRankingCard(
            "Property24",
            wcplP24Ranked,
            (m) => m.p24Metrics.wastedSpend,
            (m) => m.p24Metrics.totalLeads - m.p24Metrics.respondedLeads,
            (m) => m.p24Metrics.totalSales,
            false,
            true
          )}
          {renderRankingCard(
            "Private Property",
            wcplPPRanked,
            (m) => m.ppMetrics.wastedSpend,
            (m) => m.ppMetrics.totalLeads - m.ppMetrics.respondedLeads,
            (m) => m.ppMetrics.totalSales,
            false,
            true
          )}
        </div>
      </div>
    </div>
  );
}