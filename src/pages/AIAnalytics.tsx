import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  BarChart3,
  Zap,
  Shield,
  Activity
} from 'lucide-react';
import { AIRiskScoring } from '@/components/ai/AIRiskScoring';
import { PredictiveAnalytics } from '@/components/ai/PredictiveAnalytics';

export default function AIAnalytics() {
  const [activeTab, setActiveTab] = useState('risk-scoring');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Analytics</h1>
          <p className="text-muted-foreground">
            Advanced AI-powered risk assessment and predictive analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            AI Powered
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Real-time
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Risk Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">62</div>
            <p className="text-xs text-muted-foreground">
              Medium Risk Level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prediction Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              All models running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insights Generated</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              +156 this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="risk-scoring" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Risk Scoring
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Predictive Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="risk-scoring" className="space-y-4">
          <AIRiskScoring />
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <PredictiveAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
