import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Calendar,
  Star
} from "lucide-react";

interface Deal {
  id: string;
  name: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  source: string;
  createdAt: string;
  lastActivity: string;
  notes: string;
  tags: string[];
  products: string[];
}

interface SalesAnalyticsProps {
  deals: Deal[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function SalesAnalytics({ deals }: SalesAnalyticsProps) {
  // Calculate metrics
  const totalDeals = deals.length;
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const weightedValue = deals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);
  const avgDealSize = totalValue / totalDeals;
  const winRate = (deals.filter(deal => deal.stage === 'closed-won').length / totalDeals) * 100;

  // Stage distribution
  const stageData = [
    { name: 'Prospecting', value: deals.filter(deal => deal.stage === 'prospecting').length, color: '#0088FE' },
    { name: 'Qualification', value: deals.filter(deal => deal.stage === 'qualification').length, color: '#00C49F' },
    { name: 'Proposal', value: deals.filter(deal => deal.stage === 'proposal').length, color: '#FFBB28' },
    { name: 'Negotiation', value: deals.filter(deal => deal.stage === 'negotiation').length, color: '#FF8042' },
    { name: 'Closed Won', value: deals.filter(deal => deal.stage === 'closed-won').length, color: '#82CA9D' },
    { name: 'Closed Lost', value: deals.filter(deal => deal.stage === 'closed-lost').length, color: '#FF6B6B' }
  ];

  // Source distribution
  const sourceData = [
    { name: 'Website', value: deals.filter(deal => deal.source === 'Website').length },
    { name: 'Referral', value: deals.filter(deal => deal.source === 'Referral').length },
    { name: 'LinkedIn', value: deals.filter(deal => deal.source === 'LinkedIn').length },
    { name: 'Email', value: deals.filter(deal => deal.source === 'Email').length },
    { name: 'Phone', value: deals.filter(deal => deal.source === 'Phone').length }
  ];

  // Monthly trend (mock data)
  const monthlyTrend = [
    { month: 'Jan', deals: 12, value: 450000 },
    { month: 'Feb', deals: 15, value: 520000 },
    { month: 'Mar', deals: 18, value: 680000 },
    { month: 'Apr', deals: 22, value: 750000 },
    { month: 'May', deals: 19, value: 620000 },
    { month: 'Jun', deals: 25, value: 890000 }
  ];

  // Probability distribution
  const probabilityRanges = [
    { range: '0-20%', count: deals.filter(deal => deal.probability >= 0 && deal.probability <= 20).length },
    { range: '21-40%', count: deals.filter(deal => deal.probability >= 21 && deal.probability <= 40).length },
    { range: '41-60%', count: deals.filter(deal => deal.probability >= 41 && deal.probability <= 60).length },
    { range: '61-80%', count: deals.filter(deal => deal.probability >= 61 && deal.probability <= 80).length },
    { range: '81-100%', count: deals.filter(deal => deal.probability >= 81 && deal.probability <= 100).length }
  ];

  // Top performing sources
  const topSources = sourceData
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Sales team performance
  const teamPerformance = [
    { name: 'Sarah Johnson', deals: deals.filter(deal => deal.assignedTo === 'Sarah Johnson').length, value: deals.filter(deal => deal.assignedTo === 'Sarah Johnson').reduce((sum, deal) => sum + deal.value, 0) },
    { name: 'Mike Chen', deals: deals.filter(deal => deal.assignedTo === 'Mike Chen').length, value: deals.filter(deal => deal.assignedTo === 'Mike Chen').reduce((sum, deal) => sum + deal.value, 0) }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weighted Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(weightedValue).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(avgDealSize).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sources">Lead Sources</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stage Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Deal Stage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Probability Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Deal Probability Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={probabilityRanges}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lead Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Deal Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sourceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSources.map((source, index) => (
                    <div key={source.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <span className="font-medium">{source.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{source.value}</div>
                        <div className="text-xs text-muted-foreground">deals</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Deal Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="deals" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Value Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Value Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Team Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamPerformance.map((member, index) => (
                    <div key={member.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <span className="font-medium">{member.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{member.deals} deals</div>
                        <div className="text-xs text-muted-foreground">
                          ${member.value.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Deal Size</span>
                    <span className="font-bold">${Math.round(avgDealSize).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sales Cycle Length</span>
                    <span className="font-bold">45 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Win Rate</span>
                    <span className="font-bold">{winRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Pipeline Velocity</span>
                    <span className="font-bold">$125K/month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
