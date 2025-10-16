"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Package, Clock } from "lucide-react";
import type { MovementMetrics, ValueMetrics } from "@/lib/inventory-analysis/types";
import { formatCompactNumber } from "@/lib/inventory-analysis/calculations";

interface MovementCardsProps {
  metrics: MovementMetrics;
  values: ValueMetrics;
  averageStockTurn: number;
}

export function MovementCards({ metrics, values, averageStockTurn }: MovementCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* New Listings Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">New Listings</CardTitle>
          <TrendingUp className="h-5 w-5 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{metrics.newListings.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">Properties listed</p>
          <div className="text-xl font-semibold text-green-600 mt-2">
            {formatCompactNumber(values.newStockValue)}
          </div>
          <p className="text-sm text-muted-foreground">Total value</p>
        </CardContent>
      </Card>

      {/* Sold Listings Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Sold Listings</CardTitle>
          <TrendingDown className="h-5 w-5 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{metrics.soldListings.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">Properties with offers</p>
          <div className="text-xl font-semibold text-blue-600 mt-2">
            {formatCompactNumber(values.soldStockValue)}
          </div>
          <p className="text-sm text-muted-foreground">Total value</p>
        </CardContent>
      </Card>

      {/* Current Stock Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Current Stock</CardTitle>
          <Package className="h-5 w-5 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{metrics.currentStock.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">Active inventory</p>
          <div className="text-xl font-semibold text-purple-600 mt-2">
            {formatCompactNumber(values.currentStockValue)}
          </div>
          <p className="text-sm text-muted-foreground">Total value</p>
        </CardContent>
      </Card>

      {/* Average Stock Turn Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Avg Stock Turn</CardTitle>
          <Clock className="h-5 w-5 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{averageStockTurn}</div>
          <p className="text-sm text-muted-foreground">Days to sell</p>
          <div className="text-xl font-semibold text-orange-600 mt-2">
            {averageStockTurn > 0 ? `${averageStockTurn} days` : 'N/A'}
          </div>
          <p className="text-sm text-muted-foreground">Average time</p>
        </CardContent>
      </Card>
    </div>
  );
}
