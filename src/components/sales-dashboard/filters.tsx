"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltersProps {
  agencies: string[];
  selectedAgencies: string[];
  onAgenciesChange: (agencies: string[]) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

export function Filters({
  agencies,
  selectedAgencies,
  onAgenciesChange,
  dateRange,
  onDateRangeChange,
}: FiltersProps) {
  
  const handleAgencyChange = (value: string) => {
    if (value === "all") {
      onAgenciesChange([]);
    } else {
      // For now, single select. Can enhance to multi-select later
      onAgenciesChange([value]);
    }
  };

  return (
    <div className="flex gap-4 items-end">
      <div className="flex-1">
        <Label htmlFor="agency-filter" className="text-sm font-medium text-gray-700">
          Filter by Agency
        </Label>
        <Select 
          value={selectedAgencies.length === 0 ? "all" : selectedAgencies[0]}
          onValueChange={handleAgencyChange}
        >
          <SelectTrigger id="agency-filter" className="w-full">
            <SelectValue placeholder="All Agencies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Agencies</SelectItem>
            {agencies.map((agency) => (
              <SelectItem key={agency} value={agency}>
                {agency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-64">
        <Label htmlFor="date-filter" className="text-sm font-medium text-gray-700">
          Date Range
        </Label>
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger id="date-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="1month">Last Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
