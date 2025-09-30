import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Eye, 
  Edit, 
  Save, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  TrendingUp,
  Shield
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  pan: string;
  aadhaar: string;
  riskScore: number;
  kycStatus: string;
  lastUpdate: string;
  email?: string;
  phone?: string;
  address?: string;
  businessType?: string;
  registrationDate?: string;
  complianceScore?: number;
}

interface ClientDetailModalProps {
  client: Client;
  onUpdate: (clientId: string, updates: Partial<Client>) => void;
  onClose: () => void;
}

export function ClientDetailModal({ client, onUpdate, onClose }: ClientDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<Client>(client);

  const handleSave = () => {
    onUpdate(client.id, editedClient);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedClient(client);
    setIsEditing(false);
  };

  const getRiskBadge = (score: number) => {
    if (score >= 90) return { variant: "destructive" as const, label: "High Risk", icon: AlertTriangle };
    if (score >= 70) return { variant: "secondary" as const, label: "Medium Risk", icon: Clock };
    return { variant: "outline" as const, label: "Low Risk", icon: CheckCircle };
  };

  const getKYCBadge = (status: string) => {
    if (status === "Complete") return { variant: "outline" as const, label: "Complete", icon: CheckCircle };
    if (status === "Pending") return { variant: "secondary" as const, label: "Pending", icon: Clock };
    return { variant: "destructive" as const, label: "Incomplete", icon: AlertTriangle };
  };

  const riskBadge = getRiskBadge(client.riskScore);
  const kycBadge = getKYCBadge(client.kycStatus);
  const RiskIcon = riskBadge.icon;
  const KYCIcon = kycBadge.icon;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">{client.name}</DialogTitle>
              <DialogDescription className="text-base">
                Client ID: {client.id} • Last Updated: {client.lastUpdate}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-primary hover:bg-primary-hover text-primary-foreground"
                  >
                    <Save className="h-4 w-4 mr-2" />
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
            <TabsTrigger value="kyc">KYC Details</TabsTrigger>
            <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editedClient.name}
                        onChange={(e) => setEditedClient({ ...editedClient, name: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm font-medium">{client.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pan">PAN Number</Label>
                    {isEditing ? (
                      <Input
                        id="pan"
                        value={editedClient.pan}
                        onChange={(e) => setEditedClient({ ...editedClient, pan: e.target.value })}
                      />
                    ) : (
                      <code className="text-sm bg-muted/50 px-2 py-1 rounded">{client.pan}</code>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadhaar">Aadhaar Number</Label>
                    {isEditing ? (
                      <Input
                        id="aadhaar"
                        value={editedClient.aadhaar}
                        onChange={(e) => setEditedClient({ ...editedClient, aadhaar: e.target.value })}
                      />
                    ) : (
                      <code className="text-sm bg-muted/50 px-2 py-1 rounded">{client.aadhaar}</code>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RiskIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">Risk Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{client.riskScore}</span>
                      <Badge variant={riskBadge.variant}>{riskBadge.label}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <KYCIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">KYC Status</span>
                    </div>
                    <Badge variant={kycBadge.variant}>{kycBadge.label}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-medium">Compliance Score</span>
                    </div>
                    <span className="font-bold text-lg text-success">
                      {client.complianceScore || 98.2}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="kyc" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">KYC Documentation</CardTitle>
                <CardDescription>
                  Know Your Customer verification details and document status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Document Status</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">PAN Verification</span>
                          <Badge variant="outline" className="text-xs">Verified</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Aadhaar Verification</span>
                          <Badge variant="outline" className="text-xs">Verified</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Address Proof</span>
                          <Badge variant="secondary" className="text-xs">Pending</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Business Registration</span>
                          <Badge variant="outline" className="text-xs">Verified</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Verification Timeline</Label>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div>Initial Registration: {client.registrationDate || "2024-01-01"}</div>
                        <div>Last KYC Update: {client.lastUpdate}</div>
                        <div>Next Review Due: 2024-07-01</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Risk Assessment</CardTitle>
                <CardDescription>
                  Detailed risk analysis and scoring breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">{client.riskScore}</div>
                      <div className="text-sm text-muted-foreground">Overall Risk Score</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-warning">75</div>
                      <div className="text-sm text-muted-foreground">Transaction Risk</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-success">85</div>
                      <div className="text-sm text-muted-foreground">Compliance Risk</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Risk Factors</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">High-value transactions</span>
                        <Badge variant="destructive" className="text-xs">High Impact</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">Geographic risk</span>
                        <Badge variant="secondary" className="text-xs">Medium Impact</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">Business type risk</span>
                        <Badge variant="outline" className="text-xs">Low Impact</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
                <CardDescription>
                  Latest transaction activity for this client
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">TXN001</div>
                      <div className="text-sm text-muted-foreground">Credit • 2024-01-15</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹8,50,000</div>
                      <Badge variant="outline" className="text-xs">Cleared</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">TXN002</div>
                      <div className="text-sm text-muted-foreground">Debit • 2024-01-14</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹3,20,000</div>
                      <Badge variant="secondary" className="text-xs">Pending</Badge>
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
