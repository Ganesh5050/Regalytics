import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Calendar,
  RefreshCw,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';

interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'table';
  data: any;
  config: any;
  visible: boolean;
  position: { x: number; y: number; w: number; h: number };
}

export function InteractiveDashboard() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { isConnected } = useWebSocket();
  const { isConnected: realTimeConnected } = useRealTimeUpdates();

  // Sample data
  const sampleData = {
    transactionVolume: [
      { month: 'Jan', volume: 2400000, count: 1200, risk: 15 },
      { month: 'Feb', volume: 2800000, count: 1350, risk: 18 },
      { month: 'Mar', volume: 3200000, count: 1500, risk: 22 },
      { month: 'Apr', volume: 2900000, count: 1400, risk: 19 },
      { month: 'May', volume: 3500000, count: 1650, risk: 25 },
      { month: 'Jun', volume: 3800000, count: 1800, risk: 28 }
    ],
    riskDistribution: [
      { name: 'Low Risk', value: 45, color: '#10b981' },
      { name: 'Medium Risk', value: 35, color: '#f59e0b' },
      { name: 'High Risk', value: 20, color: '#ef4444' }
    ],
    complianceScore: [
      { month: 'Jan', score: 85, target: 90 },
      { month: 'Feb', score: 88, target: 90 },
      { month: 'Mar', score: 92, target: 90 },
      { month: 'Apr', score: 89, target: 90 },
      { month: 'May', score: 94, target: 90 },
      { month: 'Jun', score: 96, target: 90 }
    ],
    clientGrowth: [
      { month: 'Jan', newClients: 45, totalClients: 1200 },
      { month: 'Feb', newClients: 52, totalClients: 1252 },
      { month: 'Mar', newClients: 48, totalClients: 1300 },
      { month: 'Apr', newClients: 61, totalClients: 1361 },
      { month: 'May', newClients: 55, totalClients: 1416 },
      { month: 'Jun', newClients: 67, totalClients: 1483 }
    ]
  };

  // Initialize widgets
  useEffect(() => {
    const initialWidgets: DashboardWidget[] = [
      {
        id: 'transaction-volume',
        title: 'Transaction Volume',
        type: 'chart',
        data: sampleData.transactionVolume,
        config: { chartType: 'composed', showVolume: true, showCount: true },
        visible: true,
        position: { x: 0, y: 0, w: 6, h: 4 }
      },
      {
        id: 'risk-distribution',
        title: 'Risk Distribution',
        type: 'chart',
        data: sampleData.riskDistribution,
        config: { chartType: 'pie' },
        visible: true,
        position: { x: 6, y: 0, w: 3, h: 4 }
      },
      {
        id: 'compliance-score',
        title: 'Compliance Score',
        type: 'chart',
        data: sampleData.complianceScore,
        config: { chartType: 'area', showTarget: true },
        visible: true,
        position: { x: 9, y: 0, w: 3, h: 4 }
      },
      {
        id: 'client-growth',
        title: 'Client Growth',
        type: 'chart',
        data: sampleData.clientGrowth,
        config: { chartType: 'composed', showNew: true, showTotal: true },
        visible: true,
        position: { x: 0, y: 4, w: 6, h: 4 }
      },
      {
        id: 'key-metrics',
        title: 'Key Metrics',
        type: 'metric',
        data: {
          totalTransactions: 10800,
          totalVolume: 18600000,
          averageRisk: 21.2,
          complianceScore: 96
        },
        config: { layout: 'grid' },
        visible: true,
        position: { x: 6, y: 4, w: 6, h: 4 }
      }
    ];
    
    setWidgets(initialWidgets);
  }, []);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRange(value);
    // In a real app, this would trigger data refetch
    handleRefresh();
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, visible: !widget.visible }
        : widget
    ));
  };

  const renderChart = (widget: DashboardWidget) => {
    const { data, config } = widget;
    
    switch (config.chartType) {
      case 'composed':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              {config.showVolume && (
                <Bar yAxisId="left" dataKey="volume" fill="#3b82f6" name="Volume (₹)" />
              )}
              {config.showCount && (
                <Line yAxisId="right" type="monotone" dataKey="count" stroke="#ef4444" name="Count" />
              )}
              {config.showNew && (
                <Bar yAxisId="left" dataKey="newClients" fill="#3b82f6" name="New Clients" />
              )}
              {config.showTotal && (
                <Line yAxisId="right" type="monotone" dataKey="totalClients" stroke="#10b981" name="Total Clients" />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="score" stackId="1" stroke="#10b981" fill="#10b981" name="Actual Score" />
              {config.showTarget && (
                <Area type="monotone" dataKey="target" stackId="2" stroke="#6b7280" fill="#6b7280" name="Target" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  const renderMetric = (widget: DashboardWidget) => {
    const { data } = widget;
    
    return (
      <div className="grid grid-cols-2 gap-4 h-full">
        <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
          <DollarSign className="h-8 w-8 text-blue-600 mb-2" />
          <div className="text-2xl font-bold text-blue-900">
            {data.totalVolume.toLocaleString()}
          </div>
          <div className="text-sm text-blue-600">Total Volume (₹)</div>
        </div>
        
        <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
          <Activity className="h-8 w-8 text-green-600 mb-2" />
          <div className="text-2xl font-bold text-green-900">
            {data.totalTransactions.toLocaleString()}
          </div>
          <div className="text-sm text-green-600">Total Transactions</div>
        </div>
        
        <div className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg">
          <AlertTriangle className="h-8 w-8 text-yellow-600 mb-2" />
          <div className="text-2xl font-bold text-yellow-900">
            {data.averageRisk}%
          </div>
          <div className="text-sm text-yellow-600">Average Risk</div>
        </div>
        
        <div className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg">
          <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
          <div className="text-2xl font-bold text-purple-900">
            {data.complianceScore}%
          </div>
          <div className="text-sm text-purple-600">Compliance Score</div>
        </div>
      </div>
    );
  };

  const renderWidget = (widget: DashboardWidget) => {
    if (!widget.visible) return null;

    return (
      <Card key={widget.id} className="h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{widget.title}</CardTitle>
              <CardDescription>
                {isConnected && realTimeConnected && (
                  <Badge variant="outline" className="text-xs">
                    <Activity className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                )}
              </CardDescription>
            </div>
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleWidgetVisibility(widget.id)}
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="h-full">
          {widget.type === 'chart' && renderChart(widget)}
          {widget.type === 'metric' && renderMetric(widget)}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Interactive Dashboard</h2>
          <p className="text-muted-foreground">Real-time analytics and customizable widgets</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedTimeRange} onValueChange={handleTimeRangeChange}>
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
          
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button 
            variant={isEditing ? "default" : "outline"} 
            size="sm" 
            onClick={() => setIsEditing(!isEditing)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {isEditing ? 'Done' : 'Edit'}
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 auto-rows-fr">
        {widgets.map(widget => (
          <div
            key={widget.id}
            className={`col-span-${widget.position.w} row-span-${widget.position.h}`}
            style={{
              gridColumn: `span ${widget.position.w}`,
              gridRow: `span ${widget.position.h}`
            }}
          >
            {renderWidget(widget)}
          </div>
        ))}
      </div>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Widget Settings</CardTitle>
            <CardDescription>Customize your dashboard widgets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {widgets.map(widget => (
                <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {widget.visible ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-sm font-medium">{widget.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleWidgetVisibility(widget.id)}
                  >
                    {widget.visible ? 'Hide' : 'Show'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
