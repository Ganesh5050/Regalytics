import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Calendar,
  DollarSign,
  LineChart
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

interface Prediction {
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  timeframe: string;
}

interface ForecastData {
  date: string;
  actual?: number;
  predicted: number;
  upperBound: number;
  lowerBound: number;
}

const mockPredictions: Prediction[] = [
  {
    metric: 'Transaction Volume',
    current: 1250,
    predicted: 1420,
    confidence: 87,
    trend: 'up',
    timeframe: 'Next 30 days'
  },
  {
    metric: 'Risk Score',
    current: 65,
    predicted: 58,
    confidence: 92,
    trend: 'down',
    timeframe: 'Next 7 days'
  },
  {
    metric: 'Compliance Issues',
    current: 3,
    predicted: 2,
    confidence: 78,
    trend: 'down',
    timeframe: 'Next 14 days'
  },
  {
    metric: 'Customer Satisfaction',
    current: 4.2,
    predicted: 4.5,
    confidence: 85,
    trend: 'up',
    timeframe: 'Next 30 days'
  }
];

const mockForecastData: ForecastData[] = [
  { date: '2024-01-01', actual: 1200, predicted: 1180, upperBound: 1300, lowerBound: 1060 },
  { date: '2024-01-02', actual: 1350, predicted: 1220, upperBound: 1340, lowerBound: 1100 },
  { date: '2024-01-03', actual: 1100, predicted: 1260, upperBound: 1380, lowerBound: 1140 },
  { date: '2024-01-04', actual: 1600, predicted: 1300, upperBound: 1420, lowerBound: 1180 },
  { date: '2024-01-05', actual: 1450, predicted: 1340, upperBound: 1460, lowerBound: 1220 },
  { date: '2024-01-06', actual: 1800, predicted: 1380, upperBound: 1500, lowerBound: 1260 },
  { date: '2024-01-07', actual: 1700, predicted: 1420, upperBound: 1540, lowerBound: 1300 },
  { date: '2024-01-08', predicted: 1460, upperBound: 1580, lowerBound: 1340 },
  { date: '2024-01-09', predicted: 1500, upperBound: 1620, lowerBound: 1380 },
  { date: '2024-01-10', predicted: 1540, upperBound: 1660, lowerBound: 1420 }
];

const riskDistributionData = [
  { name: 'Low Risk', value: 45, color: '#10b981' },
  { name: 'Medium Risk', value: 30, color: '#f59e0b' },
  { name: 'High Risk', value: 20, color: '#f97316' },
  { name: 'Critical Risk', value: 5, color: '#ef4444' }
];

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
    default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
  }
};

const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'up': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
    case 'down': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
    default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
  }
};

export function PredictiveAnalytics() {
  const [predictions, setPredictions] = useState<Prediction[]>(mockPredictions);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>('Transaction Volume');

  const runPrediction = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI prediction
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Update predictions with new data
    const newPredictions = mockPredictions.map(prediction => ({
      ...prediction,
      predicted: prediction.predicted + (Math.random() - 0.5) * 100,
      confidence: Math.max(70, Math.min(95, prediction.confidence + (Math.random() - 0.5) * 10))
    }));
    
    setPredictions(newPredictions);
    setIsAnalyzing(false);
  };

  const formatValue = (value: number, metric: string) => {
    if (metric.includes('Volume')) return `${value.toLocaleString()}`;
    if (metric.includes('Score')) return value.toFixed(1);
    if (metric.includes('Issues')) return value.toString();
    if (metric.includes('Satisfaction')) return value.toFixed(1);
    return value.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Predictive Analytics
              </CardTitle>
              <CardDescription>
                AI-powered forecasting and trend analysis
              </CardDescription>
            </div>
            <Button 
              onClick={runPrediction} 
              disabled={isAnalyzing}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Run Prediction
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {predictions.map((prediction, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {prediction.metric}
                </CardTitle>
                {getTrendIcon(prediction.trend)}
              </div>
              <CardDescription className="text-xs">
                {prediction.timeframe}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {formatValue(prediction.predicted, prediction.metric)}
                  </div>
                  <Badge className={getTrendColor(prediction.trend)}>
                    {prediction.trend}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Current: {formatValue(prediction.current, prediction.metric)}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Confidence</span>
                    <span>{prediction.confidence}%</span>
                  </div>
                  <Progress value={prediction.confidence} className="h-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Transaction Volume Forecast
          </CardTitle>
          <CardDescription>
            Predicted vs actual transaction volume with confidence intervals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RechartsLineChart data={mockForecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                name="Actual"
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#82ca9d" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                name="Predicted"
              />
              <Line 
                type="monotone" 
                dataKey="upperBound" 
                stroke="#ffc658" 
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
                name="Upper Bound"
              />
              <Line 
                type="monotone" 
                dataKey="lowerBound" 
                stroke="#ffc658" 
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
                name="Lower Bound"
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Risk Distribution Forecast
            </CardTitle>
            <CardDescription>
              Predicted risk level distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Key Insights
            </CardTitle>
            <CardDescription>
              AI-generated insights and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900 dark:text-blue-100">
                    Growth Opportunity
                  </span>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Transaction volume is predicted to increase by 13.6% in the next 30 days.
                </p>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-900 dark:text-green-100">
                    Risk Reduction
                  </span>
                </div>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Risk scores are trending downward, indicating improved compliance.
                </p>
              </div>

              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-900 dark:text-yellow-100">
                    Attention Required
                  </span>
                </div>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Monitor high-risk transactions closely in the coming weeks.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Model Performance
          </CardTitle>
          <CardDescription>
            Accuracy and performance metrics for predictive models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">94.2%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
              <Progress value={94.2} className="h-2 mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">87.5%</div>
              <div className="text-sm text-muted-foreground">Precision</div>
              <Progress value={87.5} className="h-2 mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">91.8%</div>
              <div className="text-sm text-muted-foreground">Recall</div>
              <Progress value={91.8} className="h-2 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
