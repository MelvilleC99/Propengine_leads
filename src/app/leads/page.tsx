"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Building2, Calendar, Target } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { subMonths, startOfYear } from 'date-fns';
import Papa from 'papaparse';
import {
  type LeadRecord,
  type AgentData,
  type AgencyData,
  type LeadSource,
  filterLeadsByDateRange,
  aggregateByAgent,
  aggregatePEAgencies,
  aggregateCompetitorAgencies,
  calculateLeadSources,
} from '@/lib/leads-performance/calculations';

interface OtherAgency {
  org_name: string;
  agency: string;
  leads: number;
  leads_responded: number;
  response_rate: number;
}

export default function LeadsPage() {
  const [rawLeads, setRawLeads] = useState<LeadRecord[]>([]);
  const [otherAgenciesData, setOtherAgenciesData] = useState<OtherAgency[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    async function loadData() {
      try {
        // Load raw leads data
        const leadsResponse = await fetch("/sales_rental_sudonum.csv");
        const leadsText = await leadsResponse.text();
        
        Papa.parse<LeadRecord>(leadsText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            setRawLeads(results.data);
          },
          error: (error) => {
            console.error("Error parsing leads CSV:", error);
          }
        });

        // Load other agencies data (pre-aggregated)
        const otherResponse = await fetch("/other_agency_response_rates.csv");
        const otherText = await otherResponse.text();
        
        Papa.parse<OtherAgency>(otherText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            setOtherAgenciesData(results.data);
            setLoading(false);
          },
          error: (error) => {
            console.error("Error parsing other agencies CSV:", error);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Apply date filter
  const getFilteredLeads = () => {
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    const now = new Date();

    switch (dateFilter) {
      case "ytd":
        startDate = startOfYear(now);
        break;
      case "last12":
        startDate = subMonths(now, 12);
        break;
      case "last6":
        startDate = subMonths(now, 6);
        break;
      case "last3":
        startDate = subMonths(now, 3);
        break;
      default:
        break;
    }

    return filterLeadsByDateRange(rawLeads, startDate, endDate);
  };

  const filteredLeads = getFilteredLeads();
  
  // IMPORTANT: Only count SALES leads (exclude rentals)
  const salesLeads = filteredLeads.filter(l => l.lead_type === 'Sales');
  
  // Aggregate data from SALES leads only
  const agentData = aggregateByAgent(salesLeads);
  const realNetAgencies = aggregatePEAgencies(salesLeads);
  const leadSources = calculateLeadSources(salesLeads);
  
  // Use pre-loaded other agencies data (not affected by date filter)
  const otherAgencies = otherAgenciesData;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">Loading...</div>
      </DashboardLayout>
    );
  }

  // Calculate totals
  const realNetTotalLeads = realNetAgencies.reduce((sum, a) => sum + a.grand_total, 0);
  const realNetTotalResponded = realNetAgencies.reduce((sum, a) => sum + a.agent_responded, 0);
  const realNetResponseRate = realNetTotalLeads > 0 ? (realNetTotalResponded / realNetTotalLeads) * 100 : 0;

  const otherTotalLeads = otherAgencies.reduce((sum, a) => sum + a.leads, 0);
  const otherTotalResponded = otherAgencies.reduce((sum, a) => sum + a.leads_responded, 0);
  const otherResponseRate = otherTotalLeads > 0 ? (otherTotalResponded / otherTotalLeads) * 100 : 0;

  const responseDiff = realNetResponseRate - otherResponseRate;
  const leadsDiff = realNetTotalLeads - otherTotalLeads;
  const leadsDiffPercent = otherTotalLeads > 0 ? (leadsDiff / otherTotalLeads) * 100 : 0;

  // Filter agents with at least 10 leads
  const qualifiedAgents = agentData.filter(a => a.grand_total >= 10);

  // Top 5 and Bottom 5 agents
  const sortedAgents = [...qualifiedAgents].sort((a, b) => (b.response_rate || 0) - (a.response_rate || 0));
  const topAgents = sortedAgents.slice(0, 5);
  const bottomAgents = sortedAgents.slice(-5).reverse();

  // Top 5 and Bottom 5 PE agencies
  const sortedAgencies = [...realNetAgencies].sort((a, b) => b.response_rate - a.response_rate);
  const topAgencies = sortedAgencies.slice(0, 5);
  const bottomAgencies = sortedAgencies.slice(-5).reverse();

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads Performance</h1>
            <p className="text-gray-600 mt-1">Property Engine vs Industry Comparison</p>
          </div>
          
          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
                <SelectItem value="last12">Last 12 Months</SelectItem>
                <SelectItem value="last6">Last 6 Months</SelectItem>
                <SelectItem value="last3">Last 3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Overview Cards - 3 cards in a row */}
        <div className="grid grid-cols-3 gap-6">
          {/* Total Leads Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-5 w-5" />
                Total Leads Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-gray-600">Property Engine</span>
                  <span className="text-2xl font-bold text-gray-900">{realNetTotalLeads.toLocaleString()}</span>
                </div>
                <div className="border-t pt-4 flex items-baseline justify-between">
                  <span className="text-sm font-medium text-gray-600">Other Agencies</span>
                  <span className="text-2xl font-bold text-gray-900">{otherTotalLeads.toLocaleString()}</span>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-2">
                  {leadsDiff > 0 ? (
                    <>
                      <TrendingUp className="h-5 w-5 text-green-600 shrink-0" />
                      <span className="text-sm font-semibold text-green-600">
                        +{leadsDiff.toLocaleString()} more leads ({leadsDiffPercent.toFixed(0)}% more)
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-5 w-5 text-red-600 shrink-0" />
                      <span className="text-sm font-semibold text-red-600">
                        {leadsDiff.toLocaleString()} fewer leads ({Math.abs(leadsDiffPercent).toFixed(0)}% less)
                      </span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Response Rate Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Response Rate Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-gray-600">Property Engine</span>
                  <span className="text-2xl font-bold text-green-600">{realNetResponseRate.toFixed(1)}%</span>
                </div>
                <div className="border-t pt-4 flex items-baseline justify-between">
                  <span className="text-sm font-medium text-gray-600">Other Agencies</span>
                  <span className="text-2xl font-bold text-gray-900">{otherResponseRate.toFixed(1)}%</span>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-2">
                  {responseDiff > 0 ? (
                    <>
                      <TrendingUp className="h-5 w-5 text-green-600 shrink-0" />
                      <span className="text-sm font-semibold text-green-600">
                        {responseDiff.toFixed(1)}% better than industry
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-5 w-5 text-red-600 shrink-0" />
                      <span className="text-sm font-semibold text-red-600">
                        {Math.abs(responseDiff).toFixed(1)}% below industry
                      </span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lead Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-5 w-5" />
                Lead Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  {leadSources.map((source, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 font-medium text-gray-700">{source.source}</td>
                      <td className="py-2.5 text-right text-gray-600 tabular-nums w-16">{source.count}</td>
                      <td className="py-2.5 text-right font-semibold text-blue-600 tabular-nums w-14">{source.percentage.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Agency Performance */}
        <div className="grid grid-cols-2 gap-6">
          {/* Top 5 PE Agencies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Top 5 Performing Agencies (Property Engine)
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-2 pr-4">Agency</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase pb-2 w-20 pr-3">Leads</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase pb-2 w-28">Response Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topAgencies.map((agency, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 font-medium text-gray-700 pr-4" title={agency.agency}>{agency.agency}</td>
                      <td className="py-2.5 text-right text-gray-600 tabular-nums w-20 pr-3">{agency.grand_total}</td>
                      <td className="py-2.5 text-right font-semibold text-green-600 tabular-nums w-28">{agency.response_rate.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Bottom 5 PE Agencies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                Bottom 5 Performing Agencies (Property Engine)
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-2 pr-4">Agency</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase pb-2 w-20 pr-3">Leads</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase pb-2 w-28">Response Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bottomAgencies.map((agency, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 font-medium text-gray-700 pr-4" title={agency.agency}>{agency.agency}</td>
                      <td className="py-2.5 text-right text-gray-600 tabular-nums w-20 pr-3">{agency.grand_total}</td>
                      <td className="py-2.5 text-right font-semibold text-red-600 tabular-nums w-28">{agency.response_rate.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Agent Performance */}
        <div className="grid grid-cols-2 gap-6">
          {/* Top 5 Agents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Top 5 Performing Agents (Property Engine)
              </CardTitle>
              <p className="text-xs text-gray-500 mt-1">Agents with 10+ leads</p>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-2 pr-4">Agent</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase pb-2 w-20 pr-3">Leads</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase pb-2 w-28">Response Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topAgents.map((agent, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 font-medium text-gray-700 pr-4" title={agent.agent_name}>{agent.agent_name}</td>
                      <td className="py-2.5 text-right text-gray-600 tabular-nums w-20 pr-3">{agent.grand_total}</td>
                      <td className="py-2.5 text-right font-semibold text-green-600 tabular-nums w-28">{agent.response_rate.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Bottom 5 Agents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                Bottom 5 Performing Agents (Property Engine)
              </CardTitle>
              <p className="text-xs text-gray-500 mt-1">Agents with 10+ leads</p>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-2 pr-4">Agent</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase pb-2 w-20 pr-3">Leads</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase pb-2 w-28">Response Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bottomAgents.map((agent, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 font-medium text-gray-700 pr-4" title={agent.agent_name}>{agent.agent_name}</td>
                      <td className="py-2.5 text-right text-gray-600 tabular-nums w-20 pr-3">{agent.grand_total}</td>
                      <td className="py-2.5 text-right font-semibold text-red-600 tabular-nums w-28">{agent.response_rate.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
