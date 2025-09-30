import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts';
import { 
  Search,
  Filter,
  Download,
  Upload,
  Database,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  type: 'api' | 'file' | 'database';
  url?: string;
  description: string;
  lastUpdated: string;
  recordCount: number;
  status: 'active' | 'inactive' | 'error';
}

interface Query {
  id: string;
  name: string;
  sql: string;
  parameters: { [key: string]: any };
  lastRun: string;
  resultCount: number;
  executionTime: number;
}

export function DataExplorer() {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [selectedDataSource, setSelectedDataSource] = useState<string>('');
  const [selectedQuery, setSelectedQuery] = useState<string>('');
  const [queryResult, setQueryResult] = useState<any[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  const [activeTab, setActiveTab] = useState('sources');

  // Sample data sources
  useEffect(() => {
    const sampleDataSources: DataSource[] = [
      {
        id: '1',
        name: 'Transactions API',
        type: 'api',
        url: '/api/transactions',
        description: 'Real-time transaction data',
        lastUpdated: '2024-01-15T10:30:00Z',
        recordCount: 15000,
        status: 'active'
      },
      {
        id: '2',
        name: 'Clients Database',
        type: 'database',
        description: 'Client information and KYC data',
        lastUpdated: '2024-01-15T09:15:00Z',
        recordCount: 2500,
        status: 'active'
      },
      {
        id: '3',
        name: 'Alerts Stream',
        type: 'api',
        url: '/api/alerts',
        description: 'Real-time alert notifications',
        lastUpdated: '2024-01-15T10:45:00Z',
        recordCount: 500,
        status: 'active'
      },
      {
        id: '4',
        name: 'Historical Data',
        type: 'file',
        description: 'Archived transaction data',
        lastUpdated: '2024-01-14T23:59:00Z',
        recordCount: 100000,
        status: 'active'
      }
    ];

    const sampleQueries: Query[] = [
      {
        id: '1',
        name: 'High Risk Transactions',
        sql: 'SELECT * FROM transactions WHERE risk_score > 80 ORDER BY created_at DESC',
        parameters: {},
        lastRun: '2024-01-15T10:30:00Z',
        resultCount: 150,
        executionTime: 0.5
      },
      {
        id: '2',
        name: 'Client KYC Status',
        sql: 'SELECT client_id, name, kyc_status, risk_score FROM clients WHERE kyc_status != "Complete"',
        parameters: {},
        lastRun: '2024-01-15T09:45:00Z',
        resultCount: 75,
        executionTime: 0.3
      },
      {
        id: '3',
        name: 'Monthly Transaction Volume',
        sql: 'SELECT DATE_TRUNC("month", created_at) as month, SUM(amount) as volume, COUNT(*) as count FROM transactions GROUP BY month ORDER BY month',
        parameters: {},
        lastRun: '2024-01-15T08:20:00Z',
        resultCount: 12,
        executionTime: 1.2
      }
    ];

    setDataSources(sampleDataSources);
    setQueries(sampleQueries);
  }, []);

  const executeQuery = async (queryId: string) => {
    setIsExecuting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const query = queries.find(q => q.id === queryId);
    if (query) {
      // Sample result data based on query
      let sampleResult: any[] = [];
      
      if (query.name === 'High Risk Transactions') {
        sampleResult = [
          { id: 'TXN001', amount: 150000, risk_score: 85, client_name: 'ABC Corp', created_at: '2024-01-15T10:30:00Z' },
          { id: 'TXN002', amount: 200000, risk_score: 92, client_name: 'XYZ Ltd', created_at: '2024-01-15T09:45:00Z' },
          { id: 'TXN003', amount: 75000, risk_score: 88, client_name: 'DEF Inc', created_at: '2024-01-15T08:20:00Z' }
        ];
      } else if (query.name === 'Client KYC Status') {
        sampleResult = [
          { client_id: 'CLI001', name: 'ABC Corp', kyc_status: 'Pending', risk_score: 75 },
          { client_id: 'CLI002', name: 'XYZ Ltd', kyc_status: 'Incomplete', risk_score: 85 },
          { client_id: 'CLI003', name: 'DEF Inc', kyc_status: 'Pending', risk_score: 65 }
        ];
      } else if (query.name === 'Monthly Transaction Volume') {
        sampleResult = [
          { month: '2024-01-01', volume: 2400000, count: 1200 },
          { month: '2024-02-01', volume: 2800000, count: 1350 },
          { month: '2024-03-01', volume: 3200000, count: 1500 },
          { month: '2024-04-01', volume: 2900000, count: 1400 },
          { month: '2024-05-01', volume: 3500000, count: 1650 },
          { month: '2024-06-01', volume: 3800000, count: 1800 }
        ];
      }
      
      setQueryResult(sampleResult);
    }
    
    setIsExecuting(false);
  };

  const executeCustomQuery = async () => {
    if (!customQuery.trim()) return;
    
    setIsExecuting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Sample result for custom query
    const sampleResult = [
      { id: 1, name: 'Sample Result 1', value: 100 },
      { id: 2, name: 'Sample Result 2', value: 200 },
      { id: 3, name: 'Sample Result 3', value: 300 }
    ];
    
    setQueryResult(sampleResult);
    setIsExecuting(false);
  };

  const renderChart = (data: any[]) => {
    if (data.length === 0) return null;

    const firstRow = data[0];
    const numericColumns = Object.keys(firstRow).filter(key => 
      typeof firstRow[key] === 'number' && key !== 'id'
    );

    if (numericColumns.length === 0) return null;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={Object.keys(firstRow)[0]} />
          <YAxis />
          <Tooltip />
          <Legend />
          {numericColumns.map((column, index) => (
            <Bar 
              key={column} 
              dataKey={column} 
              fill={`hsl(${index * 60}, 70%, 50%)`} 
              name={column.replace(/_/g, ' ').toUpperCase()}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Data Explorer</h2>
          <p className="text-muted-foreground">Explore and analyze your data with custom queries</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="queries">Saved Queries</TabsTrigger>
          <TabsTrigger value="custom">Custom Query</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataSources.map(source => (
              <Card key={source.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{source.name}</CardTitle>
                    <Badge variant={source.status === 'active' ? 'default' : 'secondary'}>
                      {source.status}
                    </Badge>
                  </div>
                  <CardDescription>{source.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{source.type.toUpperCase()}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {source.recordCount.toLocaleString()} records
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Last updated: {new Date(source.lastUpdated).toLocaleString()}
                    </div>
                    {source.url && (
                      <div className="text-sm text-muted-foreground">
                        URL: {source.url}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="queries" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {queries.map(query => (
              <Card key={query.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{query.name}</CardTitle>
                    <Button
                      size="sm"
                      onClick={() => executeQuery(query.id)}
                      disabled={isExecuting}
                    >
                      {isExecuting ? (
                        <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4 mr-2" />
                      )}
                      Execute
                    </Button>
                  </div>
                  <CardDescription>
                    Last run: {new Date(query.lastRun).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">SQL Query</Label>
                      <Textarea
                        value={query.sql}
                        readOnly
                        className="mt-1 font-mono text-sm"
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Results: {query.resultCount}</span>
                      <span>Time: {query.executionTime}s</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom SQL Query</CardTitle>
              <CardDescription>Write and execute custom SQL queries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="custom-query">SQL Query</Label>
                <Textarea
                  id="custom-query"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="SELECT * FROM transactions WHERE risk_score > 80;"
                  className="mt-1 font-mono"
                  rows={6}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={executeCustomQuery}
                  disabled={isExecuting || !customQuery.trim()}
                >
                  {isExecuting ? (
                    <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Execute Query
                </Button>
                <Button variant="outline" onClick={() => setCustomQuery('')}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {queryResult.length > 0 ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Query Results</CardTitle>
                  <CardDescription>
                    {queryResult.length} rows returned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Chart Visualization */}
                    {renderChart(queryResult)}
                    
                    {/* Table View */}
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {Object.keys(queryResult[0]).map(key => (
                              <TableHead key={key}>
                                {key.replace(/_/g, ' ').toUpperCase()}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {queryResult.slice(0, 100).map((row, index) => (
                            <TableRow key={index}>
                              {Object.values(row).map((value, cellIndex) => (
                                <TableCell key={cellIndex}>
                                  {typeof value === 'string' && value.includes('T') 
                                    ? new Date(value).toLocaleString()
                                    : String(value)
                                  }
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {queryResult.length > 100 && (
                      <div className="text-center text-sm text-muted-foreground">
                        Showing first 100 rows of {queryResult.length} total results
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Database className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Results</h3>
                <p className="text-muted-foreground text-center">
                  Execute a query to see results here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
