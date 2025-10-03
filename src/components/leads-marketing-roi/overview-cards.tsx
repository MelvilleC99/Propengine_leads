"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ROIMetrics } from "@/lib/leads-marketing-roi/calculations";

interface OverviewCardsProps {
  p24Metrics: ROIMetrics;
  ppMetrics: ROIMetrics;
}

export function OverviewCards({ p24Metrics, ppMetrics }: OverviewCardsProps) {
  
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

  const renderMetricCard = (
    title: string,
    p24Value: string,
    ppValue: string,
    p24Subtitle: string,
    ppSubtitle: string
  ) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Property24 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-600">Property24</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{p24Value}</div>
          <p className="text-xs text-gray-500">{p24Subtitle}</p>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-200"></div>
        
        {/* Private Property */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-600">Private Property</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{ppValue}</div>
          <p className="text-xs text-gray-500">{ppSubtitle}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Cost Per Lead */}
      {renderMetricCard(
        "Cost Per Lead",
        formatCurrency(p24Metrics.costPerLead),
        formatCurrency(ppMetrics.costPerLead),
        `${p24Metrics.totalLeads.toLocaleString()} leads`,
        `${ppMetrics.totalLeads.toLocaleString()} leads`
      )}

      {/* Cost Per Sale */}
      {renderMetricCard(
        "Cost Per Sale",
        formatCurrency(p24Metrics.costPerSale),
        formatCurrency(ppMetrics.costPerSale),
        `${p24Metrics.totalSales.toLocaleString()} sales`,
        `${ppMetrics.totalSales.toLocaleString()} sales`
      )}

      {/* Effective Cost Per Lead */}
      {renderMetricCard(
        "Effective Cost Per Lead",
        formatCurrency(p24Metrics.effectiveCostPerLead),
        formatCurrency(ppMetrics.effectiveCostPerLead),
        `${p24Metrics.respondedLeads.toLocaleString()} responded (${p24Metrics.responseRate.toFixed(1)}%)`,
        `${ppMetrics.respondedLeads.toLocaleString()} responded (${ppMetrics.responseRate.toFixed(1)}%)`
      )}

      {/* Wasted Cost Per Lead - Show TOTAL wasted amount */}
      {renderMetricCard(
        "Total Wasted Marketing Spend",
        formatCurrencyShort(p24Metrics.wastedSpend),
        formatCurrencyShort(ppMetrics.wastedSpend),
        `${(p24Metrics.totalLeads - p24Metrics.respondedLeads).toLocaleString()} non-responded (${p24Metrics.wastageRate.toFixed(1)}%)`,
        `${(ppMetrics.totalLeads - ppMetrics.respondedLeads).toLocaleString()} non-responded (${ppMetrics.wastageRate.toFixed(1)}%)`
      )}
    </div>
  );
}