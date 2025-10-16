"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import type { AgingBreakdown } from "@/lib/inventory-analysis/types";
import { formatCompactNumber } from "@/lib/inventory-analysis/calculations";

interface AgingCardProps {
  aging: AgingBreakdown;
}

export function AgingCard({ aging }: AgingCardProps) {
  const total = aging.lessThanMonth.count + aging.oneToTwoMonths.count + aging.twoToThreeMonths.count + aging.threeMonthsPlus.count;
  const totalValue = aging.lessThanMonth.value + aging.oneToTwoMonths.value + aging.twoToThreeMonths.value + aging.threeMonthsPlus.value;
  
  const calculatePercentage = (count: number) => {
    if (total === 0) return 0;
    return ((count / total) * 100).toFixed(1);
  };

  const rows = [
    { label: "< 1 month", color: "bg-green-500", data: aging.lessThanMonth },
    { label: "1-2 months", color: "bg-yellow-500", data: aging.oneToTwoMonths },
    { label: "2-3 months", color: "bg-orange-500", data: aging.twoToThreeMonths },
    { label: "3+ months", color: "bg-red-500", data: aging.threeMonthsPlus },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Stock Aging Analysis</CardTitle>
        <Clock className="h-5 w-5 text-orange-600" />
      </CardHeader>
      <CardContent>
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 pb-2 border-b font-semibold text-sm text-gray-700">
          <div>Age</div>
          <div className="text-right">Count</div>
          <div className="text-right">%</div>
          <div className="text-right">Value</div>
        </div>

        {/* Table Rows */}
        <div className="space-y-2 mt-3">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-4 gap-4 items-center">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${row.color}`}></div>
                <span className="text-base font-medium">{row.label}</span>
              </div>
              <div className="text-right text-base font-bold">{row.data.count}</div>
              <div className="text-right text-sm text-muted-foreground">
                {calculatePercentage(row.data.count)}%
              </div>
              <div className="text-right text-sm text-muted-foreground">
                {formatCompactNumber(row.data.value)}
              </div>
            </div>
          ))}
        </div>

        {/* Total Row */}
        <div className="grid grid-cols-4 gap-4 items-center pt-3 mt-3 border-t">
          <div className="text-base font-semibold">Total</div>
          <div className="text-right text-xl font-bold">{total.toLocaleString()}</div>
          <div className="text-right text-sm font-semibold">100%</div>
          <div className="text-right text-base font-semibold">
            {formatCompactNumber(totalValue)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
