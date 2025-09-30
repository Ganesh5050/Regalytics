import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Plus, 
  FileText, 
  Calendar, 
  Download,
  Settings,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Users,
  Shield
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

interface ReportGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  category: string;
  parameters: string[];
}

const reportTemplates: ReportTemplate[] = [
  {
    id: "compliance_monthly",
    name: "Monthly Compliance Report",
    description: "Comprehensive compliance overview with KPI metrics",
    icon: FileText,
    color: "primary",
    category: "Compliance",
    parameters: ["date_range", "include_charts", "export_format"]
  },
  {
    id: "transaction_summary",
    name: "Transaction Summary",
    description: "Daily/weekly transaction analysis and trends",
    icon: BarChart3,
    color: "success",
    category: "Transactions",
    parameters: ["date_range", "transaction_type", "include_suspicious"]
  },
  {
    id: "risk_assessment",
    name: "Risk Assessment Report",
    description: "Client risk scoring and assessment analysis",
    icon: TrendingUp,
    color: "warning",
    category: "Risk",
    parameters: ["risk_threshold", "client_segment", "include_trends"]
  },
  {
    id: "kyc_status",
    name: "KYC Status Report",
    description: "Client onboarding and verification status",
    icon: Users,
    color: "accent",
    category: "KYC",
    parameters: ["kyc_status", "date_range", "include_pending"]
  },
  {
    id: "suspicious_activity",
    name: "Suspicious Activity Report",
    description: "Flagged transactions and investigation summary",
    icon: AlertTriangle,
    color: "destructive",
    category: "Alerts",
    parameters: ["severity_level", "date_range", "include_resolved"]
  },
  {
    id: "audit_trail",
    name: "Audit Trail Report",
    description: "System activity and user action logs",
    icon: Shield,
    color: "secondary",
    category: "Audit",
    parameters: ["user_filter", "date_range", "action_type"]
  }
];

interface ReportGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportGenerator({ isOpen, onClose }: ReportGeneratorProps) {
  const { addNotification } = useNotifications();
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [reportConfig, setReportConfig] = useState({
    name: "",
    description: "",
    dateRange: { from: "", to: "" },
    format: "PDF",
    includeCharts: true,
    emailNotification: false,
    parameters: {} as Record<string, any>
  });

  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setReportConfig(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
      parameters: {}
    }));
  };

  const handleParameterChange = (key: string, value: any) => {
    setReportConfig(prev => ({
      ...prev,
      parameters: { ...prev.parameters, [key]: value }
    }));
  };

  const handleGenerate = () => {
    if (selectedTemplate) {
      const report = {
        id: `RPT${Date.now()}`,
        template: selectedTemplate,
        config: reportConfig,
        status: "Generating",
        generated: new Date().toISOString().split('T')[0],
        downloads: 0
      };

      addNotification({
        type: "success",
        title: "Report Generated",
        message: `Report "${reportConfig.name}" has been generated successfully`
      });

      // Reset form
      setSelectedTemplate(null);
      setReportConfig({
        name: "",
        description: "",
        dateRange: { from: "", to: "" },
        format: "PDF",
        includeCharts: true,
        emailNotification: false,
        parameters: {}
      });

      onClose();
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'primary': return 'text-primary';
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'destructive': return 'text-destructive';
      case 'accent': return 'text-accent';
      case 'secondary': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  const getBgColor = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-primary/10';
      case 'success': return 'bg-success/10';
      case 'warning': return 'bg-warning/10';
      case 'destructive': return 'bg-destructive/10';
      case 'accent': return 'bg-accent/10';
      case 'secondary': return 'bg-secondary/10';
      default: return 'bg-muted/10';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Generate New Report</DialogTitle>
          <DialogDescription>
            Select a report template and configure parameters
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Selection */}
          {!selectedTemplate ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Report Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:shadow-medium transition-all duration-200 border-border/50"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 ${getBgColor(template.color)} rounded-lg flex items-center justify-center`}>
                            <Icon className={`h-5 w-5 ${getIconColor(template.color)}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{template.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                            <Badge variant="outline" className="text-xs mt-2">
                              {template.category}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Report Configuration */}
              <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/20">
                <div className={`w-10 h-10 ${getBgColor(selectedTemplate.color)} rounded-lg flex items-center justify-center`}>
                  {React.createElement(selectedTemplate.icon, { 
                    className: `h-5 w-5 ${getIconColor(selectedTemplate.color)}` 
                  })}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedTemplate.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTemplate(null)}
                  className="ml-auto"
                >
                  Change Template
                </Button>
              </div>

              {/* Basic Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reportName">Report Name</Label>
                  <Input
                    id="reportName"
                    value={reportConfig.name}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter report name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="format">Export Format</Label>
                  <Select value={reportConfig.format} onValueChange={(value) => setReportConfig(prev => ({ ...prev, format: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="Excel">Excel</SelectItem>
                      <SelectItem value="CSV">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={reportConfig.description}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter report description"
                  rows={3}
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFrom">From Date</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={reportConfig.dateRange.from}
                    onChange={(e) => setReportConfig(prev => ({ 
                      ...prev, 
                      dateRange: { ...prev.dateRange, from: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateTo">To Date</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={reportConfig.dateRange.to}
                    onChange={(e) => setReportConfig(prev => ({ 
                      ...prev, 
                      dateRange: { ...prev.dateRange, to: e.target.value }
                    }))}
                  />
                </div>
              </div>

              {/* Template-specific Parameters */}
              {selectedTemplate.parameters.map((param) => (
                <div key={param} className="space-y-2">
                  <Label>{param.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
                  {param === "date_range" ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        value={reportConfig.parameters[param]?.from || ""}
                        onChange={(e) => handleParameterChange(param, { 
                          ...reportConfig.parameters[param], 
                          from: e.target.value 
                        })}
                        placeholder="From"
                      />
                      <Input
                        type="date"
                        value={reportConfig.parameters[param]?.to || ""}
                        onChange={(e) => handleParameterChange(param, { 
                          ...reportConfig.parameters[param], 
                          to: e.target.value 
                        })}
                        placeholder="To"
                      />
                    </div>
                  ) : param === "export_format" ? (
                    <Select 
                      value={reportConfig.parameters[param] || "PDF"} 
                      onValueChange={(value) => handleParameterChange(param, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="Excel">Excel</SelectItem>
                        <SelectItem value="CSV">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={reportConfig.parameters[param] || ""}
                      onChange={(e) => handleParameterChange(param, e.target.value)}
                      placeholder={`Enter ${param.replace(/_/g, ' ')}`}
                    />
                  )}
                </div>
              ))}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerate}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
