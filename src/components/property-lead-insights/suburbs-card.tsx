"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { Suburb } from "@/lib/property-lead-insights/types";

interface SuburbsCardProps {
  data: Suburb[];
}

export function SuburbsCard({ data }: SuburbsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-blue-600" />
          Most Active Suburbs
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="space-y-4">
            {data.map((suburb, index) => (
              <div key={suburb.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {index + 1}. {suburb.name}
                  </span>
                  <span className="text-sm text-gray-600">{suburb.enquiries} enquiries</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${suburb.percentage}%` }}
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
