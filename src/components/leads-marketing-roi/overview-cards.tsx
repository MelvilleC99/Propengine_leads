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
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-blue-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {/* Property24 */}
        <div className="space-y-0.5">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Property24</span>
          <div className="text-3xl font-bold text-gray-900 leading-tight">{p24Value}</div>
          <p className="text-sm text-gray-600">{p24Subtitle}</p>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-200"></div>
        
        {/* Private Property */}
        <div className="space-y-0.5">
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Private Property</span>
          <div className="text-3xl font-bold text-gray-900 leading-tight">{ppValue}</div>
          <p className="text-sm text-gray-600">{ppSubtitle}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Row 1 */}
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

      {/* Row 2 */}
      {/* Revenue Per R1 Spent */}
      {renderMetricCard(
        "Revenue per R1 Spent",
        `R${p24Metrics.revenuePerRandSpent.toFixed(2)}`,
        `R${ppMetrics.revenuePerRandSpent.toFixed(2)}`,
        `Total: ${formatCurrencyShort(p24Metrics.totalRevenue)}`,
        `Total: ${formatCurrencyShort(ppMetrics.totalRevenue)}`
      )}

      {/* Commission Per R1 Spent */}
      {renderMetricCard(
        "Commission per R1 Spent",
        `R${p24Metrics.commissionPerRandSpent.toFixed(2)}`,
        `R${ppMetrics.commissionPerRandSpent.toFixed(2)}`,
        `Total: ${formatCurrencyShort(p24Metrics.totalCommission)}`,
        `Total: ${formatCurrencyShort(ppMetrics.totalCommission)}`
      )}

      {/* Wasted Marketing Spend */}
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