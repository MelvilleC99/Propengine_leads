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

interface FiltersProps {
  agencies: string[];
  selectedAgency: string;
  onAgencyChange: (agency: string) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

export function Filters({
  agencies,
  selectedAgency,
  onAgencyChange,
  dateRange,
  onDateRangeChange,
}: FiltersProps) {
  
  return (
    <div className="flex gap-4 items-end">
      <div className="flex-1">
        <Label htmlFor="agency-filter" className="text-sm font-medium text-gray-700">
          Filter by Agency
        </Label>
        <Select value={selectedAgency} onValueChange={onAgencyChange}>
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

      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-40">
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