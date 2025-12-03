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
  AreaChart,
  Area
} from "recharts";
import { 
  Users, 
  Heart, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Clock,
  Star,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  UserMinus
} from "lucide-react";

interface CustomerInsightsProps {
  timeRange: string;
}

export function CustomerInsights({ timeRange }: CustomerInsightsProps) {
  // Mock data for customer insights
  const customerMetrics = {
    totalCustomers: 1250,
    newCustomers: 85,
    churnedCustomers: 12,
    netGrowth: 73,
    customerLTV: 125000,
    averageOrderValue: 18500,
    customerSatisfaction: 4.6,
    npsScore: 72
  };

  const customerSegments = [
    { segment: 'Enterprise', count: 45, revenue: 1800000, ltv: 250000, growth: 15.2 },
    { segment: 'Mid-Market', count: 180, revenue: 1350000, ltv: 150000, growth: 8.7 },
    { segment: 'SMB', count: 650, revenue: 975000, ltv: 75000, growth: 12.3 },
    { segment: 'Startup', count: 375, revenue: 562500, ltv: 45000, growth: 22.1 }
  ];

  const customerLifecycle = [
    { stage: 'New', count: 85, revenue: 1572500, duration: 0 },
    { stage: 'Active', count: 980, revenue: 18130000, duration: 12 },
    { stage: 'At Risk', count: 120, revenue: 2220000, duration: 8 },
    { stage: 'Churned', count: 65, revenue: 1202500, duration: 24 }
  ];

  const monthlyCustomerTrends = [
    { month: 'Jan', new: 75, churned: 8, net: 67, total: 1180 },
    { month: 'Feb', new: 82, churned: 10, net: 72, total: 1252 },
    { month: 'Mar', new: 78, churned: 9, net: 69, total: 1321 },
    { month: 'Apr', new: 88, churned: 11, net: 77, total: 1398 },
    { month: 'May', new: 92, churned: 7, net: 85, total: 1483 },
    { month: 'Jun', new: 85, churned: 12, net: 73, total: 1556 },
    { month: 'Jul', new: 90, churned: 9, net: 81, total: 1637 },
    { month: 'Aug', new: 87, churned: 10, net: 77, total: 1714 },
    { month: 'Sep', new: 83, churned: 8, net: 75, total: 1789 },
    { month: 'Oct', new: 89, churned: 11, net: 78, total: 1867 },
    { month: 'Nov', new: 86, churned: 9, net: 77, total: 1944 },
    { month: 'Dec', new: 91, churned: 13, net: 78, total: 2022 }
  ];

  const customerSatisfaction = [
    { rating: 5, count: 650, percentage: 52 },
    { rating: 4, count: 375, percentage: 30 },
    { rating: 3, count: 150, percentage: 12 },
    { rating: 2, count: 50, percentage: 4 },
    { rating: 1, count: 25, percentage: 2 }
  ];

  const churnReasons = [
    { reason: 'Price', count: 35, percentage: 29.2 },
    { reason: 'Competitor', count: 28, percentage: 23.3 },
    { reason: 'Poor Support', count: 22, percentage: 18.3 },
    { reason: 'Feature Missing', count: 18, percentage: 15.0 },
    { reason: 'Other', count: 17, percentage: 14.2 }
  ];

  const customerAcquisition = [
    { source: 'Website', customers: 450, cost: 125000, ltv: 112500, roi: 800 },
    { source: 'Referrals', customers: 280, cost: 45000, ltv: 70000, roi: 1556 },
    { source: 'Social Media', customers: 320, cost: 85000, ltv: 80000, roi: 941 },
    { source: 'Email Marketing', customers: 200, cost: 35000, ltv: 50000, roi: 1429 }
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

  const getSatisfactionColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getChurnRiskColor = (count: number) => {
    if (count >= 100) return 'text-red-600';
    if (count >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerMetrics.totalCustomers.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs">
              <UserPlus className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+{customerMetrics.netGrowth} this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer LTV</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(customerMetrics.customerLTV)}</div>
            <p className="text-xs text-muted-foreground">
              Average lifetime value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerMetrics.customerSatisfaction}/5</div>
            <p className="text-xs text-muted-foreground">
              NPS Score: {customerMetrics.npsScore}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4%</div>
            <p className="text-xs text-muted-foreground">
              Monthly churn rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Segments */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Segments</CardTitle>
          <CardDescription>
            Customer distribution by segment and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customerSegments.map((segment) => (
              <div key={segment.segment} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{segment.segment}</div>
                    <div className="text-sm text-muted-foreground">
                      {segment.count} customers
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(segment.revenue)}</div>
                    <div className="text-sm text-muted-foreground">Revenue</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(segment.ltv)}</div>
                    <div className="text-sm text-muted-foreground">Avg LTV</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium flex items-center space-x-1 ${getGrowthColor(segment.growth)}`}>
                      {getGrowthIcon(segment.growth)}
                      <span>{formatPercentage(segment.growth)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Growth</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Lifecycle */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Lifecycle</CardTitle>
          <CardDescription>
            Customer distribution across lifecycle stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={customerLifecycle}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'count' ? value.toLocaleString() : formatCurrency(value),
                  name === 'count' ? 'Customers' : 'Revenue'
                ]}
              />
              <Bar dataKey="count" fill="#8884d8" name="count" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Customer Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Customer Trends</CardTitle>
          <CardDescription>
            Customer acquisition and churn trends over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={monthlyCustomerTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="new" stackId="1" stroke="#00C49F" fill="#00C49F" fillOpacity={0.6} />
              <Area type="monotone" dataKey="churned" stackId="1" stroke="#FF8042" fill="#FF8042" fillOpacity={0.6} />
              <Area type="monotone" dataKey="net" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Customer Satisfaction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
            <CardDescription>
              Distribution of customer satisfaction ratings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customerSatisfaction.map((rating) => (
                <div key={rating.rating} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{rating.rating} stars</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {rating.count} customers
                    </span>
                    <Badge variant="secondary">{formatPercentage(rating.percentage)}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Churn Reasons</CardTitle>
            <CardDescription>
              Primary reasons for customer churn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={churnReasons}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ reason, percentage }) => `${reason}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {churnReasons.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Customer Acquisition */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Acquisition</CardTitle>
          <CardDescription>
            Customer acquisition by source and ROI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customerAcquisition.map((source) => (
              <div key={source.source} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">{source.source}</div>
                    <div className="text-sm text-muted-foreground">
                      {source.customers} customers acquired
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(source.cost)}</div>
                    <div className="text-sm text-muted-foreground">Acquisition cost</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(source.ltv)}</div>
                    <div className="text-sm text-muted-foreground">Total LTV</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">{source.roi}%</div>
                    <div className="text-sm text-muted-foreground">ROI</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Insights</CardTitle>
          <CardDescription>
            Key insights and recommendations for customer success
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-green-800">High Customer Satisfaction</div>
                <div className="text-sm text-green-700">
                  Customer satisfaction is 4.6/5 with 82% giving 4+ stars. Focus on maintaining this level.
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-800">Strong Referral Program</div>
                <div className="text-sm text-blue-700">
                  Referrals have the highest ROI at 1556%. Consider expanding referral incentives.
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-800">Price Sensitivity</div>
                <div className="text-sm text-yellow-700">
                  29% of churn is due to price. Consider value-based pricing or retention offers.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
