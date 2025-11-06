"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import type { Agent } from "@/lib/property-lead-insights/types";

interface AgentsCardProps {
  data: Agent[];
}

export function AgentsCard({ data }: AgentsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-orange-600" />
          Most Active Agents
        </CardTitle>
        <p className="text-xs text-gray-500 mt-1">
          By unique leads viewing their listings
        </p>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="space-y-4">
            {data.map((agent, index) => (
              <div key={`${agent.name}-${index}`} className="pb-3 border-b last:border-b-0">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">
                      {index + 1}. {agent.name}
                    </div>
                    <div className="text-xs text-gray-500">{agent.agency}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-orange-600">
                      {agent.leadCount} leads
                    </div>
                    <div className="text-xs text-gray-500">
                      {agent.enquiryCount} enquiries
                    </div>
                  </div>
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
