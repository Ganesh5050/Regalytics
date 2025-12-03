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
  Area
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface SalesData {
  month: string;
  revenue: number;
  deals: number;
  leads: number;
}

interface SalesForecastingProps {
  salesData: SalesData[];
  timeRange: string;
}

export function SalesForecasting({ salesData, timeRange }: SalesForecastingProps) {
  // Calculate forecasting metrics
  const currentRevenue = salesData[salesData.length - 1]?.revenue || 0;
  const previousRevenue = salesData[salesData.length - 2]?.revenue || 0;
  const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

  const currentDeals = salesData[salesData.length - 1]?.deals || 0;
  const previousDeals = salesData[salesData.length - 2]?.deals || 0;
  const dealsGrowth = previousDeals > 0 ? ((currentDeals - previousDeals) / previousDeals) * 100 : 0;

  // Generate forecast data (next 6 months)
  const forecastData = [];
  const lastData = salesData[salesData.length - 1];
  
  for (let i = 1; i <= 6; i++) {
    const forecastMonth = new Date();
    forecastMonth.setMonth(forecastMonth.getMonth() + i);
    const monthName = forecastMonth.toLocaleDateString('en-US', { month: 'short' });
    
    // Simple linear forecast based on recent growth
    const forecastRevenue = lastData.revenue * Math.pow(1 + (revenueGrowth / 100), i);
    const forecastDeals = lastData.deals * Math.pow(1 + (dealsGrowth / 100), i);
    const forecastLeads = lastData.leads * Math.pow(1 + (dealsGrowth / 100), i);
    
    forecastData.push({
      month: monthName,
      revenue: Math.round(forecastRevenue),
      deals: Math.round(forecastDeals),
      leads: Math.round(forecastLeads),
      isForecast: true
    });
  }

  // Combine historical and forecast data
  const combinedData = [
    ...salesData.map(item => ({ ...item, isForecast: false })),
    ...forecastData
  ];

  // Calculate quarterly targets
  const quarterlyTargets = [
    { quarter: 'Q1 2024', target: 750000, actual: 595000, progress: 79.3 },
    { quarter: 'Q2 2024', target: 850000, actual: 850000, progress: 100 },
    { quarter: 'Q3 2024', target: 900000, actual: 875000, progress: 97.2 },
    { quarter: 'Q4 2024', target: 950000, actual: 0, progress: 0 }
  ];

  // Sales velocity metrics
  const salesVelocity = {
    current: 18500,
    target: 20000,
    growth: 8.1
  };

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

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 80) return 'bg-blue-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Forecast Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Forecast</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentRevenue)}</div>
            <div className="flex items-center space-x-1 text-xs">
              <span className={revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}>
                {formatPercentage(revenueGrowth)} vs last month
              </span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Next 6 months: {formatCurrency(forecastData.reduce((sum, item) => sum + item.revenue, 0))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals Forecast</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentDeals}</div>
            <div className="flex items-center space-x-1 text-xs">
              <span className={dealsGrowth > 0 ? 'text-green-600' : 'text-red-600'}>
                {formatPercentage(dealsGrowth)} vs last month
              </span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Next 6 months: {forecastData.reduce((sum, item) => sum + item.deals, 0)} deals
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Velocity</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(salesVelocity.current)}</div>
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-green-600">
                {formatPercentage(salesVelocity.growth)} vs target
              </span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Target: {formatCurrency(salesVelocity.target)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Forecast</CardTitle>
          <CardDescription>
            Historical revenue and 6-month forecast based on current trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quarterly Targets */}
      <Card>
        <CardHeader>
          <CardTitle>Quarterly Targets</CardTitle>
          <CardDescription>
            Progress towards quarterly revenue targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quarterlyTargets.map((quarter) => (
              <div key={quarter.quarter} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{quarter.quarter}</span>
                    {quarter.progress >= 100 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : quarter.progress >= 80 ? (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatCurrency(quarter.actual)} / {formatCurrency(quarter.target)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {quarter.progress.toFixed(1)}% complete
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(quarter.progress)}`}
                    style={{ width: `${Math.min(quarter.progress, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deals Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Deals Forecast</CardTitle>
            <CardDescription>
              Expected number of deals over the next 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [value, 'Deals']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar 
                  dataKey="deals" 
                  fill="#8884d8"
                  fillOpacity={0.8}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Generation Forecast</CardTitle>
            <CardDescription>
              Expected lead volume over the next 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [value, 'Leads']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="#00C49F"
                  strokeWidth={2}
                  dot={{ fill: '#00C49F', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Forecast Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Forecast Alerts</CardTitle>
          <CardDescription>
            Important insights and recommendations based on current trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-green-800">Revenue Growth On Track</div>
                <div className="text-sm text-green-700">
                  Current growth rate of {formatPercentage(revenueGrowth)} suggests you'll exceed Q4 targets by 12%.
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-800">Deal Size Optimization</div>
                <div className="text-sm text-yellow-700">
                  Consider focusing on larger deals to improve average deal size and revenue per customer.
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-800">Lead Generation Opportunity</div>
                <div className="text-sm text-blue-700">
                  Lead volume is growing steadily. Consider increasing marketing investment to accelerate growth.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
