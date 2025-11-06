"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import type { Source } from "@/lib/property-lead-insights/types";

interface SourceBreakdownCardProps {
  data: Source[];
}

export function SourceBreakdownCard({ data }: SourceBreakdownCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <PieChart className="h-5 w-5 text-purple-600" />
          Source Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <>
            <div className="space-y-3">
              {data.map((source) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-3 h-3 rounded-full ${source.color}`} />
                    <span className="text-sm font-medium text-gray-900">
                      {source.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {source.count}
                    </div>
                    <div className="text-xs text-gray-500">
                      {source.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Bar */}
            <div className="mt-4 w-full h-3 flex rounded-full overflow-hidden">
              {data.map((source) => (
                <div
                  key={source.name}
                  className={source.color}
                  style={{ width: `${source.percentage}%` }}
                  title={`${source.name}: ${source.percentage}%`}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No data available</p>
        )}
      </CardContent>
    </Card>
  );
}
