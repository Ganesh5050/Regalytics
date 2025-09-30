import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  Award,
  Star,
  CheckCircle
} from "lucide-react";

interface TopPerformer {
  name: string;
  revenue: number;
  deals: number;
  conversion: number;
  rank: number;
}

interface SalesPerformanceProps {
  topPerformers: TopPerformer[];
  timeRange: string;
}

export function SalesPerformance({ topPerformers, timeRange }: SalesPerformanceProps) {
  // Mock data for sales performance
  const teamMetrics = {
    totalRevenue: 2450000,
    totalDeals: 150,
    averageDealSize: 16333,
    teamSize: 12,
    topPerformerRevenue: 450000,
    teamAverageRevenue: 204167
  };

  const monthlyPerformance = [
    { month: 'Jan', revenue: 180000, deals: 12, target: 200000 },
    { month: 'Feb', revenue: 220000, deals: 15, target: 200000 },
    { month: 'Mar', revenue: 195000, deals: 13, target: 200000 },
    { month: 'Apr', revenue: 250000, deals: 18, target: 220000 },
    { month: 'May', revenue: 280000, deals: 20, target: 220000 },
    { month: 'Jun', revenue: 320000, deals: 22, target: 250000 },
    { month: 'Jul', revenue: 290000, deals: 19, target: 250000 },
    { month: 'Aug', revenue: 310000, deals: 21, target: 250000 },
    { month: 'Sep', revenue: 275000, deals: 18, target: 250000 },
    { month: 'Oct', revenue: 300000, deals: 20, target: 280000 },
    { month: 'Nov', revenue: 285000, deals: 19, target: 280000 },
    { month: 'Dec', revenue: 335000, deals: 23, target: 280000 }
  ];

  const performanceCategories = [
    { category: 'Revenue', value: 85, max: 100 },
    { category: 'Deals', value: 78, max: 100 },
    { category: 'Conversion', value: 92, max: 100 },
    { category: 'Activity', value: 88, max: 100 },
    { category: 'Pipeline', value: 75, max: 100 }
  ];

  const dealSizeDistribution = [
    { range: '$0-10k', count: 45, percentage: 30 },
    { range: '$10k-25k', count: 60, percentage: 40 },
    { range: '$25k-50k', count: 30, percentage: 20 },
    { range: '$50k+', count: 15, percentage: 10 }
  ];

  const salesActivities = [
    { activity: 'Calls Made', count: 1250, target: 1000, performance: 125 },
    { activity: 'Emails Sent', count: 3200, target: 3000, performance: 107 },
    { activity: 'Meetings Scheduled', count: 180, target: 150, performance: 120 },
    { activity: 'Proposals Sent', count: 95, target: 80, performance: 119 },
    { activity: 'Follow-ups', count: 450, target: 400, performance: 113 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Award className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <Star className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 120) return 'text-green-600';
    if (performance >= 100) return 'text-blue-600';
    if (performance >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (performance: number) => {
    if (performance >= 120) return 'bg-green-100 text-green-800';
    if (performance >= 100) return 'bg-blue-100 text-blue-800';
    if (performance >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Team Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(teamMetrics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {teamMetrics.totalDeals} deals closed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(teamMetrics.averageDealSize)}</div>
            <p className="text-xs text-muted-foreground">
              Per deal average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMetrics.teamSize}</div>
            <p className="text-xs text-muted-foreground">
              Active sales reps
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(teamMetrics.topPerformerRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage((teamMetrics.topPerformerRevenue / teamMetrics.teamAverageRevenue - 1) * 100)} above average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>
            Sales team performance rankings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((performer) => (
              <div key={performer.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(performer.rank)}
                    <span className="font-medium text-lg">#{performer.rank}</span>
                  </div>
                  <div>
                    <div className="font-medium text-lg">{performer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {performer.deals} deals closed
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(performer.revenue)}</div>
                    <div className="text-sm text-muted-foreground">Revenue</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatPercentage(performer.conversion)}</div>
                    <div className="text-sm text-muted-foreground">Conversion rate</div>
                  </div>
                  <Badge className={getPerformanceBadge(performer.conversion)}>
                    {performer.conversion >= 30 ? 'Excellent' : 
                     performer.conversion >= 25 ? 'Good' : 
                     performer.conversion >= 20 ? 'Average' : 'Needs Improvement'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Performance vs Targets */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance vs Targets</CardTitle>
          <CardDescription>
            Team performance against monthly targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === 'revenue' ? 'Revenue' : name === 'deals' ? 'Deals' : 'Target'
                ]}
              />
              <Bar dataKey="revenue" fill="#8884d8" name="revenue" />
              <Bar dataKey="target" fill="#82ca9d" name="target" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Categories</CardTitle>
            <CardDescription>
              Team performance across key metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={performanceCategories}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Performance"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deal Size Distribution</CardTitle>
            <CardDescription>
              Distribution of deals by size range
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dealSizeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, percentage }) => `${range}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {dealSizeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sales Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Activities</CardTitle>
          <CardDescription>
            Team activity metrics and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesActivities.map((activity) => (
              <div key={activity.activity} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{activity.activity}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {activity.count.toLocaleString()} / {activity.target.toLocaleString()}
                    </span>
                    <Badge className={getPerformanceBadge(activity.performance)}>
                      {formatPercentage(activity.performance)}
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      activity.performance >= 120 ? 'bg-green-500' :
                      activity.performance >= 100 ? 'bg-blue-500' :
                      activity.performance >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(activity.performance, 150)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>
            Key insights and recommendations for sales team improvement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-green-800">Team Exceeding Targets</div>
                <div className="text-sm text-green-700">
                  The team is performing 15% above target on average. Consider setting more ambitious goals.
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-800">High Activity Levels</div>
                <div className="text-sm text-blue-700">
                  Sales activities are above target. Focus on improving conversion rates to maximize ROI.
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <Target className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-800">Deal Size Optimization</div>
                <div className="text-sm text-yellow-700">
                  70% of deals are under $25k. Consider focusing on larger opportunities to increase revenue.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
