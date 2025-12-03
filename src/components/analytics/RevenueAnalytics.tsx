import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Target,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface SalesData {
  month: string;
  revenue: number;
  deals: number;
  leads: number;
}

interface RevenueAnalyticsProps {
  salesData: SalesData[];
  timeRange: string;
}

export function RevenueAnalytics({ salesData, timeRange }: RevenueAnalyticsProps) {
  // Mock data for revenue analytics
  const revenueMetrics = {
    totalRevenue: 2450000,
    monthlyRecurring: 180000,
    oneTimeRevenue: 650000,
    revenueGrowth: 12.5,
    averageDealSize: 18500,
    revenuePerCustomer: 1960
  };

  const revenueBySource = [
    { source: 'New Sales', revenue: 1200000, percentage: 49.0, growth: 15.2 },
    { source: 'Renewals', revenue: 850000, percentage: 34.7, growth: 8.5 },
    { source: 'Upsells', revenue: 280000, percentage: 11.4, growth: 22.1 },
    { source: 'Add-ons', revenue: 120000, percentage: 4.9, growth: 18.7 }
  ];

  const revenueByProduct = [
    { product: 'Enterprise Plan', revenue: 980000, deals: 28, avgDeal: 35000 },
    { product: 'Professional Plan', revenue: 735000, deals: 49, avgDeal: 15000 },
    { product: 'Standard Plan', revenue: 490000, deals: 98, avgDeal: 5000 },
    { product: 'Basic Plan', revenue: 245000, deals: 245, avgDeal: 1000 }
  ];

  const monthlyRevenueTrends = [
    { month: 'Jan', revenue: 180000, target: 200000, growth: 8.5 },
    { month: 'Feb', revenue: 220000, target: 200000, growth: 22.2 },
    { month: 'Mar', revenue: 195000, target: 200000, growth: -11.4 },
    { month: 'Apr', revenue: 250000, target: 220000, growth: 28.2 },
    { month: 'May', revenue: 280000, target: 220000, growth: 12.0 },
    { month: 'Jun', revenue: 320000, target: 250000, growth: 14.3 },
    { month: 'Jul', revenue: 290000, target: 250000, growth: -9.4 },
    { month: 'Aug', revenue: 310000, target: 250000, growth: 6.9 },
    { month: 'Sep', revenue: 275000, target: 250000, growth: -11.3 },
    { month: 'Oct', revenue: 300000, target: 280000, growth: 9.1 },
    { month: 'Nov', revenue: 285000, target: 280000, growth: -5.0 },
    { month: 'Dec', revenue: 335000, target: 280000, growth: 17.5 }
  ];

  const quarterlyRevenue = [
    { quarter: 'Q1 2024', revenue: 595000, target: 600000, growth: 15.2 },
    { quarter: 'Q2 2024', target: 750000, revenue: 850000, growth: 42.9 },
    { quarter: 'Q3 2024', target: 800000, revenue: 875000, growth: 2.9 },
    { quarter: 'Q4 2024', target: 900000, revenue: 0, growth: 0 }
  ];

  const revenueForecast = [
    { month: 'Jan 2025', forecast: 350000, confidence: 85 },
    { month: 'Feb 2025', forecast: 380000, confidence: 82 },
    { month: 'Mar 2025', forecast: 420000, confidence: 80 },
    { month: 'Apr 2025', forecast: 450000, confidence: 78 },
    { month: 'May 2025', forecast: 480000, confidence: 75 },
    { month: 'Jun 2025', forecast: 520000, confidence: 72 }
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
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getGrowthColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4" />;
    if (value < 0) return <TrendingDown className="h-4 w-4" />;
    return null;
  };

  const getTargetStatus = (actual: number, target: number) => {
    const percentage = (actual / target) * 100;
    if (percentage >= 100) return { status: 'exceeded', color: 'text-green-600', bg: 'bg-green-50' };
    if (percentage >= 90) return { status: 'on-track', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (percentage >= 80) return { status: 'at-risk', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { status: 'behind', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenueMetrics.totalRevenue)}</div>
            <div className="flex items-center space-x-1 text-xs">
              {getGrowthIcon(revenueMetrics.revenueGrowth)}
              <span className={getGrowthColor(revenueMetrics.revenueGrowth)}>
                {formatPercentage(revenueMetrics.revenueGrowth)} vs last year
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenueMetrics.monthlyRecurring)}</div>
            <p className="text-xs text-muted-foreground">
              Monthly recurring revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenueMetrics.averageDealSize)}</div>
            <p className="text-xs text-muted-foreground">
              Per deal average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue/Customer</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenueMetrics.revenuePerCustomer)}</div>
            <p className="text-xs text-muted-foreground">
              Annual revenue per customer
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Source */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Source</CardTitle>
          <CardDescription>
            Revenue breakdown by source and growth rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueBySource.map((source) => (
              <div key={source.source} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{source.source}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatPercentage(source.percentage)} of total revenue
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(source.revenue)}</div>
                    <div className="text-sm text-muted-foreground">Revenue</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium flex items-center space-x-1 ${getGrowthColor(source.growth)}`}>
                      {getGrowthIcon(source.growth)}
                      <span>{formatPercentage(source.growth)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Growth</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Revenue Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Trends</CardTitle>
          <CardDescription>
            Revenue performance vs targets over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={monthlyRevenueTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === 'revenue' ? 'Actual Revenue' : 'Target Revenue'
                ]}
              />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Area type="monotone" dataKey="target" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue by Product */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Product</CardTitle>
            <CardDescription>
              Revenue distribution across product lines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueByProduct}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ product, percentage }) => `${product}: ${formatPercentage(percentage)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {revenueByProduct.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [formatCurrency(value), 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
            <CardDescription>
              Revenue and deal metrics by product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueByProduct.map((product) => (
                <div key={product.product} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{product.product}</span>
                    <span className="text-sm text-muted-foreground">
                      {product.deals} deals
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Avg: {formatCurrency(product.avgDeal)}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(product.revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quarterly Revenue */}
      <Card>
        <CardHeader>
          <CardTitle>Quarterly Revenue Performance</CardTitle>
          <CardDescription>
            Quarterly revenue vs targets and growth rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quarterlyRevenue.map((quarter) => {
              const targetStatus = getTargetStatus(quarter.revenue, quarter.target);
              return (
                <div key={quarter.quarter} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{quarter.quarter}</span>
                      {quarter.revenue >= quarter.target ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(quarter.revenue)} / {formatCurrency(quarter.target)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {((quarter.revenue / quarter.target) * 100).toFixed(1)}% of target
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        quarter.revenue >= quarter.target ? 'bg-green-500' :
                        (quarter.revenue / quarter.target) >= 0.9 ? 'bg-blue-500' :
                        (quarter.revenue / quarter.target) >= 0.8 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((quarter.revenue / quarter.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Forecast</CardTitle>
          <CardDescription>
            6-month revenue forecast with confidence levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueForecast}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'forecast' ? formatCurrency(value) : `${value}%`,
                  name === 'forecast' ? 'Forecast' : 'Confidence'
                ]}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Insights</CardTitle>
          <CardDescription>
            Key insights and recommendations for revenue optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-green-800">Strong Revenue Growth</div>
                <div className="text-sm text-green-700">
                  Revenue is growing at 12.5% YoY. Upsells show the highest growth at 22.1%.
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-800">Enterprise Focus</div>
                <div className="text-sm text-blue-700">
                  Enterprise Plan generates 40% of revenue with highest average deal size. Consider expanding enterprise sales.
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-800">Q4 Target Risk</div>
                <div className="text-sm text-yellow-700">
                  Q4 2024 target of $900k is ambitious. Consider additional revenue streams or acceleration strategies.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
