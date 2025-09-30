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
  CheckCircle, 
  Clock,
  Target,
  BarChart3,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface RiskFactor {
  name: string;
  score: number;
  weight: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface RiskAssessment {
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: RiskFactor[];
  recommendations: string[];
  confidence: number;
  lastUpdated: string;
}

const mockRiskFactors: RiskFactor[] = [
  {
    name: 'Transaction Volume',
    score: 75,
    weight: 0.3,
    trend: 'up',
    description: 'Unusual spike in transaction volume detected'
  },
  {
    name: 'Geographic Risk',
    score: 45,
    weight: 0.2,
    trend: 'stable',
    description: 'Transactions from medium-risk countries'
  },
  {
    name: 'Customer Behavior',
    score: 60,
    weight: 0.25,
    trend: 'up',
    description: 'Deviations from normal spending patterns'
  },
  {
    name: 'Compliance History',
    score: 30,
    weight: 0.15,
    trend: 'down',
    description: 'Good compliance track record'
  },
  {
    name: 'External Data',
    score: 80,
    weight: 0.1,
    trend: 'up',
    description: 'Negative news and sanctions data'
  }
];

const mockHistoricalData = [
  { date: '2024-01-01', score: 45, volume: 1200 },
  { date: '2024-01-02', score: 52, volume: 1350 },
  { date: '2024-01-03', score: 48, volume: 1100 },
  { date: '2024-01-04', score: 61, volume: 1600 },
  { date: '2024-01-05', score: 58, volume: 1450 },
  { date: '2024-01-06', score: 65, volume: 1800 },
  { date: '2024-01-07', score: 62, volume: 1700 }
];

const getRiskLevel = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
  if (score < 30) return 'low';
  if (score < 60) return 'medium';
  if (score < 80) return 'high';
  return 'critical';
};

const getRiskColor = (level: string) => {
  switch (level) {
    case 'low': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
    case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
    case 'high': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900';
    case 'critical': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
    default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
    case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
    default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
  }
};

export function AIRiskScoring() {
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFactor, setSelectedFactor] = useState<RiskFactor | null>(null);

  useEffect(() => {
    // Simulate initial risk assessment
    const overallScore = Math.round(
      mockRiskFactors.reduce((sum, factor) => sum + (factor.score * factor.weight), 0)
    );
    
    setAssessment({
      overallScore,
      riskLevel: getRiskLevel(overallScore),
      factors: mockRiskFactors,
      recommendations: [
        'Monitor transaction patterns closely',
        'Consider enhanced due diligence',
        'Review customer documentation',
        'Implement additional controls'
      ],
      confidence: 87,
      lastUpdated: new Date().toISOString()
    });
  }, []);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update with new analysis
    const newFactors = mockRiskFactors.map(factor => ({
      ...factor,
      score: Math.max(0, Math.min(100, factor.score + (Math.random() - 0.5) * 20))
    }));
    
    const overallScore = Math.round(
      newFactors.reduce((sum, factor) => sum + (factor.score * factor.weight), 0)
    );
    
    setAssessment({
      overallScore,
      riskLevel: getRiskLevel(overallScore),
      factors: newFactors,
      recommendations: [
        'Monitor transaction patterns closely',
        'Consider enhanced due diligence',
        'Review customer documentation',
        'Implement additional controls'
      ],
      confidence: 87,
      lastUpdated: new Date().toISOString()
    });
    
    setIsAnalyzing(false);
  };

  if (!assessment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Risk Scoring
          </CardTitle>
          <CardDescription>
            Loading risk assessment...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Risk Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Risk Assessment
              </CardTitle>
              <CardDescription>
                Real-time risk scoring powered by machine learning
              </CardDescription>
            </div>
            <Button 
              onClick={runAnalysis} 
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
                  Run Analysis
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{assessment.overallScore}</div>
              <Badge className={getRiskColor(assessment.riskLevel)}>
                {assessment.riskLevel.toUpperCase()} RISK
              </Badge>
              <div className="mt-4">
                <Progress value={assessment.overallScore} className="h-2" />
              </div>
            </div>

            {/* Confidence */}
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">{assessment.confidence}%</div>
              <div className="text-sm text-muted-foreground">Confidence</div>
              <div className="mt-4">
                <Progress value={assessment.confidence} className="h-2" />
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                <Clock className="h-6 w-6 mx-auto" />
              </div>
              <div className="text-sm text-muted-foreground">Last Updated</div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(assessment.lastUpdated).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Risk Factors
          </CardTitle>
          <CardDescription>
            Individual risk components and their impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessment.factors.map((factor, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => setSelectedFactor(factor)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{factor.name}</span>
                    {getTrendIcon(factor.trend)}
                    <Badge variant="outline" className="text-xs">
                      {Math.round(factor.weight * 100)}% weight
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {factor.description}
                  </div>
                  <Progress value={factor.score} className="h-2" />
                </div>
                <div className="text-2xl font-bold ml-4">
                  {factor.score}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historical Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Risk Trend
          </CardTitle>
          <CardDescription>
            Risk score evolution over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockHistoricalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            AI Recommendations
          </CardTitle>
          <CardDescription>
            Suggested actions based on risk analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assessment.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span className="text-sm">{recommendation}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Factor Detail Modal would go here */}
      {selectedFactor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>{selectedFactor.name}</CardTitle>
              <CardDescription>{selectedFactor.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold">{selectedFactor.score}</div>
                  <div className="text-sm text-muted-foreground">Current Score</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{Math.round(selectedFactor.weight * 100)}%</div>
                  <div className="text-sm text-muted-foreground">Weight in Overall Score</div>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(selectedFactor.trend)}
                  <span className="text-sm capitalize">{selectedFactor.trend} trend</span>
                </div>
              </div>
            </CardContent>
            <div className="p-4">
              <Button 
                onClick={() => setSelectedFactor(null)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
