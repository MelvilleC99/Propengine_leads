"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { formatCompactNumber } from "@/lib/inventory-analysis/calculations";

interface SuburbCardProps {
  suburbs: Array<{ suburb: string; count: number; value: number; avgTurn: number }>;
}

export function SuburbCard({ suburbs }: SuburbCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Top Suburbs by Stock</CardTitle>
        <MapPin className="h-5 w-5 text-blue-600" />
      </CardHeader>
      <CardContent>
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 pb-2 border-b font-semibold text-sm text-gray-700">
          <div className="col-span-2">Suburb</div>
          <div className="text-right">Count</div>
          <div className="text-right">Value</div>
          <div className="text-right">Avg Turn</div>
        </div>

        {/* Table Rows */}
        <div className="space-y-2 mt-3">
          {suburbs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No data available</p>
          ) : (
            suburbs.map((suburb, index) => (
              <div key={suburb.suburb} className="grid grid-cols-5 gap-4 items-center">
                <div className="col-span-2 flex items-center space-x-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                    {index + 1}
                  </div>
                  <span className="text-base font-medium">{suburb.suburb}</span>
                </div>
                <div className="text-right text-base font-bold">{suburb.count}</div>
                <div className="text-right text-sm text-muted-foreground">
                  {formatCompactNumber(suburb.value)}
                </div>
                <div className="text-right text-base font-semibold text-orange-600">
                  {suburb.avgTurn > 0 ? `${suburb.avgTurn}d` : 'N/A'}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
