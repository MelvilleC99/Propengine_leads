"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchFilterOptions } from "@/lib/property-lead-insights/api";

interface FiltersProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  selectedAgency: string;
  onAgencyChange: (agency: string) => void;
  selectedAgent: string;
  onAgentChange: (agent: string) => void;
}

export function Filters({
  dateRange,
  onDateRangeChange,
  selectedAgency,
  onAgencyChange,
  selectedAgent,
  onAgentChange,
}: FiltersProps) {
  const [agencies, setAgencies] = useState<string[]>([]);
  const [agents, setAgents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFilterOptions() {
      try {
        const options = await fetchFilterOptions();
        setAgencies(options.agencies);
        setAgents(options.agents);
      } catch (error) {
        console.error("Error loading filter options:", error);
      } finally {
        setLoading(false);
      }
    }
    loadFilterOptions();
  }, []);

  return (
    <div className="bg-white px-4 md:px-6 py-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        <div className="flex flex-col md:flex-row md:items-center gap-2 flex-1">
          <Label htmlFor="date-range" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Date Range
          </Label>
          <Select value={dateRange} onValueChange={onDateRangeChange}>
            <SelectTrigger id="date-range" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-2 flex-1">
          <Label htmlFor="agency" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Agency
          </Label>
          <Select value={selectedAgency} onValueChange={onAgencyChange} disabled={loading}>
            <SelectTrigger id="agency" className="h-9">
              <SelectValue placeholder={loading ? "Loading..." : "All Agencies"} />
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

        <div className="flex flex-col md:flex-row md:items-center gap-2 flex-1">
          <Label htmlFor="agent" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Agent
          </Label>
          <Select value={selectedAgent} onValueChange={onAgentChange} disabled={loading}>
            <SelectTrigger id="agent" className="h-9">
              <SelectValue placeholder={loading ? "Loading..." : "All Agents"} />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              <SelectItem value="all">All Agents</SelectItem>
              {agents.map((agent) => (
                <SelectItem key={agent} value={agent}>
                  {agent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button 
          className="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap w-full md:w-auto text-center"
          onClick={() => {
            onDateRangeChange("30days");
            onAgencyChange("all");
            onAgentChange("all");
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}