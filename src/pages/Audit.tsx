import { History, User, Calendar, Filter, Search, Eye, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuditFilters } from "@/components/audit/AuditFilters";
import { AuditDetailModal } from "@/components/audit/AuditDetailModal";
import { useNotifications } from "@/hooks/useNotifications";
import { useState } from "react";

const auditLogsData = [
  {
    id: "AUD20240115001",
    timestamp: "2024-01-15 10:30:15",
    user: "Sarah Johnson",
    action: "Client KYC Updated",
    resource: "Client: Rajesh Industries Pvt Ltd",
    details: "Updated risk score from 82 to 85",
    ipAddress: "192.168.1.104",
    status: "Success",
    severity: "Medium"
  },
  {
    id: "AUD20240115002",
    timestamp: "2024-01-15 10:25:42", 
    user: "Mike Wilson",
    action: "Alert Investigation Closed",
    resource: "Alert: ALT001 - Large Cash Deposit",
    details: "Investigation completed, marked as legitimate transaction",
    ipAddress: "192.168.1.112",
    status: "Success", 
    severity: "High"
  },
  {
    id: "AUD20240115003",
    timestamp: "2024-01-15 09:45:30",
    user: "System",
    action: "Automated Risk Assessment",
    resource: "Client: Mumbai Trading Co.",
    details: "Risk score calculation triggered by large transaction",
    ipAddress: "System",
    status: "Success",
    severity: "Low"
  },
  {
    id: "AUD20240115004", 
    timestamp: "2024-01-15 09:30:18",
    user: "Emily Davis",
    action: "Report Generated",
    resource: "Report: Monthly Compliance Report",
    details: "Generated PDF report for January 2024 compliance review",
    ipAddress: "192.168.1.108",
    status: "Success",
    severity: "Low"
  },
  {
    id: "AUD20240115005",
    timestamp: "2024-01-15 09:15:07",
    user: "David Chen", 
    action: "Failed Login Attempt",
    resource: "User Authentication",
    details: "Invalid password attempt for user account", 
    ipAddress: "203.45.67.89",
    status: "Failed",
    severity: "High"
  },
  {
    id: "AUD20240114001",
    timestamp: "2024-01-14 16:20:33",
    user: "Lisa Rodriguez",
    action: "Transaction Flagged",
    resource: "Transaction: TXN20240114002", 
    details: "Flagged transaction for manual review due to suspicious pattern",
    ipAddress: "192.168.1.115",
    status: "Success",
    severity: "High"
  }
];

export default function Audit() {
  const [selectedAuditLog, setSelectedAuditLog] = useState<typeof auditLogsData[0] | null>(null);
  const [filters, setFilters] = useState({
    user: [] as string[],
    action: [] as string[],
    status: [] as string[],
    severity: [] as string[],
    dateRange: { from: '', to: '' },
    searchTerm: ''
  });
  const { addNotification } = useNotifications();

  const handleViewAuditLog = (auditLog: typeof auditLogsData[0]) => {
    setSelectedAuditLog(auditLog);
  };

  const handleExportAuditLogs = () => {
    addNotification({
      type: 'info',
      title: 'Export Started',
      message: 'Audit logs are being exported to CSV'
    });
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      user: [],
      action: [],
      status: [],
      severity: [],
      dateRange: { from: '', to: '' },
      searchTerm: ''
    });
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "High":
        return { variant: "destructive" as const, label: "High" };
      case "Medium": 
        return { variant: "secondary" as const, label: "Medium" };
      default:
        return { variant: "outline" as const, label: "Low" };
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "Success") return { variant: "outline" as const, label: "Success" };
    return { variant: "destructive" as const, label: "Failed" };
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const filteredAuditLogs = auditLogsData.filter(log => {
    const matchesUser = filters.user.length === 0 || filters.user.includes(log.user);
    const matchesAction = filters.action.length === 0 || filters.action.includes(log.action);
    const matchesStatus = filters.status.length === 0 || filters.status.includes(log.status);
    const matchesSeverity = filters.severity.length === 0 || filters.severity.includes(log.severity);
    
    return matchesUser && matchesAction && matchesStatus && matchesSeverity;
  });

  // Stats
  const totalLogs = filteredAuditLogs.length;
  const todayLogs = filteredAuditLogs.filter(log => log.timestamp.startsWith("2024-01-15")).length;
  const failedActions = filteredAuditLogs.filter(log => log.status === "Failed").length;
  const highSeverityLogs = filteredAuditLogs.filter(log => log.severity === "High").length;

  return (
    <div className="space-y-8 p-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <History className="h-8 w-8 text-primary" />
            Audit Trail
          </h1>
          <p className="text-muted-foreground text-lg">
            Complete system activity logs and compliance audit trail
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportAuditLogs}
            className="border-border/50 hover:bg-accent/50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Logs</p>
                <p className="text-2xl font-bold text-foreground">{totalLogs}</p>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <History className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Today's Activity</p>
                <p className="text-2xl font-bold text-foreground">{todayLogs}</p>
              </div>
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Failed Actions</p>
                <p className="text-2xl font-bold text-destructive">{failedActions}</p>
              </div>
              <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">High Severity</p>
                <p className="text-2xl font-bold text-warning">{highSeverityLogs}</p>
              </div>
              <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                <Eye className="h-4 w-4 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <AuditFilters 
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {filteredAuditLogs.length} Logs
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">System Activity Logs</CardTitle>
          <CardDescription>
            Chronological record of all system activities and user actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredAuditLogs.map((log) => {
            const severityBadge = getSeverityBadge(log.severity);
            const statusBadge = getStatusBadge(log.status);
            const timestamp = formatTimestamp(log.timestamp);
            
            return (
              <div 
                key={log.id}
                className={`p-6 rounded-lg border transition-all duration-200 hover:shadow-soft ${
                  log.status === "Failed" ? "border-destructive/30 bg-destructive/5" : "border-border/50 hover:bg-muted/20"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{log.action}</h3>
                      <Badge variant={statusBadge.variant} className="text-xs">
                        {statusBadge.label}
                      </Badge>
                      <Badge variant={severityBadge.variant} className="text-xs">
                        {severityBadge.label}
                      </Badge>
                    </div>
                    
                    {/* Details */}
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{log.resource}</p>
                      <p className="text-sm text-foreground">{log.details}</p>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{log.user}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{timestamp.date} at {timestamp.time}</span>
                      </div>
                      <span>IP: {log.ipAddress}</span>
                      <span>ID: {log.id}</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-border/50 hover:bg-accent/50"
                    onClick={() => handleViewAuditLog(log)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Export Audit Logs</h3>
              <p className="text-sm text-muted-foreground">
                Download audit trail for compliance reporting and external review
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-border/50 hover:bg-accent/50">
                Export CSV
              </Button>
              <Button variant="outline" className="border-border/50 hover:bg-accent/50">
                Export PDF
              </Button>
              <Button className="bg-primary hover:bg-primary-hover">
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Detail Modal */}
      {selectedAuditLog && (
        <AuditDetailModal
          auditLog={selectedAuditLog}
          onClose={() => setSelectedAuditLog(null)}
        />
      )}
    </div>
  );
}