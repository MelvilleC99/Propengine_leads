"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { LeadSourceBreakdown } from "@/types/data";

interface LeadSourceCardsProps {
  breakdown: LeadSourceBreakdown[];
}

export function LeadSourceCards({ breakdown }: LeadSourceCardsProps) {
  
  const formatCurrency = (value: number): string => {
    if (value >= 1e9) {
      return `R${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `R${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `R${(value / 1e3).toFixed(0)}K`;
    }
    return `R${value.toFixed(0)}`;
  };

  // Group: Show top 4, combine rest as "Other"
  const topSources = breakdown.slice(0, 4);
  const otherSources = breakdown.slice(4);
  
  const displayData = [...topSources];
  
  if (otherSources.length > 0) {
    const otherTotal = {
      source: "Other",
      count: otherSources.reduce((sum, s) => sum + s.count, 0),
      percentage: otherSources.reduce((sum, s) => sum + s.percentage, 0),
      revenue: otherSources.reduce((sum, s) => sum + s.revenue, 0),
      revenuePercentage: otherSources.reduce((sum, s) => sum + s.revenuePercentage, 0),
      commission: otherSources.reduce((sum, s) => sum + s.commission, 0),
      commissionPercentage: otherSources.reduce((sum, s) => sum + s.commissionPercentage, 0),
    };
    displayData.push(otherTotal);
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Card 1: Lead Source Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lead Source Breakdown</CardTitle>
        </CardHeader>
        <div className="px-6 pb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-2">Source</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase pb-2 w-16">Count</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase pb-2 w-12">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayData.map((item, idx) => (
                <tr key={`${item.source}-${idx}`}>
                  <td className="py-2 font-medium text-gray-700">{item.source}</td>
                  <td className="py-2 text-right font-semibold text-gray-900 tabular-nums">{item.count}</td>
                  <td className="py-2 text-right text-gray-600 tabular-nums">{item.percentage.toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Card 2: Revenue by Lead Source */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue by Lead Source</CardTitle>
        </CardHeader>
        <div className="px-6 pb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-2">Source</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase pb-2 w-20">Amount</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase pb-2 w-12">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayData.map((item, idx) => (
                <tr key={`revenue-${item.source}-${idx}`}>
                  <td className="py-2 font-medium text-gray-700">{item.source}</td>
                  <td className="py-2 text-right font-semibold text-gray-900 tabular-nums">{formatCurrency(item.revenue)}</td>
                  <td className="py-2 text-right text-gray-600 tabular-nums">{item.revenuePercentage.toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Card 3: Commission by Lead Source */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Commission by Lead Source</CardTitle>
        </CardHeader>
        <div className="px-6 pb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-2">Source</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase pb-2 w-20">Amount</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase pb-2 w-12">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayData.map((item, idx) => (
                <tr key={`commission-${item.source}-${idx}`}>
                  <td className="py-2 font-medium text-gray-700">{item.source}</td>
                  <td className="py-2 text-right font-semibold text-gray-900 tabular-nums">{formatCurrency(item.commission)}</td>
                  <td className="py-2 text-right text-gray-600 tabular-nums">{item.commissionPercentage.toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
