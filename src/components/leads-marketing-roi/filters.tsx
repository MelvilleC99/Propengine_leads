"use client";

import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface FiltersProps {
  agencies: string[];
  selectedAgency: string;
  onAgencyChange: (agency: string) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  selectedMonths: number[];
  onMonthsChange: (months: number[]) => void;
}

export function Filters({
  agencies,
  selectedAgency,
  onAgencyChange,
  dateRange,
  onDateRangeChange,
  selectedMonths,
  onMonthsChange,
}: FiltersProps) {
  
  const months = [
    { value: 8, label: "August 2025" },
    { value: 9, label: "September 2025" },
  ];

  const handleMonthToggle = (monthValue: number) => {
    if (selectedMonths.includes(monthValue)) {
      // Remove month
      onMonthsChange(selectedMonths.filter(m => m !== monthValue));
    } else {
      // Add month
      onMonthsChange([...selectedMonths, monthValue].sort());
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-end">
      <div className="flex-1 md:min-w-[200px]">
        <Label htmlFor="agency-filter" className="text-sm font-medium text-gray-700">
          Filter by Agency
        </Label>
        <Select value={selectedAgency} onValueChange={onAgencyChange}>
          <SelectTrigger id="agency-filter" className="w-full">
            <SelectValue placeholder="All Agencies" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto">
            <SelectItem value="all">All Agencies</SelectItem>
            {agencies.map((agency) => (
              <SelectItem key={agency} value={agency}>
                {agency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <Label className="text-sm font-medium text-gray-700 md:hidden">
          Date Range
        </Label>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <Select value={dateRange} onValueChange={onDateRangeChange}>
            <SelectTrigger className="w-full md:w-40">
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

      <div className="flex-1 md:min-w-[200px]">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Filter by Month
        </Label>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 p-3 border rounded-md bg-white">
          {months.map((month) => (
            <div key={month.value} className="flex items-center space-x-2">
              <Checkbox
                id={`month-${month.value}`}
                checked={selectedMonths.includes(month.value)}
                onCheckedChange={() => handleMonthToggle(month.value)}
              />
              <label
                htmlFor={`month-${month.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {month.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
