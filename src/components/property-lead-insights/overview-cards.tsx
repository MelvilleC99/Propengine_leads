"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Eye, Users, TrendingUp } from "lucide-react";

interface OverviewCardsProps {
  data: {
    totalProperties: number;
    totalEnquiries: number;
    uniqueLeads: number;
    conversionRate: number;
  };
}

export function OverviewCards({ data }: OverviewCardsProps) {
  // Safety check for undefined data
  const safeData = {
    totalProperties: data?.totalProperties || 0,
    totalEnquiries: data?.totalEnquiries || 0,
    uniqueLeads: data?.uniqueLeads || 0,
    conversionRate: data?.conversionRate || 0,
  };

  const cards = [
    {
      title: "Properties Enquired",
      value: safeData.totalProperties.toLocaleString(),
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: "Total Enquiries",
      value: safeData.totalEnquiries.toLocaleString(),
      icon: Eye,
      color: "text-green-600",
    },
    {
      title: "Unique Leads",
      value: safeData.uniqueLeads.toLocaleString(),
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Conversion Rate",
      value: `${safeData.conversionRate}%`,
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
