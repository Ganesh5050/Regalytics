import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { N8nDashboard } from '@/components/n8n/N8nDashboard';
import { WorkflowTemplates } from '@/components/n8n/WorkflowTemplates';
import { WorkflowExecutionMonitor } from '@/components/n8n/WorkflowExecutionMonitor';
import { Settings, FileText, Activity, Info, Monitor } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function Workflows() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workflow Automation</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your n8n automation workflows
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            <Activity className="h-3 w-3 mr-1" />
            N8n Integration
          </Badge>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                N8n Workflow Integration
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                This module integrates with your n8n instance to provide workflow automation for compliance processes. 
                Configure your n8n connection in the environment variables to enable real-time workflow management.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Live Monitor
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <N8nDashboard />
        </TabsContent>

        <TabsContent value="monitor" className="space-y-6">
          <WorkflowExecutionMonitor />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <WorkflowTemplates />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>N8n Configuration</CardTitle>
              <CardDescription>
                Configure your n8n instance connection and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">N8n Instance URL</h4>
                  <p className="text-sm text-muted-foreground">
                    {import.meta.env.VITE_N8N_URL || 'Not configured'}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">API Key Status</h4>
                  <p className="text-sm text-muted-foreground">
                    {import.meta.env.VITE_N8N_API_KEY ? 'Configured' : 'Not configured'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Environment Variables Required</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><code className="bg-muted px-1 rounded">VITE_N8N_URL</code> - Your n8n instance URL</p>
                  <p><code className="bg-muted px-1 rounded">VITE_N8N_API_KEY</code> - Your n8n API key</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Quick Setup Guide</h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>1. Create an n8n account at <a href="https://n8n.cloud" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">n8n.cloud</a></p>
                  <p>2. Generate an API key in your n8n settings</p>
                  <p>3. Add the environment variables to your <code className="bg-muted px-1 rounded">.env.local</code> file</p>
                  <p>4. Restart the application to apply changes</p>
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline" asChild>
                  <a 
                    href="https://docs.n8n.io/api/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View N8n API Documentation
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workflow Categories</CardTitle>
              <CardDescription>
                Available workflow categories and their use cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-600">KYC Workflows</h4>
                  <p className="text-sm text-muted-foreground">
                    Customer onboarding, document verification, and identity validation processes.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-green-600">AML Monitoring</h4>
                  <p className="text-sm text-muted-foreground">
                    Anti-money laundering checks, transaction monitoring, and suspicious activity detection.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-600">Compliance Reporting</h4>
                  <p className="text-sm text-muted-foreground">
                    Automated regulatory reporting, data collection, and submission workflows.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-orange-600">Alert Management</h4>
                  <p className="text-sm text-muted-foreground">
                    Alert prioritization, escalation, and notification workflows.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">Risk Assessment</h4>
                  <p className="text-sm text-muted-foreground">
                    Automated risk scoring, evaluation, and monitoring processes.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-teal-600">Data Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    External API integration, data synchronization, and processing workflows.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
