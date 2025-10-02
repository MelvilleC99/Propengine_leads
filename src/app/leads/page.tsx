"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Building2, Calendar, Target } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AgentData {
  agent_name: string;
  agent_notified: number;
  agent_responded: number;
  grand_total: number;
  response_rate?: number;
}

interface RealNetAgency {
  agency: string;
  agent_notified: number;
  agent_responded: number;
  grand_total: number;
  response_rate: number;
}

interface OtherAgency {
  org_name: string;
  agency: string;
  leads: number;
  leads_responded: number;
  response_rate: number;
}

interface LeadSource {
  source: string;
  count: number;
  percentage: number;
}

export default function LeadsPage() {
  const [agentData, setAgentData] = useState<AgentData[]>([]);
  const [realNetAgencies, setRealNetAgencies] = useState<RealNetAgency[]>([]);
  const [otherAgencies, setOtherAgencies] = useState<OtherAgency[]>([]);
  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    async function loadData() {
      try {
        // Load agent data
        const agentsRes = await fetch("/agent_response_rates.csv");
        const agentsText = await agentsRes.text();
        const agentRows = agentsText.split("\n").slice(1).filter(row => row.trim());
        const agents = agentRows.map(row => {
          const [agent_name, agent_notified, agent_responded, grand_total] = row.split(",");
          const notified = parseInt(agent_notified);
          const responded = parseInt(agent_responded);
          const total = parseInt(grand_total);
          return {
            agent_name,
            agent_notified: notified,
            agent_responded: responded,
            grand_total: total,
            response_rate: total > 0 ? (responded / total) * 100 : 0
          };
        });

        // Load RealNet agencies
        const realNetRes = await fetch("/realnet_agency_response_rates.csv");
        const realNetText = await realNetRes.text();
        const realNetRows = realNetText.split("\n").slice(1).filter(row => row.trim());
        const realNet = realNetRows.map(row => {
          const [agency, agent_notified, agent_responded, grand_total, response_rate] = row.split(",");
          return {
            agency,
            agent_notified: parseInt(agent_notified),
            agent_responded: parseInt(agent_responded),
            grand_total: parseInt(grand_total),
            response_rate: parseFloat(response_rate)
          };
        });

        // Load other agencies
        const otherRes = await fetch("/other_agency_response_rates.csv");
        const otherText = await otherRes.text();
        const otherRows = otherText.split("\n").slice(1).filter(row => row.trim());
        const others = otherRows.map(row => {
          const [org_name, agency, leads, leads_responded, response_rate] = row.split(",");
          return {
            org_name,
            agency,
            leads: parseInt(leads),
            leads_responded: parseInt(leads_responded),
            response_rate: parseFloat(response_rate)
          };
        });

        // Load lead sources from sudonum CSV (Sales only)
        const salesRes = await fetch("/sales_rental_sudonum.csv");
        const salesText = await salesRes.text();
        const salesRows = salesText.split("\n").slice(1).filter(row => row.trim());
        
        // Count lead sources for Sales only
        const sourceCount: Record<string, number> = {};
        salesRows.forEach(row => {
          // Simple CSV parse - split by comma but handle quoted fields
          const cols = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
          const source = cols[3]?.replace(/^"|"$/g, '').trim(); // Source column (index 3)
          const leadType = cols[12]?.replace(/^"|"$/g, '').trim(); // lead_type column (index 12)
          
          // Only count Sales leads
          if (source && leadType === 'Sales') {
            sourceCount[source] = (sourceCount[source] || 0) + 1;
          }
        });

        const totalLeadsSources = Object.values(sourceCount).reduce((sum, count) => sum + count, 0);
        const sources = Object.entries(sourceCount)
          .map(([source, count]) => ({
            source,
            count,
            percentage: totalLeadsSources > 0 ? (count / totalLeadsSources) * 100 : 0
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5); // Top 5 sources

        setAgentData(agents);
        setRealNetAgencies(realNet);
        setOtherAgencies(others);
        setLeadSources(sources);
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    }

    loadData();
  }, []);

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

  // Top 5 and Bottom 5 RealNet agencies
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
            <p className="text-gray-600 mt-1">RealNet vs Industry Comparison</p>
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
                  <span className="text-sm font-medium text-gray-600">RealNet</span>
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
                  <span className="text-sm font-medium text-gray-600">RealNet</span>
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
          {/* Top 5 RealNet Agencies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Top 5 Performing Agencies (RealNet)
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

          {/* Bottom 5 RealNet Agencies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                Bottom 5 Performing Agencies (RealNet)
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
                Top 5 Performing Agents (RealNet)
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
                      <td className="py-2.5 font-medium text-gray-700 pr-4">{agent.agent_name}</td>
                      <td className="py-2.5 text-right text-gray-600 tabular-nums w-20 pr-3">{agent.grand_total}</td>
                      <td className="py-2.5 text-right font-semibold text-green-600 tabular-nums w-28">{agent.response_rate?.toFixed(1)}%</td>
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
                Bottom 5 Performing Agents (RealNet)
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
                      <td className="py-2.5 font-medium text-gray-700 pr-4">{agent.agent_name}</td>
                      <td className="py-2.5 text-right text-gray-600 tabular-nums w-20 pr-3">{agent.grand_total}</td>
                      <td className="py-2.5 text-right font-semibold text-red-600 tabular-nums w-28">{agent.response_rate?.toFixed(1)}%</td>
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
