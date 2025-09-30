import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  User, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  MapPin,
  Shield,
  FileText,
  Clock,
  Activity
} from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  status: string;
  severity: string;
  sessionId?: string;
  userAgent?: string;
  location?: string;
  duration?: number;
  relatedActions?: string[];
}

interface AuditDetailModalProps {
  auditLog: AuditLog;
  onClose: () => void;
}

export function AuditDetailModal({ auditLog, onClose }: AuditDetailModalProps) {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'High': return { variant: "destructive" as const, label: "High", icon: AlertTriangle };
      case 'Medium': return { variant: "secondary" as const, label: "Medium", icon: Clock };
      default: return { variant: "outline" as const, label: "Low", icon: CheckCircle };
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "Success") return { variant: "outline" as const, label: "Success", icon: CheckCircle };
    return { variant: "destructive" as const, label: "Failed", icon: XCircle };
  };

  const severityBadge = getSeverityBadge(auditLog.severity);
  const statusBadge = getStatusBadge(auditLog.status);
  const SeverityIcon = severityBadge.icon;
  const StatusIcon = statusBadge.icon;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      full: date.toLocaleString()
    };
  };

  const timestamp = formatTimestamp(auditLog.timestamp);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Activity className="h-6 w-6" />
                Audit Log {auditLog.id}
              </DialogTitle>
              <DialogDescription className="text-base">
                {auditLog.action} • {timestamp.date} at {timestamp.time}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={severityBadge.variant}>{severityBadge.label}</Badge>
              <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="context">Context</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Action Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Action Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Action</span>
                    <span className="font-semibold">{auditLog.action}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Resource</span>
                    <span className="text-sm">{auditLog.resource}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Severity</span>
                    <Badge variant={severityBadge.variant}>{severityBadge.label}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* User Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{auditLog.user}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{timestamp.full}</span>
                  </div>

                  {auditLog.ipAddress && (
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-mono">{auditLog.ipAddress}</span>
                    </div>
                  )}

                  {auditLog.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{auditLog.location}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Action Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{auditLog.details}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detailed Information</CardTitle>
                <CardDescription>
                  Complete audit log details and metadata
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Audit ID</label>
                      <div className="text-sm font-mono bg-muted/50 px-2 py-1 rounded">
                        {auditLog.id}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Timestamp</label>
                      <div className="text-sm">{timestamp.full}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Action</label>
                    <div className="text-sm font-semibold">{auditLog.action}</div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Resource</label>
                    <div className="text-sm">{auditLog.resource}</div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Details</label>
                    <div className="text-sm text-muted-foreground p-3 bg-muted/20 rounded">
                      {auditLog.details}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Severity</label>
                      <Badge variant={severityBadge.variant}>{severityBadge.label}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Security Information</CardTitle>
                <CardDescription>
                  Security-related details and access information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">IP Address</label>
                      <div className="text-sm font-mono bg-muted/50 px-2 py-1 rounded">
                        {auditLog.ipAddress}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Session ID</label>
                      <div className="text-sm font-mono bg-muted/50 px-2 py-1 rounded">
                        {auditLog.sessionId || "N/A"}
                      </div>
                    </div>
                  </div>
                  
                  {auditLog.userAgent && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">User Agent</label>
                      <div className="text-sm font-mono bg-muted/50 px-2 py-1 rounded text-xs">
                        {auditLog.userAgent}
                      </div>
                    </div>
                  )}

                  {auditLog.location && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Geographic Location</label>
                      <div className="text-sm">{auditLog.location}</div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Security Assessment</label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">IP Reputation</span>
                        <Badge variant="outline" className="text-xs">Clean</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">Geographic Risk</span>
                        <Badge variant="outline" className="text-xs">Low</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">Time-based Risk</span>
                        <Badge variant="outline" className="text-xs">Normal</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="context" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contextual Information</CardTitle>
                <CardDescription>
                  Related actions and system context
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLog.duration && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Action Duration</label>
                      <div className="text-sm">{auditLog.duration}ms</div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Related Actions</label>
                    <div className="space-y-2">
                      {auditLog.relatedActions?.map((action, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{action}</span>
                        </div>
                      )) || (
                        <div className="text-sm text-muted-foreground">No related actions</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">System Context</label>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>System Load</span>
                        <span className="text-muted-foreground">Normal</span>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>Database Performance</span>
                        <span className="text-muted-foreground">Optimal</span>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>Network Latency</span>
                        <span className="text-muted-foreground">Low</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
