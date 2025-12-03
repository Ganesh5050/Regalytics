import { FileText, Download, Calendar, Filter, TrendingUp, BarChart3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { ReportActions } from "@/components/reports/ReportActions";
import { AdvancedReportBuilder } from "@/components/reports/AdvancedReportBuilder";
import { ReportAnalytics } from "@/components/reports/ReportAnalytics";
import { useNotifications } from "@/hooks/useNotifications";
import { useState } from "react";

const reportsData = [
  {
    id: "RPT001",
    name: "Monthly Compliance Report",
    description: "Comprehensive compliance overview for January 2024",
    type: "Compliance",
    format: "PDF",
    size: "2.3 MB",
    generated: "2024-01-15",
    status: "Ready",
    downloads: 45
  },
  {
    id: "RPT002", 
    name: "Suspicious Activity Summary",
    description: "All flagged transactions and investigations", 
    type: "Suspicious Activity",
    format: "Excel",
    size: "1.8 MB",
    generated: "2024-01-15",
    status: "Ready",
    downloads: 23
  },
  {
    id: "RPT003",
    name: "KYC Status Report",
    description: "Client onboarding and verification status",
    type: "KYC",
    format: "PDF", 
    size: "956 KB",
    generated: "2024-01-14",
    status: "Ready",
    downloads: 67
  },
  {
    id: "RPT004",
    name: "Risk Assessment Analytics",
    description: "Risk scoring trends and analysis",
    type: "Risk Analysis", 
    format: "PDF",
    size: "3.1 MB",
    generated: "2024-01-14",
    status: "Generating",
    downloads: 0
  }
];

const quickReports = [
  {
    name: "Daily Transaction Summary",
    description: "Yesterday's transaction overview",
    icon: BarChart3,
    color: "primary"
  },
  {
    name: "Weekly Risk Trends", 
    description: "7-day risk assessment analysis",
    icon: TrendingUp,
    color: "success"
  },
  {
    name: "Client Onboarding Stats",
    description: "New client acquisition metrics",
    icon: FileText,
    color: "accent"
  }
];

export default function Reports() {
  const [reports, setReports] = useState(reportsData);
  const [filters, setFilters] = useState({
    type: [] as string[],
    status: [] as string[],
    format: [] as string[],
    dateRange: { from: '', to: '' },
    searchTerm: ''
  });
  const { addNotification } = useNotifications();

  const handleGenerateReport = (newReport: any) => {
    setReports(prev => [newReport, ...prev]);
    addNotification({
      type: 'success',
      title: 'Report Generated',
      message: `Report "${newReport.config.name}" is being generated`
    });
  };

  const handleDownload = (reportId: string) => {
    addNotification({
      type: 'info',
      title: 'Download Started',
      message: `Downloading report ${reportId}`
    });
  };

  const handleView = (report: any) => {
    addNotification({
      type: 'info',
      title: 'Viewing Report',
      message: `Opening report "${report.name}"`
    });
  };

  const handleRegenerate = (reportId: string) => {
    addNotification({
      type: 'warning',
      title: 'Regenerating Report',
      message: `Report ${reportId} is being regenerated`
    });
  };

  const handleDelete = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    addNotification({
      type: 'success',
      title: 'Report Deleted',
      message: `Report ${reportId} has been deleted`
    });
  };

  const handleSchedule = (report: any) => {
    addNotification({
      type: 'info',
      title: 'Schedule Report',
      message: `Scheduling report "${report.name}"`
    });
  };

  const handleShare = (report: any) => {
    addNotification({
      type: 'info',
      title: 'Share Report',
      message: `Sharing report "${report.name}"`
    });
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      type: [],
      status: [],
      format: [],
      dateRange: { from: '', to: '' },
      searchTerm: ''
    });
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      "Compliance": "default" as const,
      "Suspicious Activity": "destructive" as const, 
      "KYC": "secondary" as const,
      "Risk Analysis": "outline" as const
    };
    return colors[type as keyof typeof colors] || "outline" as const;
  };

  const getStatusBadge = (status: string) => {
    if (status === "Ready") return { variant: "outline" as const, label: "Ready" };
    return { variant: "secondary" as const, label: "Generating..." };
  };

  const filteredReports = reports.filter(report => {
    const matchesType = filters.type.length === 0 || filters.type.includes(report.type);
    const matchesStatus = filters.status.length === 0 || filters.status.includes(report.status);
    const matchesFormat = filters.format.length === 0 || filters.format.includes(report.format);
    
    return matchesType && matchesStatus && matchesFormat;
  });

  return (
    <div className="space-y-8 p-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            Compliance Reports
          </h1>
          <p className="text-muted-foreground text-lg">
            Generate, download, and manage regulatory compliance reports
          </p>
        </div>
        <ReportGenerator onGenerate={handleGenerateReport} />
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickReports.map((report, index) => (
          <Card key={index} className="glass-card border-border/50 hover:shadow-medium transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className={`w-10 h-10 rounded-lg bg-${report.color}/10 flex items-center justify-center group-hover:bg-${report.color}/20 transition-colors`}>
                    <report.icon className={`h-5 w-5 text-${report.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground">{report.name}</h3>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                </div>
                <Button size="sm" variant="outline" className="border-border/50 hover:bg-accent/50">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <ReportFilters 
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {filteredReports.length} Reports
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Generated Reports</CardTitle>
          <CardDescription>
            Download and manage all compliance reports and analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredReports.map((report) => {
            const statusBadge = getStatusBadge(report.status);
            
            return (
              <div 
                key={report.id}
                className="flex items-center justify-between p-6 rounded-lg border border-border/50 hover:bg-muted/20 transition-micro"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{report.name}</h3>
                      <Badge variant={getTypeBadge(report.type)} className="text-xs">
                        {report.type}
                      </Badge>
                      <Badge variant={statusBadge.variant} className="text-xs">
                        {statusBadge.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>ID: {report.id}</span>
                      <span>Format: {report.format}</span>
                      <span>Size: {report.size}</span>
                      <span>Generated: {report.generated}</span>
                      <span>Downloads: {report.downloads}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <ReportActions
                    report={report}
                    onDownload={handleDownload}
                    onView={handleView}
                    onRegenerate={handleRegenerate}
                    onDelete={handleDelete}
                    onSchedule={handleSchedule}
                    onShare={handleShare}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Report Templates</CardTitle>
          <CardDescription>
            Pre-configured report templates for common compliance needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Monthly Regulatory Filing",
              "Quarterly Risk Assessment", 
              "Annual Compliance Review",
              "Transaction Monitoring Summary",
              "KYC Due Diligence Report",
              "Suspicious Activity Report (SAR)"
            ].map((template, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg border border-border/50 hover:bg-muted/20 transition-micro cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {template}
                    </p>
                    <p className="text-xs text-muted-foreground">Ready to generate</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-border/50 hover:bg-accent/50">
                    Use Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="builder">
          <AdvancedReportBuilder />
        </TabsContent>

        <TabsContent value="analytics">
          <ReportAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}