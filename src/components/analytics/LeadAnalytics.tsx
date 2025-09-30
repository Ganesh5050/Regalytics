import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { 
  Users, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign
} from "lucide-react";

interface PipelineData {
  stage: string;
  count: number;
  value: number;
  conversion: number;
}

interface LeadAnalyticsProps {
  pipelineData: PipelineData[];
  timeRange: string;
}

export function LeadAnalytics({ pipelineData, timeRange }: LeadAnalyticsProps) {
  // Mock data for lead analytics
  const leadSources = [
    { source: 'Website', count: 450, conversion: 24.5, value: 6750000 },
    { source: 'Social Media', count: 320, conversion: 18.2, value: 4800000 },
    { source: 'Email Campaign', count: 280, conversion: 22.1, value: 4200000 },
    { source: 'Referrals', count: 150, conversion: 35.8, value: 2250000 },
    { source: 'Cold Outreach', count: 120, conversion: 12.3, value: 1800000 },
    { source: 'Events', count: 80, conversion: 28.7, value: 1200000 }
  ];

  const leadQuality = [
    { quality: 'Hot', count: 180, conversion: 45.2, color: '#FF6B6B' },
    { quality: 'Warm', count: 420, conversion: 28.7, color: '#FFE66D' },
    { quality: 'Cold', count: 650, conversion: 12.1, color: '#4ECDC4' }
  ];

  const monthlyLeadTrends = [
    { month: 'Jan', leads: 95, qualified: 38, converted: 12 },
    { month: 'Feb', leads: 110, qualified: 44, converted: 15 },
    { month: 'Mar', leads: 98, qualified: 39, converted: 13 },
    { month: 'Apr', leads: 125, qualified: 50, converted: 18 },
    { month: 'May', leads: 140, qualified: 56, converted: 20 },
    { month: 'Jun', leads: 155, qualified: 62, converted: 22 },
    { month: 'Jul', leads: 135, qualified: 54, converted: 19 },
    { month: 'Aug', leads: 148, qualified: 59, converted: 21 },
    { month: 'Sep', leads: 130, qualified: 52, converted: 18 },
    { month: 'Oct', leads: 142, qualified: 57, converted: 20 },
    { month: 'Nov', leads: 138, qualified: 55, converted: 19 },
    { month: 'Dec', leads: 160, qualified: 64, converted: 23 }
  ];

  const conversionFunnel = [
    { stage: 'Visitors', count: 10000, conversion: 100 },
    { stage: 'Leads', count: 1400, conversion: 14 },
    { stage: 'Qualified', count: 560, conversion: 5.6 },
    { stage: 'Proposals', count: 280, conversion: 2.8 },
    { stage: 'Closed Won', count: 168, conversion: 1.68 }
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

  const getConversionColor = (conversion: number) => {
    if (conversion >= 30) return 'text-green-600';
    if (conversion >= 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConversionIcon = (conversion: number) => {
    if (conversion >= 30) return <TrendingUp className="h-4 w-4" />;
    if (conversion >= 20) return <AlertCircle className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  const totalLeads = leadSources.reduce((sum, source) => sum + source.count, 0);
  const totalValue = leadSources.reduce((sum, source) => sum + source.value, 0);
  const averageConversion = leadSources.reduce((sum, source) => sum + source.conversion, 0) / leadSources.length;

  return (
    <div className="space-y-6">
      {/* Lead Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Pipeline value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Conversion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(averageConversion)}</div>
            <p className="text-xs text-muted-foreground">
              Across all sources
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">40.2%</div>
            <p className="text-xs text-muted-foreground">
              Lead qualification rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lead Sources Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Sources Performance</CardTitle>
          <CardDescription>
            Performance metrics by lead source
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leadSources.map((source) => (
              <div key={source.source} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{source.source}</div>
                    <div className="text-sm text-muted-foreground">
                      {source.count.toLocaleString()} leads
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(source.value)}</div>
                    <div className="text-sm text-muted-foreground">Pipeline value</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium flex items-center space-x-1 ${getConversionColor(source.conversion)}`}>
                      {getConversionIcon(source.conversion)}
                      <span>{formatPercentage(source.conversion)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Conversion rate</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Quality Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Quality Distribution</CardTitle>
            <CardDescription>
              Distribution of leads by quality score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leadQuality}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ quality, count, percentage }) => `${quality}: ${count} (${percentage.toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {leadQuality.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Lead Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Lead Trends</CardTitle>
            <CardDescription>
              Lead generation and conversion trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyLeadTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="leads" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Area type="monotone" dataKey="qualified" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Area type="monotone" dataKey="converted" stackId="1" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>
            Lead progression through the sales funnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversionFunnel.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium">{stage.stage}</div>
                      <div className="text-sm text-muted-foreground">
                        {stage.count.toLocaleString()} contacts
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatPercentage(stage.conversion)}</div>
                    <div className="text-sm text-muted-foreground">Conversion rate</div>
                  </div>
                </div>
                {index < conversionFunnel.length - 1 && (
                  <div className="absolute left-8 top-full w-0.5 h-4 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Analysis</CardTitle>
          <CardDescription>
            Current pipeline stages and conversion rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pipelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'count' ? value.toLocaleString() : formatCurrency(value),
                  name === 'count' ? 'Count' : 'Value'
                ]}
              />
              <Bar dataKey="count" fill="#8884d8" name="count" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Lead Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Insights</CardTitle>
          <CardDescription>
            Key insights and recommendations for lead optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-green-800">Referrals Perform Best</div>
                <div className="text-sm text-green-700">
                  Referral leads have the highest conversion rate at 35.8%. Consider implementing a referral program.
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-800">Cold Outreach Optimization</div>
                <div className="text-sm text-yellow-700">
                  Cold outreach has the lowest conversion rate at 12.3%. Consider improving targeting and messaging.
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-800">Website Lead Volume</div>
                <div className="text-sm text-blue-700">
                  Website generates the most leads (450). Consider optimizing conversion rates to improve quality.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
