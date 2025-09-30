import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";
import { SalesForecasting } from "@/components/analytics/SalesForecasting";
import { LeadAnalytics } from "@/components/analytics/LeadAnalytics";
import { SalesPerformance } from "@/components/analytics/SalesPerformance";
import { CustomerInsights } from "@/components/analytics/CustomerInsights";
import { RevenueAnalytics } from "@/components/analytics/RevenueAnalytics";

// Mock data for CRM analytics
const mockKPIs = {
  totalRevenue: 2450000,
  revenueGrowth: 12.5,
  totalLeads: 1250,
  leadGrowth: 8.3,
  conversionRate: 24.7,
  conversionGrowth: 3.2,
  averageDealSize: 18500,
  dealSizeGrowth: 5.8,
  salesCycle: 45,
  cycleGrowth: -8.2,
  customerLTV: 125000,
  ltvGrowth: 15.3,
  churnRate: 3.2,
  churnGrowth: -12.5
};

const mockSalesData = [
  { month: 'Jan', revenue: 180000, deals: 12, leads: 95 },
  { month: 'Feb', revenue: 220000, deals: 15, leads: 110 },
  { month: 'Mar', revenue: 195000, deals: 13, leads: 98 },
  { month: 'Apr', revenue: 250000, deals: 18, leads: 125 },
  { month: 'May', revenue: 280000, deals: 20, leads: 140 },
  { month: 'Jun', revenue: 320000, deals: 22, leads: 155 },
  { month: 'Jul', revenue: 290000, deals: 19, leads: 135 },
  { month: 'Aug', revenue: 310000, deals: 21, leads: 148 },
  { month: 'Sep', revenue: 275000, deals: 18, leads: 130 },
  { month: 'Oct', revenue: 300000, deals: 20, leads: 142 },
  { month: 'Nov', revenue: 285000, deals: 19, leads: 138 },
  { month: 'Dec', revenue: 335000, deals: 23, leads: 160 }
];

const mockTopPerformers = [
  { name: 'Sarah Johnson', revenue: 450000, deals: 28, conversion: 32.5, rank: 1 },
  { name: 'Mike Chen', revenue: 380000, deals: 24, conversion: 28.7, rank: 2 },
  { name: 'Emily Davis', revenue: 320000, deals: 20, conversion: 26.3, rank: 3 },
  { name: 'David Wilson', revenue: 290000, deals: 18, conversion: 24.1, rank: 4 },
  { name: 'Lisa Brown', revenue: 260000, deals: 16, conversion: 22.8, rank: 5 }
];

const mockPipelineData = [
  { stage: 'Lead', count: 450, value: 6750000, conversion: 100 },
  { stage: 'Qualified', count: 180, value: 2700000, conversion: 40 },
  { stage: 'Proposal', count: 95, value: 1425000, conversion: 21 },
  { stage: 'Negotiation', count: 45, value: 675000, conversion: 10 },
  { stage: 'Closed Won', count: 28, value: 420000, conversion: 6.2 },
  { stage: 'Closed Lost', count: 12, value: 180000, conversion: 2.7 }
];

export default function CRMAnalytics() {
  const [timeRange, setTimeRange] = useState("12months");
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting analytics data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your sales performance and customer data
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="12months">Last 12 months</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockKPIs.totalRevenue)}</div>
            <div className="flex items-center space-x-1 text-xs">
              {getGrowthIcon(mockKPIs.revenueGrowth)}
              <span className={getGrowthColor(mockKPIs.revenueGrowth)}>
                {formatPercentage(mockKPIs.revenueGrowth)} from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIs.totalLeads.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs">
              {getGrowthIcon(mockKPIs.leadGrowth)}
              <span className={getGrowthColor(mockKPIs.leadGrowth)}>
                {formatPercentage(mockKPIs.leadGrowth)} from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIs.conversionRate}%</div>
            <div className="flex items-center space-x-1 text-xs">
              {getGrowthIcon(mockKPIs.conversionGrowth)}
              <span className={getGrowthColor(mockKPIs.conversionGrowth)}>
                {formatPercentage(mockKPIs.conversionGrowth)} from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockKPIs.averageDealSize)}</div>
            <div className="flex items-center space-x-1 text-xs">
              {getGrowthIcon(mockKPIs.dealSizeGrowth)}
              <span className={getGrowthColor(mockKPIs.dealSizeGrowth)}>
                {formatPercentage(mockKPIs.dealSizeGrowth)} from last period
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Cycle</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIs.salesCycle} days</div>
            <div className="flex items-center space-x-1 text-xs">
              {getGrowthIcon(mockKPIs.cycleGrowth)}
              <span className={getGrowthColor(mockKPIs.cycleGrowth)}>
                {formatPercentage(mockKPIs.cycleGrowth)} from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer LTV</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockKPIs.customerLTV)}</div>
            <div className="flex items-center space-x-1 text-xs">
              {getGrowthIcon(mockKPIs.ltvGrowth)}
              <span className={getGrowthColor(mockKPIs.ltvGrowth)}>
                {formatPercentage(mockKPIs.ltvGrowth)} from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIs.churnRate}%</div>
            <div className="flex items-center space-x-1 text-xs">
              {getGrowthIcon(mockKPIs.churnGrowth)}
              <span className={getGrowthColor(mockKPIs.churnGrowth)}>
                {formatPercentage(mockKPIs.churnGrowth)} from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(12150000)}</div>
            <div className="text-xs text-muted-foreground">
              {mockPipelineData.reduce((sum, stage) => sum + stage.count, 0)} total opportunities
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="forecasting" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="forecasting">Sales Forecasting</TabsTrigger>
          <TabsTrigger value="leads">Lead Analytics</TabsTrigger>
          <TabsTrigger value="performance">Sales Performance</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="forecasting" className="space-y-6">
          <SalesForecasting 
            salesData={mockSalesData}
            timeRange={timeRange}
          />
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <LeadAnalytics 
            pipelineData={mockPipelineData}
            timeRange={timeRange}
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <SalesPerformance 
            topPerformers={mockTopPerformers}
            timeRange={timeRange}
          />
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <CustomerInsights 
            timeRange={timeRange}
          />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <RevenueAnalytics 
            salesData={mockSalesData}
            timeRange={timeRange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
