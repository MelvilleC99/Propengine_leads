import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Target,
  Building2,
  Calendar,
  BarChart3
} from "lucide-react";

export default function AnalyticsPage() {
  const metrics = [
    {
      title: "Total Leads",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: Users,
      description: "From last month"
    },
    {
      title: "Conversion Rate",
      value: "23.4%",
      change: "+2.1%",
      trend: "up",
      icon: Target,
      description: "From last month"
    },
    {
      title: "Average Deal Size",
      value: "$425,000",
      change: "+8%",
      trend: "up",
      icon: DollarSign,
      description: "From last month"
    },
    {
      title: "Time to Close",
      value: "45 days",
      change: "-5 days",
      trend: "up",
      icon: Calendar,
      description: "From last month"
    }
  ];

  const leadSources = [
    { source: "Website", leads: 456, percentage: 37 },
    { source: "Referrals", leads: 234, percentage: 19 },
    { source: "Social Media", leads: 189, percentage: 15 },
    { source: "Cold Calls", leads: 156, percentage: 13 },
    { source: "Email Campaigns", leads: 123, percentage: 10 },
    { source: "Other", leads: 76, percentage: 6 }
  ];

  const monthlyData = [
    { month: "Jan", leads: 89, conversions: 23, revenue: 125000 },
    { month: "Feb", leads: 112, conversions: 28, revenue: 156000 },
    { month: "Mar", leads: 98, conversions: 31, revenue: 189000 },
    { month: "Apr", leads: 134, conversions: 35, revenue: 201000 },
    { month: "May", leads: 156, conversions: 42, revenue: 234000 },
    { month: "Jun", leads: 178, conversions: 38, revenue: 267000 }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Track your performance and insights</p>
          </div>
          <Select defaultValue="6months">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={metric.trend === "up" ? "text-green-500" : "text-red-500"}>
                    {metric.change}
                  </span>
                  <span>{metric.description}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Lead Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadSources.map((item) => (
                  <div key={item.source} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="font-medium">{item.source}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 w-12 text-right">
                        {item.leads} ({item.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((month) => (
                  <div key={month.month} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{month.month}</h4>
                      <p className="text-sm text-gray-500">{month.leads} leads</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{month.conversions} conversions</p>
                      <p className="text-sm text-gray-500">${month.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Chart visualization would go here</p>
                <p className="text-sm text-gray-400">Integrate with Chart.js or similar library</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

