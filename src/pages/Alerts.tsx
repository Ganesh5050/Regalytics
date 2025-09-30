import { AlertTriangle, Clock, CheckCircle, XCircle, Filter, Eye, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertFilters } from "@/components/alerts/AlertFilters";
import { AlertActions } from "@/components/alerts/AlertActions";
import { AlertDetailModal } from "@/components/alerts/AlertDetailModal";
import { useNotifications } from "@/hooks/useNotifications";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { RealTimeIndicator } from "@/components/common/RealTimeIndicator";

const alertsData = [
  {
    id: "ALT001",
    severity: "HIGH",
    title: "Large Cash Deposit Detected",
    description: "Cash deposit of ₹15,00,000 exceeds threshold limit",
    client: "ABC Corp Limited",
    amount: "₹15,00,000",
    timestamp: "2024-01-15 10:30:00",
    status: "Open",
    assignedTo: "Sarah Johnson",
    riskScore: 95
  },
  {
    id: "ALT002",
    severity: "MEDIUM", 
    title: "Multiple Small Transactions",
    description: "Pattern of transactions just below reporting threshold detected",
    client: "John Smith",
    amount: "₹2,45,000",
    timestamp: "2024-01-15 09:15:00",
    status: "Investigating",
    assignedTo: "Mike Wilson",
    riskScore: 78
  },
  {
    id: "ALT003",
    severity: "HIGH",
    title: "Unusual Transaction Timing",
    description: "Large transaction outside business hours",
    client: "Tech Industries Pvt",
    amount: "₹8,75,000",
    timestamp: "2024-01-14 23:45:00", 
    status: "Resolved",
    assignedTo: "Emily Davis",
    riskScore: 88
  },
  {
    id: "ALT004",
    severity: "LOW",
    title: "Incomplete KYC Documentation",
    description: "Missing address verification for high-value client",
    client: "Global Solutions Ltd",
    amount: "-",
    timestamp: "2024-01-14 14:20:00",
    status: "Open", 
    assignedTo: "David Chen",
    riskScore: 45
  },
  {
    id: "ALT005",
    severity: "MEDIUM",
    title: "Cross-Border Transaction Alert", 
    description: "Suspicious international wire transfer pattern",
    client: "Export House Pvt Ltd",
    amount: "₹12,50,000",
    timestamp: "2024-01-14 11:30:00",
    status: "Open",
    assignedTo: "Lisa Rodriguez",
    riskScore: 82
  }
];

export default function Alerts() {
  const [selectedAlert, setSelectedAlert] = useState<typeof alertsData[0] | null>(null);
  const [filters, setFilters] = useState({
    severity: [] as string[],
    status: [] as string[],
    assignedTo: [] as string[],
    dateRange: { from: '', to: '' },
    riskScoreRange: { min: '', max: '' },
    searchTerm: ''
  });
  const { addNotification } = useNotifications();
  const { isConnected, lastUpdate } = useRealTimeData();

  const handleViewAlert = (alert: typeof alertsData[0]) => {
    setSelectedAlert(alert);
  };

  const handleEditAlert = (alert: typeof alertsData[0]) => {
    setSelectedAlert(alert);
  };

  const handleStatusChange = (alertId: string, newStatus: string) => {
    addNotification({
      type: 'success',
      title: 'Alert Updated',
      message: `Alert ${alertId} status changed to ${newStatus}`
    });
  };

  const handleAssign = (alertId: string, assignee: string) => {
    addNotification({
      type: 'info',
      title: 'Alert Assigned',
      message: `Alert ${alertId} assigned to ${assignee}`
    });
  };

  const handleAlertUpdate = (alertId: string, updates: Partial<typeof alertsData[0]>) => {
    addNotification({
      type: 'success',
      title: 'Alert Updated',
      message: `Alert ${alertId} has been updated successfully`
    });
    setSelectedAlert(null);
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      severity: [],
      status: [],
      assignedTo: [],
      dateRange: { from: '', to: '' },
      riskScoreRange: { min: '', max: '' },
      searchTerm: ''
    });
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "HIGH":
        return { variant: "destructive" as const, label: "High Priority" };
      case "MEDIUM":
        return { variant: "secondary" as const, label: "Medium Priority" };
      default:
        return { variant: "outline" as const, label: "Low Priority" };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return { variant: "destructive" as const, label: "Open", icon: AlertTriangle };
      case "Investigating":
        return { variant: "secondary" as const, label: "Investigating", icon: Clock };
      case "Resolved":
        return { variant: "outline" as const, label: "Resolved", icon: CheckCircle };
      default:
        return { variant: "outline" as const, label: status, icon: XCircle };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Filter alerts
  const filteredAlerts = alertsData.filter(alert => {
    // Advanced filters
    const matchesSeverity = filters.severity.length === 0 || filters.severity.includes(alert.severity);
    const matchesStatus = filters.status.length === 0 || filters.status.includes(alert.status);
    const matchesAssignedTo = filters.assignedTo.length === 0 || filters.assignedTo.includes(alert.assignedTo);
    
    const matchesRiskScore = (!filters.riskScoreRange.min || alert.riskScore >= parseInt(filters.riskScoreRange.min)) &&
      (!filters.riskScoreRange.max || alert.riskScore <= parseInt(filters.riskScoreRange.max));
    
    return matchesSeverity && matchesStatus && matchesAssignedTo && matchesRiskScore;
  });

  // Stats
  const totalAlerts = filteredAlerts.length;
  const openAlerts = filteredAlerts.filter(alert => alert.status === "Open").length;
  const highPriorityAlerts = filteredAlerts.filter(alert => alert.severity === "HIGH").length;
  const avgRiskScore = Math.round(filteredAlerts.reduce((sum, alert) => sum + alert.riskScore, 0) / totalAlerts);

  return (
    <div className="space-y-8 p-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-warning" />
            Compliance Alerts
          </h1>
                 <div className="space-y-1">
                   <p className="text-muted-foreground text-lg">
                     Real-time risk monitoring and suspicious activity detection
                   </p>
                   <RealTimeIndicator isConnected={isConnected} lastUpdate={lastUpdate} />
                 </div>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-medium">
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Alerts</p>
                <p className="text-2xl font-bold text-foreground">{totalAlerts}</p>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Open Alerts</p>
                <p className="text-2xl font-bold text-destructive">{openAlerts}</p>
              </div>
              <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                <XCircle className="h-4 w-4 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">High Priority</p>
                <p className="text-2xl font-bold text-warning">{highPriorityAlerts}</p>
              </div>
              <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Avg Risk Score</p>
                <p className="text-2xl font-bold text-foreground">{avgRiskScore}</p>
              </div>
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <AlertFilters 
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const severityBadge = getSeverityBadge(alert.severity);
          const statusBadge = getStatusBadge(alert.status);
          const timestamp = formatTimestamp(alert.timestamp);
          
          return (
            <Card 
              key={alert.id} 
              className={`glass-card border-border/50 hover:shadow-medium transition-all duration-200 ${
                alert.severity === "HIGH" ? "border-l-4 border-destructive" : 
                alert.severity === "MEDIUM" ? "border-l-4 border-warning" : "border-l-4 border-muted"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-foreground">{alert.title}</h3>
                          <Badge variant={severityBadge.variant} className="text-xs">
                            {severityBadge.label}
                          </Badge>
                          <Badge variant={statusBadge.variant} className="text-xs">
                            <statusBadge.icon className="h-3 w-3 mr-1" />
                            {statusBadge.label}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{alert.description}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-sm text-muted-foreground">{alert.id}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold text-foreground">{alert.riskScore}</span>
                          <span className="text-xs text-muted-foreground">Risk Score</span>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Client</p>
                        <p className="text-sm font-medium text-foreground">{alert.client}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Amount</p>
                        <p className="text-sm font-semibold text-foreground">{alert.amount}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Date & Time</p>
                        <p className="text-sm text-foreground">{timestamp.date}</p>
                        <p className="text-xs text-muted-foreground">{timestamp.time}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Assigned To</p>
                        <p className="text-sm text-foreground">{alert.assignedTo}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Risk: {alert.riskScore}
                        </Badge>
                      </div>
                      <AlertActions
                        alert={alert}
                        onStatusChange={handleStatusChange}
                        onAssign={handleAssign}
                        onView={handleViewAlert}
                        onEdit={handleEditAlert}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <AlertDetailModal
          alert={selectedAlert}
          onUpdate={handleAlertUpdate}
          onClose={() => setSelectedAlert(null)}
        />
      )}
    </div>
  );
}