import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Calendar,
  Target,
  Building2,
  Phone
} from "lucide-react";

export function StatsCards() {
  const stats = [
    {
      title: "Total Leads",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: Users,
      description: "From last month"
    },
    {
      title: "Revenue",
      value: "$45,678",
      change: "+8%",
      trend: "up",
      icon: DollarSign,
      description: "This month"
    },
    {
      title: "Conversion Rate",
      value: "23.4%",
      change: "-2%",
      trend: "down",
      icon: Target,
      description: "From last month"
    },
    {
      title: "Active Properties",
      value: "89",
      change: "+5",
      trend: "up",
      icon: Building2,
      description: "New listings"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {stat.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                {stat.change}
              </span>
              <span>{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function RecentLeadsCard() {
  const recentLeads = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 (555) 123-4567",
      property: "123 Main St, Austin TX",
      status: "new",
      date: "2 hours ago"
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike@example.com",
      phone: "+1 (555) 987-6543",
      property: "456 Oak Ave, Dallas TX",
      status: "contacted",
      date: "4 hours ago"
    },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "+1 (555) 456-7890",
      property: "789 Pine Rd, Houston TX",
      status: "qualified",
      date: "6 hours ago"
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david@example.com",
      phone: "+1 (555) 321-0987",
      property: "321 Elm St, San Antonio TX",
      status: "new",
      date: "8 hours ago"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="secondary">New</Badge>;
      case "contacted":
        return <Badge variant="outline">Contacted</Badge>;
      case "qualified":
        return <Badge variant="default">Qualified</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Leads</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentLeads.map((lead) => (
            <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {lead.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm text-gray-500">{lead.email}</p>
                  <p className="text-sm text-gray-500">{lead.property}</p>
                </div>
              </div>
              <div className="text-right">
                {getStatusBadge(lead.status)}
                <p className="text-sm text-gray-500 mt-1">{lead.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickActionsCard() {
  const actions = [
    {
      title: "Add New Lead",
      description: "Manually add a new lead",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Schedule Call",
      description: "Book a follow-up call",
      icon: Phone,
      color: "bg-green-500"
    },
    {
      title: "Create Report",
      description: "Generate analytics report",
      icon: Calendar,
      color: "bg-purple-500"
    },
    {
      title: "View Properties",
      description: "Browse active listings",
      icon: Building2,
      color: "bg-orange-500"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

