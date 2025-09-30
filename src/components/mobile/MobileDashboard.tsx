import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react";

interface MobileDashboardProps {
  className?: string;
}

export function MobileDashboard({ className }: MobileDashboardProps) {
  // Mock data for mobile dashboard
  const quickStats = [
    {
      title: "Total Revenue",
      value: "$2.45M",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Leads",
      value: "1,250",
      change: "+8.3%",
      trend: "up",
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Today's Tasks",
      value: "12",
      change: "3 completed",
      trend: "neutral",
      icon: CheckCircle,
      color: "text-purple-600"
    },
    {
      title: "Upcoming Events",
      value: "5",
      change: "2 this week",
      trend: "neutral",
      icon: Calendar,
      color: "text-orange-600"
    }
  ];

  const recentActivities = [
    {
      type: "lead",
      title: "New lead: TechCorp Solutions",
      description: "Enterprise prospect interested in compliance solution",
      time: "2 hours ago",
      status: "new"
    },
    {
      type: "deal",
      title: "Deal closed: FinanceFirst",
      description: "$45,000 Enterprise Plan - Sarah Johnson",
      time: "4 hours ago",
      status: "success"
    },
    {
      type: "task",
      title: "Follow-up call scheduled",
      description: "Demo call with MedTech Innovations at 2 PM",
      time: "6 hours ago",
      status: "pending"
    },
    {
      type: "alert",
      title: "Compliance alert resolved",
      description: "KYC verification completed for 3 clients",
      time: "8 hours ago",
      status: "resolved"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "success": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new": return <Target className="h-4 w-4" />;
      case "success": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "resolved": return <AlertTriangle className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  return (
    <div className={`space-y-4 p-4 ${className}`}>
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-3">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className={`text-xs ${stat.color}`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-2 rounded-full bg-gray-100 ${stat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <CardDescription className="text-sm">
            Latest updates from your CRM
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                {getStatusIcon(activity.status)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {activity.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">{activity.time}</p>
                  <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription className="text-sm">
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="h-12 flex flex-col items-center justify-center">
              <Target className="h-4 w-4 mb-1" />
              <span className="text-xs">Add Lead</span>
            </Button>
            <Button variant="outline" size="sm" className="h-12 flex flex-col items-center justify-center">
              <Calendar className="h-4 w-4 mb-1" />
              <span className="text-xs">Schedule</span>
            </Button>
            <Button variant="outline" size="sm" className="h-12 flex flex-col items-center justify-center">
              <Users className="h-4 w-4 mb-1" />
              <span className="text-xs">New Contact</span>
            </Button>
            <Button variant="outline" size="sm" className="h-12 flex flex-col items-center justify-center">
              <CheckCircle className="h-4 w-4 mb-1" />
              <span className="text-xs">Add Task</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">This Month</CardTitle>
          <CardDescription className="text-sm">
            Key performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Revenue Target</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div className="w-12 h-2 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-sm font-medium">75%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Lead Target</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div className="w-14 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <span className="text-sm font-medium">87%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Task Completion</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div className="w-10 h-2 bg-purple-500 rounded-full"></div>
              </div>
              <span className="text-sm font-medium">62%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
