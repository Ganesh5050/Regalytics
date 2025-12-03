import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus,
  Trash2,
  Save,
  Play,
  Download,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Filter,
  Eye,
  Edit,
  Copy
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'Compliance' | 'Risk' | 'Transaction' | 'Client' | 'Custom';
  category: string;
  format: 'PDF' | 'Excel' | 'CSV' | 'JSON';
  parameters: {
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';
    required: boolean;
    defaultValue?: any;
    options?: string[];
    label: string;
    description?: string;
  }[];
  filters: {
    name: string;
    type: 'dateRange' | 'select' | 'multiselect' | 'text' | 'number';
    required: boolean;
    options?: string[];
    label: string;
    description?: string;
  }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ReportBuilder {
  id: string;
  name: string;
  description: string;
  type: string;
  format: string;
  template?: string;
  parameters: { [key: string]: any };
  filters: { [key: string]: any };
  schedule?: {
    frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
    time: string;
    timezone: string;
    recipients: string[];
    enabled: boolean;
  };
  charts: {
    id: string;
    type: 'bar' | 'line' | 'pie' | 'area' | 'scatter';
    title: string;
    dataSource: string;
    xAxis: string;
    yAxis: string;
    groupBy?: string;
    filters?: { [key: string]: any };
  }[];
  tables: {
    id: string;
    title: string;
    dataSource: string;
    columns: string[];
    filters?: { [key: string]: any };
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }[];
}

export function AdvancedReportBuilder() {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [reportBuilder, setReportBuilder] = useState<ReportBuilder>({
    id: '',
    name: '',
    description: '',
    type: 'Compliance',
    format: 'PDF',
    parameters: {},
    filters: {},
    charts: [],
    tables: []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');
  
  const { addNotification } = useNotifications();

  // Sample templates
  useEffect(() => {
    const sampleTemplates: ReportTemplate[] = [
      {
        id: '1',
        name: 'Monthly Compliance Report',
        description: 'Comprehensive compliance overview with KYC status and risk assessment',
        type: 'Compliance',
        category: 'Standard',
        format: 'PDF',
        parameters: [
          {
            name: 'month',
            type: 'select',
            required: true,
            options: ['January', 'February', 'March', 'April', 'May', 'June'],
            label: 'Report Month',
            description: 'Select the month for the report'
          },
          {
            name: 'includeCharts',
            type: 'boolean',
            required: false,
            defaultValue: true,
            label: 'Include Charts',
            description: 'Add visual charts to the report'
          }
        ],
        filters: [
          {
            name: 'dateRange',
            type: 'dateRange',
            required: true,
            label: 'Date Range',
            description: 'Select the date range for the report'
          },
          {
            name: 'riskLevel',
            type: 'multiselect',
            required: false,
            options: ['Low', 'Medium', 'High'],
            label: 'Risk Level',
            description: 'Filter by risk level'
          }
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        name: 'Transaction Analysis Report',
        description: 'Detailed transaction analysis with volume trends and risk patterns',
        type: 'Transaction',
        category: 'Analytics',
        format: 'Excel',
        parameters: [
          {
            name: 'analysisType',
            type: 'select',
            required: true,
            options: ['Volume', 'Risk', 'Pattern', 'Comprehensive'],
            label: 'Analysis Type',
            description: 'Type of analysis to perform'
          }
        ],
        filters: [
          {
            name: 'dateRange',
            type: 'dateRange',
            required: true,
            label: 'Date Range',
            description: 'Select the date range for analysis'
          },
          {
            name: 'transactionType',
            type: 'multiselect',
            required: false,
            options: ['Deposit', 'Withdrawal', 'Transfer', 'Payment'],
            label: 'Transaction Type',
            description: 'Filter by transaction type'
          }
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      }
    ];

    setTemplates(sampleTemplates);
  }, []);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setReportBuilder({
        id: '',
        name: template.name,
        description: template.description,
        type: template.type,
        format: template.format,
        template: templateId,
        parameters: {},
        filters: {},
        charts: [],
        tables: []
      });
    }
  };

  const handleParameterChange = (paramName: string, value: any) => {
    setReportBuilder(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [paramName]: value
      }
    }));
  };

  const handleFilterChange = (filterName: string, value: any) => {
    setReportBuilder(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterName]: value
      }
    }));
  };

  const addChart = () => {
    const newChart = {
      id: `chart_${Date.now()}`,
      type: 'bar' as const,
      title: 'New Chart',
      dataSource: 'transactions',
      xAxis: 'date',
      yAxis: 'amount',
      groupBy: undefined,
      filters: {}
    };

    setReportBuilder(prev => ({
      ...prev,
      charts: [...prev.charts, newChart]
    }));
  };

  const updateChart = (chartId: string, updates: Partial<ReportBuilder['charts'][0]>) => {
    setReportBuilder(prev => ({
      ...prev,
      charts: prev.charts.map(chart => 
        chart.id === chartId ? { ...chart, ...updates } : chart
      )
    }));
  };

  const removeChart = (chartId: string) => {
    setReportBuilder(prev => ({
      ...prev,
      charts: prev.charts.filter(chart => chart.id !== chartId)
    }));
  };

  const addTable = () => {
    const newTable = {
      id: `table_${Date.now()}`,
      title: 'New Table',
      dataSource: 'transactions',
      columns: ['id', 'amount', 'date'],
      filters: {},
      sortBy: undefined,
      sortOrder: undefined
    };

    setReportBuilder(prev => ({
      ...prev,
      tables: [...prev.tables, newTable]
    }));
  };

  const updateTable = (tableId: string, updates: Partial<ReportBuilder['tables'][0]>) => {
    setReportBuilder(prev => ({
      ...prev,
      tables: prev.tables.map(table => 
        table.id === tableId ? { ...table, ...updates } : table
      )
    }));
  };

  const removeTable = (tableId: string) => {
    setReportBuilder(prev => ({
      ...prev,
      tables: prev.tables.filter(table => table.id !== tableId)
    }));
  };

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    addNotification({
      type: 'success',
      title: 'Report Generated',
      message: `Report "${reportBuilder.name}" has been generated successfully`
    });
    
    setIsGenerating(false);
  };

  const saveReport = () => {
    addNotification({
      type: 'success',
      title: 'Report Saved',
      message: 'Report configuration has been saved'
    });
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Report Builder</h2>
          <p className="text-muted-foreground">Create custom reports with advanced analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={saveReport}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button onClick={generateReport} disabled={isGenerating}>
            {isGenerating ? (
              <Play className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(template => (
              <Card 
                key={template.id} 
                className={`cursor-pointer transition-colors ${
                  selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="outline">{template.type}</Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Format:</span>
                      <Badge variant="secondary">{template.format}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Parameters:</span>
                      <span className="text-sm">{template.parameters.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Filters:</span>
                      <span className="text-sm">{template.filters.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-4">
          {selectedTemplateData ? (
            <Card>
              <CardHeader>
                <CardTitle>Report Parameters</CardTitle>
                <CardDescription>Configure parameters for {selectedTemplateData.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTemplateData.parameters.map(param => (
                  <div key={param.name} className="space-y-2">
                    <Label htmlFor={param.name}>
                      {param.label}
                      {param.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {param.description && (
                      <p className="text-sm text-muted-foreground">{param.description}</p>
                    )}
                    
                    {param.type === 'select' && (
                      <Select
                        value={reportBuilder.parameters[param.name] || ''}
                        onValueChange={(value) => handleParameterChange(param.name, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${param.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {param.options?.map(option => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    
                    {param.type === 'multiselect' && (
                      <div className="space-y-2">
                        {param.options?.map(option => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${param.name}_${option}`}
                              checked={reportBuilder.parameters[param.name]?.includes(option) || false}
                              onCheckedChange={(checked) => {
                                const current = reportBuilder.parameters[param.name] || [];
                                const updated = checked 
                                  ? [...current, option]
                                  : current.filter((item: string) => item !== option);
                                handleParameterChange(param.name, updated);
                              }}
                            />
                            <Label htmlFor={`${param.name}_${option}`}>{option}</Label>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {param.type === 'boolean' && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={param.name}
                          checked={reportBuilder.parameters[param.name] || param.defaultValue || false}
                          onCheckedChange={(checked) => handleParameterChange(param.name, checked)}
                        />
                        <Label htmlFor={param.name}>Enable {param.label}</Label>
                      </div>
                    )}
                    
                    {param.type === 'string' && (
                      <Input
                        id={param.name}
                        value={reportBuilder.parameters[param.name] || ''}
                        onChange={(e) => handleParameterChange(param.name, e.target.value)}
                        placeholder={`Enter ${param.label}`}
                      />
                    )}
                    
                    {param.type === 'number' && (
                      <Input
                        id={param.name}
                        type="number"
                        value={reportBuilder.parameters[param.name] || ''}
                        onChange={(e) => handleParameterChange(param.name, Number(e.target.value))}
                        placeholder={`Enter ${param.label}`}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Template Selected</h3>
                <p className="text-muted-foreground text-center">
                  Select a template from the Templates tab to configure parameters
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="filters" className="space-y-4">
          {selectedTemplateData ? (
            <Card>
              <CardHeader>
                <CardTitle>Report Filters</CardTitle>
                <CardDescription>Configure filters for {selectedTemplateData.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTemplateData.filters.map(filter => (
                  <div key={filter.name} className="space-y-2">
                    <Label htmlFor={filter.name}>
                      {filter.label}
                      {filter.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {filter.description && (
                      <p className="text-sm text-muted-foreground">{filter.description}</p>
                    )}
                    
                    {filter.type === 'dateRange' && (
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={reportBuilder.filters[filter.name]?.from || ''}
                          onChange={(e) => handleFilterChange(filter.name, {
                            ...reportBuilder.filters[filter.name],
                            from: e.target.value
                          })}
                          placeholder="From Date"
                        />
                        <Input
                          type="date"
                          value={reportBuilder.filters[filter.name]?.to || ''}
                          onChange={(e) => handleFilterChange(filter.name, {
                            ...reportBuilder.filters[filter.name],
                            to: e.target.value
                          })}
                          placeholder="To Date"
                        />
                      </div>
                    )}
                    
                    {filter.type === 'select' && (
                      <Select
                        value={reportBuilder.filters[filter.name] || ''}
                        onValueChange={(value) => handleFilterChange(filter.name, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${filter.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {filter.options?.map(option => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    
                    {filter.type === 'multiselect' && (
                      <div className="space-y-2">
                        {filter.options?.map(option => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${filter.name}_${option}`}
                              checked={reportBuilder.filters[filter.name]?.includes(option) || false}
                              onCheckedChange={(checked) => {
                                const current = reportBuilder.filters[filter.name] || [];
                                const updated = checked 
                                  ? [...current, option]
                                  : current.filter((item: string) => item !== option);
                                handleFilterChange(filter.name, updated);
                              }}
                            />
                            <Label htmlFor={`${filter.name}_${option}`}>{option}</Label>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {filter.type === 'text' && (
                      <Input
                        value={reportBuilder.filters[filter.name] || ''}
                        onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                        placeholder={`Enter ${filter.label}`}
                      />
                    )}
                    
                    {filter.type === 'number' && (
                      <Input
                        type="number"
                        value={reportBuilder.filters[filter.name] || ''}
                        onChange={(e) => handleFilterChange(filter.name, Number(e.target.value))}
                        placeholder={`Enter ${filter.label}`}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Filter className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Template Selected</h3>
                <p className="text-muted-foreground text-center">
                  Select a template from the Templates tab to configure filters
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Charts</h3>
              <p className="text-sm text-muted-foreground">Add visual charts to your report</p>
            </div>
            <Button onClick={addChart}>
              <Plus className="h-4 w-4 mr-2" />
              Add Chart
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportBuilder.charts.map(chart => (
              <Card key={chart.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{chart.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => removeChart(chart.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Type</Label>
                      <Select
                        value={chart.type}
                        onValueChange={(value) => updateChart(chart.id, { type: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bar">Bar Chart</SelectItem>
                          <SelectItem value="line">Line Chart</SelectItem>
                          <SelectItem value="pie">Pie Chart</SelectItem>
                          <SelectItem value="area">Area Chart</SelectItem>
                          <SelectItem value="scatter">Scatter Plot</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Data Source</Label>
                      <Select
                        value={chart.dataSource}
                        onValueChange={(value) => updateChart(chart.id, { dataSource: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transactions">Transactions</SelectItem>
                          <SelectItem value="clients">Clients</SelectItem>
                          <SelectItem value="alerts">Alerts</SelectItem>
                          <SelectItem value="reports">Reports</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">X-Axis</Label>
                      <Input
                        value={chart.xAxis}
                        onChange={(e) => updateChart(chart.id, { xAxis: e.target.value })}
                        placeholder="X-Axis field"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Y-Axis</Label>
                      <Input
                        value={chart.yAxis}
                        onChange={(e) => updateChart(chart.id, { yAxis: e.target.value })}
                        placeholder="Y-Axis field"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Tables</h3>
              <p className="text-sm text-muted-foreground">Add data tables to your report</p>
            </div>
            <Button onClick={addTable}>
              <Plus className="h-4 w-4 mr-2" />
              Add Table
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {reportBuilder.tables.map(table => (
              <Card key={table.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{table.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => removeTable(table.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Data Source</Label>
                      <Select
                        value={table.dataSource}
                        onValueChange={(value) => updateTable(table.id, { dataSource: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transactions">Transactions</SelectItem>
                          <SelectItem value="clients">Clients</SelectItem>
                          <SelectItem value="alerts">Alerts</SelectItem>
                          <SelectItem value="reports">Reports</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Sort By</Label>
                      <Input
                        value={table.sortBy || ''}
                        onChange={(e) => updateTable(table.id, { sortBy: e.target.value })}
                        placeholder="Sort field"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Columns (comma-separated)</Label>
                    <Input
                      value={table.columns.join(', ')}
                      onChange={(e) => updateTable(table.id, { 
                        columns: e.target.value.split(',').map(col => col.trim()).filter(Boolean)
                      })}
                      placeholder="id, name, amount, date"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Scheduling</CardTitle>
              <CardDescription>Schedule automatic report generation and delivery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableSchedule"
                  checked={reportBuilder.schedule?.enabled || false}
                  onCheckedChange={(checked) => setReportBuilder(prev => ({
                    ...prev,
                    schedule: {
                      ...prev.schedule,
                      frequency: 'Daily',
                      time: '09:00',
                      timezone: 'UTC',
                      recipients: [],
                      enabled: checked as boolean
                    }
                  }))}
                />
                <Label htmlFor="enableSchedule">Enable scheduled reports</Label>
              </div>

              {reportBuilder.schedule?.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Frequency</Label>
                    <Select
                      value={reportBuilder.schedule?.frequency || 'Daily'}
                      onValueChange={(value) => setReportBuilder(prev => ({
                        ...prev,
                        schedule: {
                          ...prev.schedule!,
                          frequency: value as any
                        }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                        <SelectItem value="Yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={reportBuilder.schedule?.time || '09:00'}
                      onChange={(e) => setReportBuilder(prev => ({
                        ...prev,
                        schedule: {
                          ...prev.schedule!,
                          time: e.target.value
                        }
                      }))}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
