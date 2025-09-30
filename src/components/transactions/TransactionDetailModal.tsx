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
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  TrendingUp,
  Shield,
  User,
  Calendar,
  DollarSign,
  CreditCard,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

interface Transaction {
  id: string;
  client: string;
  type: string;
  amount: number;
  currency: string;
  date: string;
  time: string;
  status: string;
  suspicious: boolean;
  method: string;
  description?: string;
  reference?: string;
  location?: string;
  ipAddress?: string;
  riskScore?: number;
  complianceFlags?: string[];
}

interface TransactionDetailModalProps {
  transaction: Transaction;
  onUpdate: (transactionId: string, updates: Partial<Transaction>) => void;
  onClose: () => void;
}

export function TransactionDetailModal({ transaction, onUpdate, onClose }: TransactionDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState<Transaction>(transaction);

  const handleSave = () => {
    onUpdate(transaction.id, editedTransaction);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTransaction(transaction);
    setIsEditing(false);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string, suspicious: boolean) => {
    if (suspicious) return { variant: "destructive" as const, label: "Suspicious", icon: AlertTriangle };
    if (status === "Cleared") return { variant: "outline" as const, label: "Cleared", icon: CheckCircle };
    if (status === "Flagged") return { variant: "destructive" as const, label: "Flagged", icon: AlertTriangle };
    return { variant: "secondary" as const, label: status, icon: Clock };
  };

  const statusBadge = getStatusBadge(transaction.status, transaction.suspicious);
  const StatusIcon = statusBadge.icon;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <StatusIcon className="h-6 w-6" />
                Transaction {transaction.id}
              </DialogTitle>
              <DialogDescription className="text-base">
                {transaction.client} • {transaction.date} at {transaction.time}
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
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transaction Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Transaction Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Amount</span>
                    <span className="font-bold text-xl">{formatAmount(transaction.amount)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Type</span>
                    <Badge variant={transaction.type === "Credit" ? "outline" : "secondary"}>
                      {transaction.type}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Method</span>
                    <span className="text-sm">{transaction.method}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
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
                    <span className="font-medium">{transaction.client}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{transaction.date} at {transaction.time}</span>
                  </div>

                  {transaction.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{transaction.location}</span>
                    </div>
                  )}

                  {transaction.ipAddress && (
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-mono">{transaction.ipAddress}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transaction Details</CardTitle>
                <CardDescription>
                  Complete transaction information and metadata
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Transaction ID</Label>
                      <Input value={transaction.id} readOnly className="font-mono" />
                    </div>
                    <div className="space-y-2">
                      <Label>Reference Number</Label>
                      <Input value={transaction.reference || "N/A"} readOnly />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      value={transaction.description || "No description available"} 
                      readOnly 
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Input value={transaction.currency} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input value={transaction.date} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input value={transaction.time} readOnly />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Risk Analysis</CardTitle>
                <CardDescription>
                  Risk assessment and suspicious activity indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">{transaction.riskScore || 75}</div>
                      <div className="text-sm text-muted-foreground">Risk Score</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-warning">85</div>
                      <div className="text-sm text-muted-foreground">Amount Risk</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-success">65</div>
                      <div className="text-sm text-muted-foreground">Pattern Risk</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Risk Factors</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">High-value transaction</span>
                        <Badge variant="destructive" className="text-xs">High Impact</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">Unusual timing</span>
                        <Badge variant="secondary" className="text-xs">Medium Impact</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">Geographic anomaly</span>
                        <Badge variant="outline" className="text-xs">Low Impact</Badge>
                      </div>
                    </div>
                  </div>

                  {transaction.suspicious && (
                    <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                      <div className="flex items-center gap-2 text-destructive font-medium">
                        <AlertTriangle className="h-4 w-4" />
                        Suspicious Activity Detected
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        This transaction has been flagged for manual review due to multiple risk factors.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compliance Check</CardTitle>
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
                        <span className="text-sm">Compliant</span>
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
                      {transaction.complianceFlags?.map((flag, index) => (
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
                        <span>KYC Verification</span>
                        <CheckCircle className="h-4 w-4 text-success" />
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>AML Screening</span>
                        <CheckCircle className="h-4 w-4 text-success" />
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>Transaction Monitoring</span>
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
