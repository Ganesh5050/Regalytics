import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  Users, 
  AlertTriangle,
  Download,
  Filter,
  Calendar
} from 'lucide-react';

// Sample data for different chart types
const transactionTrendData = [
  { month: 'Jan', volume: 2400000, count: 1200, risk: 15 },
  { month: 'Feb', volume: 2800000, count: 1350, risk: 18 },
  { month: 'Mar', volume: 3200000, count: 1500, risk: 22 },
  { month: 'Apr', volume: 2900000, count: 1400, risk: 19 },
  { month: 'May', volume: 3500000, count: 1650, risk: 25 },
  { month: 'Jun', volume: 3800000, count: 1800, risk: 28 }
];

const riskDistributionData = [
  { name: 'Low Risk', value: 45, color: '#10b981' },
  { name: 'Medium Risk', value: 35, color: '#f59e0b' },
  { name: 'High Risk', value: 20, color: '#ef4444' }
];

const complianceScoreData = [
  { month: 'Jan', score: 85, target: 90 },
  { month: 'Feb', score: 88, target: 90 },
  { month: 'Mar', score: 92, target: 90 },
  { month: 'Apr', score: 89, target: 90 },
  { month: 'May', score: 94, target: 90 },
  { month: 'Jun', score: 96, target: 90 }
];

const clientGrowthData = [
  { month: 'Jan', newClients: 45, totalClients: 1200 },
  { month: 'Feb', newClients: 52, totalClients: 1252 },
  { month: 'Mar', newClients: 48, totalClients: 1300 },
  { month: 'Apr', newClients: 61, totalClients: 1361 },
  { month: 'May', newClients: 55, totalClients: 1416 },
  { month: 'Jun', newClients: 67, totalClients: 1483 }
];

const alertTrendsData = [
  { day: 'Mon', alerts: 12, resolved: 8 },
  { day: 'Tue', alerts: 15, resolved: 12 },
  { day: 'Wed', alerts: 18, resolved: 14 },
  { day: 'Thu', alerts: 14, resolved: 11 },
  { day: 'Fri', alerts: 20, resolved: 16 },
  { day: 'Sat', alerts: 8, resolved: 6 },
  { day: 'Sun', alerts: 5, resolved: 4 }
];

const riskHeatmapData = [
  { hour: 0, day: 'Mon', value: 2 },
  { hour: 1, day: 'Mon', value: 1 },
  { hour: 2, day: 'Mon', value: 0 },
  { hour: 3, day: 'Mon', value: 1 },
  { hour: 4, day: 'Mon', value: 2 },
  { hour: 5, day: 'Mon', value: 3 },
  { hour: 6, day: 'Mon', value: 4 },
  { hour: 7, day: 'Mon', value: 5 },
  { hour: 8, day: 'Mon', value: 6 },
  { hour: 9, day: 'Mon', value: 7 },
  { hour: 10, day: 'Mon', value: 8 },
  { hour: 11, day: 'Mon', value: 7 },
  { hour: 12, day: 'Mon', value: 6 },
  { hour: 13, day: 'Mon', value: 5 },
  { hour: 14, day: 'Mon', value: 4 },
  { hour: 15, day: 'Mon', value: 3 },
  { hour: 16, day: 'Mon', value: 2 },
  { hour: 17, day: 'Mon', value: 1 },
  { hour: 18, day: 'Mon', value: 2 },
  { hour: 19, day: 'Mon', value: 3 },
  { hour: 20, day: 'Mon', value: 4 },
  { hour: 21, day: 'Mon', value: 3 },
  { hour: 22, day: 'Mon', value: 2 },
  { hour: 23, day: 'Mon', value: 1 }
];

const performanceMetricsData = [
  { metric: 'Response Time', score: 85, target: 90 },
  { metric: 'Uptime', score: 99.5, target: 99.9 },
  { metric: 'Accuracy', score: 96, target: 95 },
  { metric: 'Throughput', score: 88, target: 85 },
  { metric: 'Efficiency', score: 92, target: 90 }
];

export function AdvancedCharts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Analytics</h2>
          <p className="text-muted-foreground">Comprehensive data visualization and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="6months">
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
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Transaction Volume Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Transaction Volume Trend
                </CardTitle>
                <CardDescription>Monthly transaction volume and count</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={transactionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="volume" fill="#3b82f6" name="Volume (₹)" />
                    <Line yAxisId="right" type="monotone" dataKey="count" stroke="#ef4444" name="Count" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Distribution
                </CardTitle>
                <CardDescription>Current risk profile breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {riskDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Score Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Compliance Score Trend
              </CardTitle>
              <CardDescription>Monthly compliance performance vs target</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={complianceScoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="score" stackId="1" stroke="#10b981" fill="#10b981" name="Actual Score" />
                  <Area type="monotone" dataKey="target" stackId="2" stroke="#6b7280" fill="#6b7280" name="Target" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Transaction Volume by Type */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume by Type</CardTitle>
                <CardDescription>Breakdown of transaction types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { type: 'Deposit', volume: 1500000, count: 800 },
                    { type: 'Withdrawal', volume: 1200000, count: 600 },
                    { type: 'Transfer', volume: 800000, count: 400 },
                    { type: 'Payment', volume: 500000, count: 300 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="volume" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Transaction Risk Scatter */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Risk Analysis</CardTitle>
                <CardDescription>Amount vs Risk Score correlation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={[
                    { amount: 10000, risk: 20, type: 'Low' },
                    { amount: 50000, risk: 45, type: 'Medium' },
                    { amount: 100000, risk: 75, type: 'High' },
                    { amount: 200000, risk: 90, type: 'High' },
                    { amount: 5000, risk: 15, type: 'Low' },
                    { amount: 75000, risk: 60, type: 'Medium' }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="amount" name="Amount" />
                    <YAxis dataKey="risk" name="Risk Score" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter dataKey="risk" fill="#ef4444" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Client Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Client Growth
                </CardTitle>
                <CardDescription>New clients and total client base</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={clientGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="newClients" fill="#3b82f6" name="New Clients" />
                    <Line yAxisId="right" type="monotone" dataKey="totalClients" stroke="#10b981" name="Total Clients" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* KYC Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>KYC Status Distribution</CardTitle>
                <CardDescription>Current KYC completion status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Complete', value: 75, color: '#10b981' },
                        { name: 'Pending', value: 20, color: '#f59e0b' },
                        { name: 'Incomplete', value: 5, color: '#ef4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Complete', value: 75, color: '#10b981' },
                        { name: 'Pending', value: 20, color: '#f59e0b' },
                        { name: 'Incomplete', value: 5, color: '#ef4444' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Alert Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Alert Trends</CardTitle>
                <CardDescription>Alerts created vs resolved</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={alertTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="alerts" fill="#ef4444" name="Alerts Created" />
                    <Bar dataKey="resolved" fill="#10b981" name="Alerts Resolved" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Alert Severity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Alert Severity Distribution</CardTitle>
                <CardDescription>Current alert severity breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Low', value: 40, color: '#10b981' },
                        { name: 'Medium', value: 35, color: '#f59e0b' },
                        { name: 'High', value: 20, color: '#ef4444' },
                        { name: 'Critical', value: 5, color: '#dc2626' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Low', value: 40, color: '#10b981' },
                        { name: 'Medium', value: 35, color: '#f59e0b' },
                        { name: 'High', value: 20, color: '#ef4444' },
                        { name: 'Critical', value: 5, color: '#dc2626' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Performance Metrics Radar */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>System performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={performanceMetricsData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis />
                    <Radar
                      name="Actual"
                      dataKey="score"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Target"
                      dataKey="target"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* System Health Trend */}
            <Card>
              <CardHeader>
                <CardTitle>System Health Trend</CardTitle>
                <CardDescription>Daily system health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { day: 'Mon', health: 98, uptime: 99.9, performance: 95 },
                    { day: 'Tue', health: 99, uptime: 99.8, performance: 96 },
                    { day: 'Wed', health: 97, uptime: 99.7, performance: 94 },
                    { day: 'Thu', health: 99, uptime: 99.9, performance: 97 },
                    { day: 'Fri', health: 98, uptime: 99.8, performance: 95 },
                    { day: 'Sat', health: 100, uptime: 100, performance: 98 },
                    { day: 'Sun', health: 100, uptime: 100, performance: 99 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="health" stroke="#10b981" name="Health %" />
                    <Line type="monotone" dataKey="uptime" stroke="#3b82f6" name="Uptime %" />
                    <Line type="monotone" dataKey="performance" stroke="#f59e0b" name="Performance %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
