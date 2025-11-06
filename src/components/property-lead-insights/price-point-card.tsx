"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import type { PriceRange } from "@/lib/property-lead-insights/types";

interface PricePointCardProps {
  data: PriceRange[];
}

export function PricePointCard({ data }: PricePointCardProps) {
  const getBarColor = (index: number) => {
    const colors = [
      "bg-green-500",
      "bg-blue-500",
      "bg-purple-500",
      "bg-orange-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Price Point Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="space-y-4">
            {data.map((range, index) => (
              <div key={range.range}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {range.range}
                  </span>
                  <span className="text-sm text-gray-600">
                    {range.count} ({range.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${getBarColor(index)} h-2 rounded-full`}
                    style={{ width: `${range.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No data available</p>
        )}
      </CardContent>
    </Card>
  );
}
