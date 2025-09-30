import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  User,
  Calendar,
  DollarSign,
  Shield,
  FileText,
  TrendingUp,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

interface Alert {
  id: string;
  severity: string;
  title: string;
  description: string;
  client: string;
  amount: string;
  timestamp: string;
  status: string;
  assignedTo: string;
  riskScore: number;
  location?: string;
  ipAddress?: string;
  transactionId?: string;
  complianceFlags?: string[];
  notes?: string;
}

interface AlertDetailModalProps {
  alert: Alert;
  onUpdate: (alertId: string, updates: Partial<Alert>) => void;
  onClose: () => void;
}

export function AlertDetailModal({ alert, onUpdate, onClose }: AlertDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAlert, setEditedAlert] = useState<Alert>(alert);

  const handleSave = () => {
    onUpdate(alert.id, editedAlert);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedAlert(alert);
    setIsEditing(false);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'HIGH': return { variant: "destructive" as const, label: "High Priority", icon: AlertTriangle };
      case 'MEDIUM': return { variant: "secondary" as const, label: "Medium Priority", icon: Clock };
      default: return { variant: "outline" as const, label: "Low Priority", icon: CheckCircle };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open': return { variant: "destructive" as const, label: "Open", icon: AlertTriangle };
      case 'Investigating': return { variant: "secondary" as const, label: "Investigating", icon: Clock };
      case 'Resolved': return { variant: "outline" as const, label: "Resolved", icon: CheckCircle };
      default: return { variant: "outline" as const, label: status, icon: CheckCircle };
    }
  };

  const severityBadge = getSeverityBadge(alert.severity);
  const statusBadge = getStatusBadge(alert.status);
  const SeverityIcon = severityBadge.icon;
  const StatusIcon = statusBadge.icon;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const timestamp = formatTimestamp(alert.timestamp);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <SeverityIcon className="h-6 w-6" />
                {alert.title}
              </DialogTitle>
              <DialogDescription className="text-base">
                Alert ID: {alert.id} • {timestamp.date} at {timestamp.time}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-primary hover:bg-primary-hover text-primary-foreground"
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="investigation">Investigation</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Alert Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Alert Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Severity</span>
                    <Badge variant={severityBadge.variant}>{severityBadge.label}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Risk Score</span>
                    <span className="font-bold text-lg text-warning">{alert.riskScore}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Amount</span>
                    <span className="font-semibold">{alert.amount}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Client Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Client Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{alert.client}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{timestamp.date} at {timestamp.time}</span>
                  </div>

                  {alert.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{alert.location}</span>
                    </div>
                  )}

                  {alert.ipAddress && (
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-mono">{alert.ipAddress}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{alert.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alert Details</CardTitle>
                <CardDescription>
                  Complete alert information and metadata
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Alert ID</Label>
                      <Input value={alert.id} readOnly className="font-mono" />
                    </div>
                    <div className="space-y-2">
                      <Label>Transaction ID</Label>
                      <Input value={alert.transactionId || "N/A"} readOnly />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    {isEditing ? (
                      <Textarea 
                        value={editedAlert.description}
                        onChange={(e) => setEditedAlert({ ...editedAlert, description: e.target.value })}
                        rows={3}
                      />
                    ) : (
                      <Textarea 
                        value={alert.description} 
                        readOnly 
                        rows={3}
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Severity</Label>
                      {isEditing ? (
                        <Select value={editedAlert.severity} onValueChange={(value) => setEditedAlert({ ...editedAlert, severity: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="LOW">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input value={alert.severity} readOnly />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      {isEditing ? (
                        <Select value={editedAlert.status} onValueChange={(value) => setEditedAlert({ ...editedAlert, status: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="Investigating">Investigating</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input value={alert.status} readOnly />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Assigned To</Label>
                      {isEditing ? (
                        <Select value={editedAlert.assignedTo} onValueChange={(value) => setEditedAlert({ ...editedAlert, assignedTo: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                            <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                            <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                            <SelectItem value="David Chen">David Chen</SelectItem>
                            <SelectItem value="Lisa Rodriguez">Lisa Rodriguez</SelectItem>
                            <SelectItem value="Unassigned">Unassigned</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input value={alert.assignedTo} readOnly />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investigation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Investigation Notes</CardTitle>
                <CardDescription>
                  Investigation progress and findings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Investigation Notes</Label>
                    {isEditing ? (
                      <Textarea 
                        placeholder="Add investigation notes..."
                        value={editedAlert.notes || ''}
                        onChange={(e) => setEditedAlert({ ...editedAlert, notes: e.target.value })}
                        rows={6}
                      />
                    ) : (
                      <Textarea 
                        value={alert.notes || "No investigation notes available"} 
                        readOnly 
                        rows={6}
                      />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Investigation Timeline</Label>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>Alert Created</span>
                        <span className="text-muted-foreground">{timestamp.date} {timestamp.time}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>Assigned To</span>
                        <span className="text-muted-foreground">{alert.assignedTo}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>Current Status</span>
                        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compliance Information</CardTitle>
                <CardDescription>
                  Regulatory compliance and audit information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Compliance Status</Label>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm">Under Review</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Audit Trail</Label>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Available</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Compliance Flags</Label>
                    <div className="flex flex-wrap gap-2">
                      {alert.complianceFlags?.map((flag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {flag}
                        </Badge>
                      )) || (
                        <Badge variant="outline" className="text-xs">
                          No flags
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Regulatory Requirements</Label>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>AML Screening</span>
                        <CheckCircle className="h-4 w-4 text-success" />
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>Transaction Monitoring</span>
                        <CheckCircle className="h-4 w-4 text-success" />
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>Risk Assessment</span>
                        <CheckCircle className="h-4 w-4 text-success" />
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
