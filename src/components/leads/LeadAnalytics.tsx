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

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  score: number;
  value: number;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  notes: string;
  tags: string[];
}

interface LeadAnalyticsProps {
  leads: Lead[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function LeadAnalytics({ leads }: LeadAnalyticsProps) {
  // Calculate metrics
  const totalLeads = leads.length;
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const avgScore = leads.reduce((sum, lead) => sum + lead.score, 0) / totalLeads;
  const conversionRate = (leads.filter(lead => lead.status === 'closed-won').length / totalLeads) * 100;

  // Status distribution
  const statusData = [
    { name: 'New', value: leads.filter(lead => lead.status === 'new').length, color: '#0088FE' },
    { name: 'Contacted', value: leads.filter(lead => lead.status === 'contacted').length, color: '#00C49F' },
    { name: 'Qualified', value: leads.filter(lead => lead.status === 'qualified').length, color: '#FFBB28' },
    { name: 'Proposal', value: leads.filter(lead => lead.status === 'proposal').length, color: '#FF8042' },
    { name: 'Negotiation', value: leads.filter(lead => lead.status === 'negotiation').length, color: '#8884D8' },
    { name: 'Closed Won', value: leads.filter(lead => lead.status === 'closed-won').length, color: '#82CA9D' },
    { name: 'Closed Lost', value: leads.filter(lead => lead.status === 'closed-lost').length, color: '#FF6B6B' }
  ];

  // Source distribution
  const sourceData = [
    { name: 'Website', value: leads.filter(lead => lead.source === 'Website').length },
    { name: 'Referral', value: leads.filter(lead => lead.source === 'Referral').length },
    { name: 'LinkedIn', value: leads.filter(lead => lead.source === 'LinkedIn').length },
    { name: 'Email', value: leads.filter(lead => lead.source === 'Email').length },
    { name: 'Phone', value: leads.filter(lead => lead.source === 'Phone').length }
  ];

  // Monthly trend (mock data)
  const monthlyTrend = [
    { month: 'Jan', leads: 45, value: 125000 },
    { month: 'Feb', leads: 52, value: 145000 },
    { month: 'Mar', leads: 48, value: 138000 },
    { month: 'Apr', leads: 61, value: 167000 },
    { month: 'May', leads: 55, value: 152000 },
    { month: 'Jun', leads: 67, value: 189000 }
  ];

  // Score distribution
  const scoreRanges = [
    { range: '0-20', count: leads.filter(lead => lead.score >= 0 && lead.score <= 20).length },
    { range: '21-40', count: leads.filter(lead => lead.score >= 21 && lead.score <= 40).length },
    { range: '41-60', count: leads.filter(lead => lead.score >= 41 && lead.score <= 60).length },
    { range: '61-80', count: leads.filter(lead => lead.score >= 61 && lead.score <= 80).length },
    { range: '81-100', count: leads.filter(lead => lead.score >= 81 && lead.score <= 100).length }
  ];

  // Top performing sources
  const topSources = sourceData
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lead Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgScore)}</div>
            <p className="text-xs text-muted-foreground">
              +5 points from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              +3% from last month
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
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Score Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scoreRanges}>
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
                <CardTitle>Lead Sources</CardTitle>
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
                        <div className="text-xs text-muted-foreground">leads</div>
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
                <CardTitle>Monthly Lead Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="leads" stackId="1" stroke="#8884d8" fill="#8884d8" />
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
            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusData.map((status, index) => (
                    <div key={status.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <span className="font-medium">{status.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{status.value}</div>
                        <div className="text-xs text-muted-foreground">
                          {index > 0 ? `${((status.value / statusData[index - 1].value) * 100).toFixed(1)}%` : '100%'}
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
                    <span className="font-bold">${(totalValue / totalLeads).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Time to Close</span>
                    <span className="font-bold">45 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Win Rate</span>
                    <span className="font-bold">{conversionRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Lead Response Time</span>
                    <span className="font-bold">2.5 hours</span>
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
