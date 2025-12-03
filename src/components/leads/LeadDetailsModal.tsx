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
  Trash2, 
  Star,
  Building,
  User,
  DollarSign,
  Target,
  Clock,
  MessageSquare
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  score: number;
  value: number;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  notes: string;
  tags: string[];
}

interface LeadDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onUpdate: (lead: Lead) => void;
}

export function LeadDetailsModal({ isOpen, onClose, lead, onUpdate }: LeadDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<Lead | null>(null);

  if (!lead) return null;

  const handleEdit = () => {
    setEditedLead({ ...lead });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedLead) {
      onUpdate(editedLead);
      setIsEditing(false);
      setEditedLead(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedLead(null);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'qualified': 'bg-green-100 text-green-800',
      'proposal': 'bg-purple-100 text-purple-800',
      'negotiation': 'bg-orange-100 text-orange-800',
      'closed-won': 'bg-emerald-100 text-emerald-800',
      'closed-lost': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const currentLead = isEditing ? editedLead : lead;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{currentLead?.name}</DialogTitle>
              <DialogDescription>
                {currentLead?.title} at {currentLead?.company}
              </DialogDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(currentLead?.status || '')}>
                {currentLead?.status?.replace('-', ' ')}
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
                    <Label>Full Name</Label>
                    {isEditing ? (
                      <Input
                        value={currentLead?.name || ''}
                        onChange={(e) => setEditedLead({ ...currentLead!, name: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm font-medium">{currentLead?.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    {isEditing ? (
                      <Input
                        value={currentLead?.email || ''}
                        onChange={(e) => setEditedLead({ ...currentLead!, email: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <p className="text-sm">{currentLead?.email}</p>
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
                        value={currentLead?.phone || ''}
                        onChange={(e) => setEditedLead({ ...currentLead!, phone: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <p className="text-sm">{currentLead?.phone}</p>
                        <Button size="sm" variant="ghost">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    {isEditing ? (
                      <Input
                        value={currentLead?.title || ''}
                        onChange={(e) => setEditedLead({ ...currentLead!, title: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{currentLead?.title}</p>
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
                        value={currentLead?.company || ''}
                        onChange={(e) => setEditedLead({ ...currentLead!, company: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm font-medium">{currentLead?.company}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Lead Source</Label>
                    {isEditing ? (
                      <Input
                        value={currentLead?.source || ''}
                        onChange={(e) => setEditedLead({ ...currentLead!, source: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{currentLead?.source}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Assigned To</Label>
                    {isEditing ? (
                      <Input
                        value={currentLead?.assignedTo || ''}
                        onChange={(e) => setEditedLead({ ...currentLead!, assignedTo: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{currentLead?.assignedTo}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Created Date</Label>
                    <p className="text-sm">{currentLead?.createdAt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lead Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Lead Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="text-2xl font-bold">{currentLead?.score}</div>
                    <div className="text-sm text-muted-foreground">Lead Score</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold">${currentLead?.value?.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Deal Value</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold">{currentLead?.lastContact}</div>
                    <div className="text-sm text-muted-foreground">Last Contact</div>
                  </div>
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
                  {currentLead?.tags?.map((tag) => (
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
                        <p className="text-sm font-medium">Lead created</p>
                        <p className="text-xs text-muted-foreground">{currentLead?.createdAt}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Lead was created from {currentLead?.source}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Status updated</p>
                        <p className="text-xs text-muted-foreground">{currentLead?.lastContact}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Status changed to {currentLead?.status}
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
                    value={currentLead?.notes || ''}
                    onChange={(e) => setEditedLead({ ...currentLead!, notes: e.target.value })}
                    rows={6}
                    placeholder="Add notes about this lead..."
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{currentLead?.notes || 'No notes available'}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
