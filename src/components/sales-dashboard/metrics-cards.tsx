"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Building2, DollarSign, Banknote, TrendingUp } from "lucide-react";
import type { OverviewMetrics } from "@/types/data";

interface MetricsCardsProps {
  metrics: OverviewMetrics;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  
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

  const cards = [
    {
      title: "Total Leads",
      value: metrics.totalLeads.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Response Rate",
      value: `${metrics.responseRate.toFixed(1)}%`,
      icon: Target,
      color: "text-green-600",
    },
    {
      title: "Properties Sold",
      value: metrics.propertiesSold.toLocaleString(),
      icon: Building2,
      color: "text-purple-600",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(metrics.totalRevenue),
      icon: DollarSign,
      color: "text-emerald-600",
    },
    {
      title: "Total Commission",
      value: formatCurrency(metrics.totalCommission),
      icon: Banknote,
      color: "text-orange-600",
    },
    {
      title: "Leads per Sale",
      value: metrics.leadsPerSale.toFixed(1),
      icon: TrendingUp,
      color: "text-indigo-600",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        {cards.slice(0, 3).map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {cards.slice(3, 6).map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
