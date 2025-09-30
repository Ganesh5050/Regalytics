import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus,
  Download,
  Eye,
  Copy,
  Settings,
  Zap,
  Shield,
  FileText,
  AlertTriangle,
  Users,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import N8nService, { N8nWorkflow } from '@/services/N8nService';
import { useNotifications } from '@/hooks/useNotifications';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'KYC' | 'AML' | 'Reporting' | 'Monitoring' | 'Compliance';
  complexity: 'Simple' | 'Medium' | 'Advanced';
  estimatedTime: string;
  tags: string[];
  icon: any;
  workflow: Partial<N8nWorkflow>;
  requiredCredentials: string[];
  features: string[];
}

const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'kyc-verification',
    name: 'KYC Verification Workflow',
    description: 'Automated customer verification process with document validation and risk scoring',
    category: 'KYC',
    complexity: 'Medium',
    estimatedTime: '15-20 minutes',
    tags: ['Customer Onboarding', 'Document Verification', 'Risk Assessment'],
    icon: Users,
    requiredCredentials: ['Document Verification API', 'Database Connection'],
    features: [
      'Document upload and validation',
      'Identity verification',
      'Risk score calculation',
      'Automated approval/rejection',
      'Compliance reporting'
    ],
    workflow: {
      name: 'KYC Verification Workflow',
      nodes: [
        {
          id: 'webhook',
          type: 'n8n-nodes-base.webhook',
          name: 'Customer Data Webhook',
          parameters: {
            httpMethod: 'POST',
            path: 'kyc-verification'
          }
        },
        {
          id: 'document-validation',
          type: 'n8n-nodes-base.httpRequest',
          name: 'Document Validation',
          parameters: {
            url: '={{$node["Customer Data Webhook"].json["documentValidationUrl"]}}',
            method: 'POST'
          }
        },
        {
          id: 'risk-assessment',
          type: 'n8n-nodes-base.code',
          name: 'Risk Assessment',
          parameters: {
            jsCode: `
              const customerData = $node["Customer Data Webhook"].json;
              const documentResult = $node["Document Validation"].json;
              
              let riskScore = 0;
              
              // Calculate risk based on various factors
              if (documentResult.verified) riskScore += 20;
              if (customerData.hasExistingAccount) riskScore += 15;
              if (customerData.country === 'high-risk') riskScore -= 30;
              
              return {
                riskScore,
                riskLevel: riskScore >= 70 ? 'Low' : riskScore >= 40 ? 'Medium' : 'High',
                approved: riskScore >= 40,
                customerData,
                documentResult
              };
            `
          }
        },
        {
          id: 'database-update',
          type: 'n8n-nodes-base.postgres',
          name: 'Update Customer Database',
          parameters: {
            query: 'INSERT INTO customers (id, risk_score, status, verified_at) VALUES ($1, $2, $3, NOW())'
          }
        },
        {
          id: 'notification',
          type: 'n8n-nodes-base.emailSend',
          name: 'Send Notification',
          parameters: {
            subject: 'KYC Verification Complete',
            text: '={{$node["Risk Assessment"].json["approved"] ? "Customer approved" : "Customer requires manual review"}}'
          }
        }
      ],
      connections: {
        'Customer Data Webhook': {
          main: [['Document Validation']]
        },
        'Document Validation': {
          main: [['Risk Assessment']]
        },
        'Risk Assessment': {
          main: [['Update Customer Database', 'Send Notification']]
        }
      }
    }
  },
  {
    id: 'transaction-monitoring',
    name: 'Transaction Monitoring',
    description: 'Real-time transaction analysis for suspicious activity detection',
    category: 'AML',
    complexity: 'Advanced',
    estimatedTime: '25-30 minutes',
    tags: ['AML', 'Fraud Detection', 'Real-time Monitoring'],
    icon: TrendingUp,
    requiredCredentials: ['Banking API', 'Alert System', 'Database Connection'],
    features: [
      'Real-time transaction analysis',
      'Pattern recognition',
      'Threshold-based alerts',
      'Risk scoring',
      'Regulatory reporting'
    ],
    workflow: {
      name: 'Transaction Monitoring',
      nodes: [
        {
          id: 'transaction-trigger',
          type: 'n8n-nodes-base.webhook',
          name: 'Transaction Trigger',
          parameters: {
            httpMethod: 'POST',
            path: 'transaction-monitor'
          }
        },
        {
          id: 'analyze-transaction',
          type: 'n8n-nodes-base.code',
          name: 'Analyze Transaction',
          parameters: {
            jsCode: `
              const transaction = $node["Transaction Trigger"].json;
              
              let suspiciousScore = 0;
              const flags = [];
              
              // Large amount check
              if (transaction.amount > 10000) {
                suspiciousScore += 30;
                flags.push('Large Amount');
              }
              
              // Unusual time check
              const hour = new Date(transaction.timestamp).getHours();
              if (hour < 6 || hour > 22) {
                suspiciousScore += 20;
                flags.push('Unusual Time');
              }
              
              // Frequency check (mock)
              if (transaction.dailyTransactionCount > 5) {
                suspiciousScore += 25;
                flags.push('High Frequency');
              }
              
              return {
                ...transaction,
                suspiciousScore,
                flags,
                requiresReview: suspiciousScore >= 50
              };
            `
          }
        },
        {
          id: 'create-alert',
          type: 'n8n-nodes-base.if',
          name: 'Create Alert If Suspicious',
          parameters: {
            conditions: {
              boolean: [
                {
                  value1: '={{$node["Analyze Transaction"].json["requiresReview"]}}',
                  value2: true
                }
              ]
            }
          }
        }
      ]
    }
  },
  {
    id: 'compliance-reporting',
    name: 'Compliance Reporting',
    description: 'Automated generation and submission of regulatory compliance reports',
    category: 'Reporting',
    complexity: 'Medium',
    estimatedTime: '20-25 minutes',
    tags: ['Regulatory Reporting', 'Automation', 'Compliance'],
    icon: FileText,
    requiredCredentials: ['Database Connection', 'Email Service', 'File Storage'],
    features: [
      'Automated data collection',
      'Report generation',
      'Regulatory format compliance',
      'Scheduled submissions',
      'Audit trail maintenance'
    ],
    workflow: {
      name: 'Compliance Reporting',
      nodes: [
        {
          id: 'schedule-trigger',
          type: 'n8n-nodes-base.cron',
          name: 'Monthly Report Schedule',
          parameters: {
            triggerTimes: {
              cron: '0 0 1 * *' // First day of every month
            }
          }
        },
        {
          id: 'collect-data',
          type: 'n8n-nodes-base.postgres',
          name: 'Collect Compliance Data',
          parameters: {
            query: `
              SELECT 
                COUNT(*) as total_transactions,
                SUM(CASE WHEN suspicious_score >= 50 THEN 1 ELSE 0 END) as suspicious_transactions,
                AVG(risk_score) as avg_risk_score
              FROM transactions 
              WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
                AND created_at < DATE_TRUNC('month', CURRENT_DATE)
            `
          }
        },
        {
          id: 'generate-report',
          type: 'n8n-nodes-base.code',
          name: 'Generate Report',
          parameters: {
            jsCode: `
              const data = $node["Collect Compliance Data"].json[0];
              const reportMonth = new Date(new Date().setMonth(new Date().getMonth() - 1));
              
              const report = {
                reportId: 'COMP-' + Date.now(),
                reportDate: new Date().toISOString(),
                reportingPeriod: reportMonth.toISOString().substring(0, 7),
                institution: 'Regalytics Financial',
                data: {
                  totalTransactions: data.total_transactions,
                  suspiciousTransactions: data.suspicious_transactions,
                  suspiciousRate: (data.suspicious_transactions / data.total_transactions * 100).toFixed(2) + '%',
                  averageRiskScore: parseFloat(data.avg_risk_score).toFixed(2)
                }
              };
              
              return report;
            `
          }
        }
      ]
    }
  },
  {
    id: 'alert-management',
    name: 'Alert Management System',
    description: 'Intelligent alert prioritization and escalation workflow',
    category: 'Monitoring',
    complexity: 'Simple',
    estimatedTime: '10-15 minutes',
    tags: ['Alert Management', 'Escalation', 'Notifications'],
    icon: AlertTriangle,
    requiredCredentials: ['Email Service', 'SMS Service', 'Database Connection'],
    features: [
      'Alert prioritization',
      'Automatic escalation',
      'Multi-channel notifications',
      'Response tracking',
      'SLA monitoring'
    ],
    workflow: {
      name: 'Alert Management System',
      nodes: [
        {
          id: 'alert-webhook',
          type: 'n8n-nodes-base.webhook',
          name: 'Alert Webhook',
          parameters: {
            httpMethod: 'POST',
            path: 'alert-management'
          }
        },
        {
          id: 'prioritize-alert',
          type: 'n8n-nodes-base.code',
          name: 'Prioritize Alert',
          parameters: {
            jsCode: `
              const alert = $node["Alert Webhook"].json;
              
              let priority = 'Low';
              let escalationTime = 24 * 60; // 24 hours in minutes
              
              if (alert.type === 'fraud' || alert.riskScore >= 80) {
                priority = 'Critical';
                escalationTime = 15; // 15 minutes
              } else if (alert.type === 'compliance' || alert.riskScore >= 60) {
                priority = 'High';
                escalationTime = 60; // 1 hour
              } else if (alert.riskScore >= 40) {
                priority = 'Medium';
                escalationTime = 4 * 60; // 4 hours
              }
              
              return {
                ...alert,
                priority,
                escalationTime,
                createdAt: new Date().toISOString()
              };
            `
          }
        },
        {
          id: 'send-notification',
          type: 'n8n-nodes-base.emailSend',
          name: 'Send Initial Notification',
          parameters: {
            subject: '🚨 New {{$node["Prioritize Alert"].json["priority"]}} Priority Alert',
            text: 'Alert: {{$node["Prioritize Alert"].json["title"]}}\nDescription: {{$node["Prioritize Alert"].json["description"]}}'
          }
        }
      ]
    }
  },
  {
    id: 'risk-assessment',
    name: 'Automated Risk Assessment',
    description: 'Comprehensive risk evaluation for clients and transactions',
    category: 'Compliance',
    complexity: 'Advanced',
    estimatedTime: '30-35 minutes',
    tags: ['Risk Assessment', 'ML Integration', 'Scoring'],
    icon: Shield,
    requiredCredentials: ['ML API', 'Database Connection', 'External Data Sources'],
    features: [
      'Multi-factor risk analysis',
      'Machine learning integration',
      'Dynamic risk scoring',
      'Regulatory compliance',
      'Continuous monitoring'
    ],
    workflow: {
      name: 'Automated Risk Assessment',
      nodes: [
        {
          id: 'risk-trigger',
          type: 'n8n-nodes-base.webhook',
          name: 'Risk Assessment Trigger',
          parameters: {
            httpMethod: 'POST',
            path: 'risk-assessment'
          }
        },
        {
          id: 'gather-data',
          type: 'n8n-nodes-base.code',
          name: 'Gather Risk Data',
          parameters: {
            jsCode: `
              const entity = $node["Risk Assessment Trigger"].json;
              
              // Simulate gathering data from multiple sources
              const riskFactors = {
                geographicRisk: entity.country === 'high-risk' ? 0.3 : 0.1,
                industryRisk: entity.industry === 'crypto' ? 0.4 : 0.2,
                transactionVolume: entity.monthlyVolume > 100000 ? 0.3 : 0.1,
                customerType: entity.type === 'pep' ? 0.5 : 0.1,
                historicalBehavior: entity.previousIssues ? 0.4 : 0.0
              };
              
              const overallRisk = Object.values(riskFactors).reduce((sum, risk) => sum + risk, 0) / Object.values(riskFactors).length;
              
              return {
                entityId: entity.id,
                riskFactors,
                overallRisk: Math.min(overallRisk, 1.0),
                riskLevel: overallRisk >= 0.7 ? 'High' : overallRisk >= 0.4 ? 'Medium' : 'Low',
                assessmentDate: new Date().toISOString()
              };
            `
          }
        }
      ]
    }
  }
];

export function WorkflowTemplates() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [isDeployDialogOpen, setIsDeployDialogOpen] = useState(false);
  const [deploymentName, setDeploymentName] = useState('');
  const [deploymentDescription, setDeploymentDescription] = useState('');
  const { addNotification } = useNotifications();

  const categories = ['all', 'KYC', 'AML', 'Reporting', 'Monitoring', 'Compliance'];

  const filteredTemplates = workflowTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handleDeployTemplate = async (template: WorkflowTemplate) => {
    setSelectedTemplate(template);
    setDeploymentName(template.name);
    setDeploymentDescription(template.description);
    setIsDeployDialogOpen(true);
  };

  const handleConfirmDeployment = async () => {
    if (!selectedTemplate) return;

    try {
      const workflowData = {
        ...selectedTemplate.workflow,
        name: deploymentName,
        nodes: selectedTemplate.workflow.nodes || [],
        connections: selectedTemplate.workflow.connections || {},
        settings: {
          description: deploymentDescription,
          category: selectedTemplate.category,
          tags: selectedTemplate.tags
        }
      };

      const createdWorkflow = await N8nService.createWorkflow(workflowData);
      
      if (createdWorkflow) {
        addNotification({
          type: 'success',
          title: 'Workflow Deployed',
          message: `"${deploymentName}" has been successfully deployed to n8n`,
        });
      } else {
        throw new Error('Failed to create workflow');
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Deployment Failed',
        message: 'Failed to deploy workflow to n8n. Please check your connection and try again.',
      });
    }

    setIsDeployDialogOpen(false);
    setSelectedTemplate(null);
    setDeploymentName('');
    setDeploymentDescription('');
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Workflow Templates</h2>
          <p className="text-muted-foreground">
            Pre-built compliance and automation workflows ready to deploy
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredTemplates.length} templates
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const IconComponent = template.icon;
          return (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getComplexityColor(template.complexity)}`}
                      >
                        {template.complexity}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{template.estimatedTime}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Key Features:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {template.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleDeployTemplate(template)}
                    className="flex-1"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Deploy
                  </Button>
                  
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button size="sm" variant="outline">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Deployment Dialog */}
      <Dialog open={isDeployDialogOpen} onOpenChange={setIsDeployDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deploy Workflow Template</DialogTitle>
            <DialogDescription>
              Configure and deploy "{selectedTemplate?.name}" to your n8n instance.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workflow Name</Label>
              <Input
                id="name"
                value={deploymentName}
                onChange={(e) => setDeploymentName(e.target.value)}
                placeholder="Enter workflow name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={deploymentDescription}
                onChange={(e) => setDeploymentDescription(e.target.value)}
                placeholder="Enter workflow description"
                rows={3}
              />
            </div>

            {selectedTemplate && (
              <div className="space-y-2">
                <Label>Required Credentials</Label>
                <div className="text-sm text-muted-foreground">
                  Make sure you have configured these credentials in n8n:
                </div>
                <ul className="text-sm space-y-1">
                  {selectedTemplate.requiredCredentials.map((cred, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Settings className="h-3 w-3" />
                      {cred}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeployDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmDeployment}
              disabled={!deploymentName.trim()}
            >
              <Zap className="h-4 w-4 mr-2" />
              Deploy Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
