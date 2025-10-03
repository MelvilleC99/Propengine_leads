"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FiltersProps {
  agencies: string[];
  selectedAgencies: string[];
  onAgenciesChange: (agencies: string[]) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  customStartDate?: string;
  customEndDate?: string;
  onCustomDateChange?: (startDate: string, endDate: string) => void;
}

export function Filters({
  agencies,
  selectedAgencies,
  onAgenciesChange,
  dateRange,
  onDateRangeChange,
  customStartDate,
  customEndDate,
  onCustomDateChange,
}: FiltersProps) {
  const [startDate, setStartDate] = useState(customStartDate || "");
  const [endDate, setEndDate] = useState(customEndDate || "");
  
  const handleAgencyChange = (value: string) => {
    if (value === "all") {
      onAgenciesChange([]);
    } else {
      // For now, single select. Can enhance to multi-select later
      onAgenciesChange([value]);
    }
  };

  const handleApplyCustomDates = () => {
    if (onCustomDateChange && startDate && endDate) {
      onCustomDateChange(startDate, endDate);
      onDateRangeChange("custom");
    }
  };

  return (
    <div className="space-y-4">
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
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {dateRange === "custom" && (
        <div className="flex gap-4 items-end p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <Label htmlFor="start-date" className="text-sm font-medium text-gray-700">
              Start Date
            </Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="end-date" className="text-sm font-medium text-gray-700">
              End Date
            </Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full"
            />
          </div>
          <Button 
            onClick={handleApplyCustomDates}
            disabled={!startDate || !endDate}
            className="whitespace-nowrap"
          >
            Apply Dates
          </Button>
        </div>
      )}
    </div>
  );
}
