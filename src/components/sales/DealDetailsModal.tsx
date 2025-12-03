import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, 
  Mail, 
  Calendar, 
  Edit, 
  DollarSign,
  Target,
  Building,
  User,
  Clock,
  MessageSquare,
  Package
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Deal {
  id: string;
  name: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  source: string;
  createdAt: string;
  lastActivity: string;
  notes: string;
  tags: string[];
  products: string[];
}

interface DealDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
  onUpdate: (deal: Deal) => void;
}

export function DealDetailsModal({ isOpen, onClose, deal, onUpdate }: DealDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDeal, setEditedDeal] = useState<Deal | null>(null);

  if (!deal) return null;

  const handleEdit = () => {
    setEditedDeal({ ...deal });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedDeal) {
      onUpdate(editedDeal);
      setIsEditing(false);
      setEditedDeal(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedDeal(null);
  };

  const getStageColor = (stage: string) => {
    const colors = {
      'prospecting': 'bg-blue-100 text-blue-800',
      'qualification': 'bg-yellow-100 text-yellow-800',
      'proposal': 'bg-green-100 text-green-800',
      'negotiation': 'bg-orange-100 text-orange-800',
      'closed-won': 'bg-emerald-100 text-emerald-800',
      'closed-lost': 'bg-red-100 text-red-800'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const currentDeal = isEditing ? editedDeal : deal;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{currentDeal?.name}</DialogTitle>
              <DialogDescription>
                {currentDeal?.company} • {currentDeal?.contact}
              </DialogDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStageColor(currentDeal?.stage || '')}>
                {currentDeal?.stage?.replace('-', ' ')}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={isEditing ? handleSave : handleEdit}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Save' : 'Edit'}
              </Button>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Deal Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Deal Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold">${currentDeal?.value?.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Deal Value</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Target className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold">{currentDeal?.probability}%</div>
                    <div className="text-sm text-muted-foreground">Probability</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Calendar className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold">{currentDeal?.expectedCloseDate}</div>
                    <div className="text-sm text-muted-foreground">Expected Close</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Contact Name</Label>
                    {isEditing ? (
                      <Input
                        value={currentDeal?.contact || ''}
                        onChange={(e) => setEditedDeal({ ...currentDeal!, contact: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm font-medium">{currentDeal?.contact}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    {isEditing ? (
                      <Input
                        value={currentDeal?.email || ''}
                        onChange={(e) => setEditedDeal({ ...currentDeal!, email: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <p className="text-sm">{currentDeal?.email}</p>
                        <Button size="sm" variant="ghost">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    {isEditing ? (
                      <Input
                        value={currentDeal?.phone || ''}
                        onChange={(e) => setEditedDeal({ ...currentDeal!, phone: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <p className="text-sm">{currentDeal?.phone}</p>
                        <Button size="sm" variant="ghost">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Assigned To</Label>
                    {isEditing ? (
                      <Input
                        value={currentDeal?.assignedTo || ''}
                        onChange={(e) => setEditedDeal({ ...currentDeal!, assignedTo: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{currentDeal?.assignedTo}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company</Label>
                    {isEditing ? (
                      <Input
                        value={currentDeal?.company || ''}
                        onChange={(e) => setEditedDeal({ ...currentDeal!, company: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm font-medium">{currentDeal?.company}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Lead Source</Label>
                    {isEditing ? (
                      <Input
                        value={currentDeal?.source || ''}
                        onChange={(e) => setEditedDeal({ ...currentDeal!, source: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{currentDeal?.source}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Created Date</Label>
                    <p className="text-sm">{currentDeal?.createdAt}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Last Activity</Label>
                    <p className="text-sm">{currentDeal?.lastActivity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products/Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Products/Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentDeal?.products?.map((product) => (
                    <Badge key={product} variant="secondary">
                      {product}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentDeal?.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Deal created</p>
                        <p className="text-xs text-muted-foreground">{currentDeal?.createdAt}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Deal was created from {currentDeal?.source}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Stage updated</p>
                        <p className="text-xs text-muted-foreground">{currentDeal?.lastActivity}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Stage changed to {currentDeal?.stage}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={currentDeal?.notes || ''}
                    onChange={(e) => setEditedDeal({ ...currentDeal!, notes: e.target.value })}
                    rows={6}
                    placeholder="Add notes about this deal..."
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{currentDeal?.notes || 'No notes available'}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
