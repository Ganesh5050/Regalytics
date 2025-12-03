import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { 
  TrendingUp,
  TrendingDown,
  Download,
  Eye,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface ReportAnalytics {
  totalReports: number;
  reportsByType: {
    type: string;
    count: number;
    percentage: number;
  }[];
  reportsByStatus: {
    status: string;
    count: number;
    percentage: number;
  }[];
  reportsByFormat: {
    format: string;
    count: number;
    percentage: number;
  }[];
  monthlyTrends: {
    month: string;
    generated: number;
    downloaded: number;
    averageSize: number;
  }[];
  topTemplates: {
    template: string;
    usage: number;
    lastUsed: string;
  }[];
  performanceMetrics: {
    averageGenerationTime: number;
    successRate: number;
    averageFileSize: number;
    totalDownloads: number;
  };
  userActivity: {
    user: string;
    reportsGenerated: number;
    lastActivity: string;
    favoriteTemplate: string;
  }[];
  systemHealth: {
    date: string;
    uptime: number;
    errorRate: number;
    responseTime: number;
  }[];
}

export function ReportAnalytics() {
  const [analytics, setAnalytics] = useState<ReportAnalytics | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');
  const [isLoading, setIsLoading] = useState(true);

  // Sample analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sampleAnalytics: ReportAnalytics = {
        totalReports: 1247,
        reportsByType: [
          { type: 'Compliance', count: 450, percentage: 36.1 },
          { type: 'Risk', count: 320, percentage: 25.7 },
          { type: 'Transaction', count: 280, percentage: 22.5 },
          { type: 'Client', count: 150, percentage: 12.0 },
          { type: 'Custom', count: 47, percentage: 3.7 }
        ],
        reportsByStatus: [
          { status: 'Ready', count: 1100, percentage: 88.2 },
          { status: 'Generating', count: 45, percentage: 3.6 },
          { status: 'Failed', count: 25, percentage: 2.0 },
          { status: 'Expired', count: 77, percentage: 6.2 }
        ],
        reportsByFormat: [
          { format: 'PDF', count: 650, percentage: 52.1 },
          { format: 'Excel', count: 420, percentage: 33.7 },
          { format: 'CSV', count: 150, percentage: 12.0 },
          { format: 'JSON', count: 27, percentage: 2.2 }
        ],
        monthlyTrends: [
          { month: 'Jan', generated: 180, downloaded: 165, averageSize: 2.3 },
          { month: 'Feb', generated: 195, downloaded: 178, averageSize: 2.1 },
          { month: 'Mar', generated: 220, downloaded: 205, averageSize: 2.5 },
          { month: 'Apr', generated: 210, downloaded: 195, averageSize: 2.2 },
          { month: 'May', generated: 240, downloaded: 225, averageSize: 2.4 },
          { month: 'Jun', generated: 202, downloaded: 190, averageSize: 2.3 }
        ],
        topTemplates: [
          { template: 'Monthly Compliance Report', usage: 145, lastUsed: '2024-01-15' },
          { template: 'Transaction Analysis Report', usage: 98, lastUsed: '2024-01-14' },
          { template: 'Risk Assessment Summary', usage: 76, lastUsed: '2024-01-13' },
          { template: 'Client KYC Status Report', usage: 65, lastUsed: '2024-01-12' },
          { template: 'Audit Trail Report', usage: 54, lastUsed: '2024-01-11' }
        ],
        performanceMetrics: {
          averageGenerationTime: 2.3,
          successRate: 96.8,
          averageFileSize: 2.3,
          totalDownloads: 1158
        },
        userActivity: [
          { user: 'John Doe', reportsGenerated: 45, lastActivity: '2024-01-15T10:30:00Z', favoriteTemplate: 'Monthly Compliance Report' },
          { user: 'Jane Smith', reportsGenerated: 38, lastActivity: '2024-01-15T09:15:00Z', favoriteTemplate: 'Transaction Analysis Report' },
          { user: 'Mike Johnson', reportsGenerated: 32, lastActivity: '2024-01-14T16:45:00Z', favoriteTemplate: 'Risk Assessment Summary' },
          { user: 'Sarah Wilson', reportsGenerated: 28, lastActivity: '2024-01-14T14:20:00Z', favoriteTemplate: 'Client KYC Status Report' },
          { user: 'David Brown', reportsGenerated: 25, lastActivity: '2024-01-14T11:30:00Z', favoriteTemplate: 'Audit Trail Report' }
        ],
        systemHealth: [
          { date: '2024-01-15', uptime: 99.9, errorRate: 0.1, responseTime: 1.2 },
          { date: '2024-01-14', uptime: 99.8, errorRate: 0.2, responseTime: 1.1 },
          { date: '2024-01-13', uptime: 99.9, errorRate: 0.1, responseTime: 1.3 },
          { date: '2024-01-12', uptime: 99.7, errorRate: 0.3, responseTime: 1.4 },
          { date: '2024-01-11', uptime: 99.9, errorRate: 0.1, responseTime: 1.2 },
          { date: '2024-01-10', uptime: 99.8, errorRate: 0.2, responseTime: 1.1 }
        ]
      };
      
      setAnalytics(sampleAnalytics);
      setIsLoading(false);
    };

    loadAnalytics();
  }, [selectedTimeRange]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Analytics Data</h3>
          <p className="text-muted-foreground">Unable to load report analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Report Analytics</h2>
          <p className="text-muted-foreground">Comprehensive insights into report usage and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">{analytics.totalReports.toLocaleString()}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{analytics.performanceMetrics.successRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+2.1% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Generation Time</p>
                <p className="text-2xl font-bold">{analytics.performanceMetrics.averageGenerationTime}s</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">-0.3s from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                <p className="text-2xl font-bold">{analytics.performanceMetrics.totalDownloads.toLocaleString()}</p>
              </div>
              <Download className="h-8 w-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+18% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Reports by Type */}
            <Card>
              <CardHeader>
                <CardTitle>Reports by Type</CardTitle>
                <CardDescription>Distribution of report types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.reportsByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percentage }) => `${type} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.reportsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Reports by Format */}
            <Card>
              <CardHeader>
                <CardTitle>Reports by Format</CardTitle>
                <CardDescription>Distribution of report formats</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.reportsByFormat}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="format" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Reports by Status */}
          <Card>
            <CardHeader>
              <CardTitle>Reports by Status</CardTitle>
              <CardDescription>Current status distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analytics.reportsByStatus.map(status => (
                  <div key={status.status} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{status.count}</div>
                    <div className="text-sm text-muted-foreground">{status.status}</div>
                    <div className="text-xs text-muted-foreground">{status.percentage}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Report generation and download trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={analytics.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="generated" fill="#3b82f6" name="Generated" />
                  <Line yAxisId="right" type="monotone" dataKey="downloaded" stroke="#10b981" name="Downloaded" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Templates</CardTitle>
              <CardDescription>Most frequently used report templates</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Usage Count</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.topTemplates.map((template, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{template.template}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{template.usage}</Badge>
                      </TableCell>
                      <TableCell>{new Date(template.lastUsed).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Report generation activity by user</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Reports Generated</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Favorite Template</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.userActivity.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{user.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.reportsGenerated}</Badge>
                      </TableCell>
                      <TableCell>{new Date(user.lastActivity).toLocaleString()}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.favoriteTemplate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Report generation system performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={analytics.systemHealth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="uptime" fill="#10b981" name="Uptime %" />
                  <Line yAxisId="right" type="monotone" dataKey="errorRate" stroke="#ef4444" name="Error Rate %" />
                  <Line yAxisId="right" type="monotone" dataKey="responseTime" stroke="#3b82f6" name="Response Time (s)" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
