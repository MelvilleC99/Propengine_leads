"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Wallet } from "lucide-react";
import type { ValueMetrics } from "@/lib/inventory-analysis/types";
import { formatCompactNumber } from "@/lib/inventory-analysis/calculations";

interface ValueCardsProps {
  metrics: ValueMetrics;
}

export function ValueCards({ metrics }: ValueCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* New Stock Value Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Stock Value</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCompactNumber(metrics.newStockValue)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total value of new listings
          </p>
        </CardContent>
      </Card>

      {/* Sold Stock Value Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sold Stock Value</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCompactNumber(metrics.soldStockValue)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total value of sold properties
          </p>
        </CardContent>
      </Card>

      {/* Current Stock Value Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Stock Value</CardTitle>
          <Wallet className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCompactNumber(metrics.currentStockValue)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total value of active inventory
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
