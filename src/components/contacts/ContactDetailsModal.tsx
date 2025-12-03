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
  Building,
  User,
  MapPin,
  Globe,
  MessageSquare,
  Clock,
  Star
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  department: string;
  address: string;
  city: string;
  state: string;
  country: string;
  website: string;
  source: string;
  status: 'active' | 'inactive' | 'prospect' | 'customer' | 'vendor';
  tags: string[];
  notes: string;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  totalInteractions: number;
  lastInteraction: string;
  preferredContact: 'email' | 'phone' | 'sms';
  timezone: string;
  language: string;
}

interface ContactDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  onUpdate: (contact: Contact) => void;
}

export function ContactDetailsModal({ isOpen, onClose, contact, onUpdate }: ContactDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContact, setEditedContact] = useState<Contact | null>(null);

  if (!contact) return null;

  const handleEdit = () => {
    setEditedContact({ ...contact });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedContact) {
      onUpdate(editedContact);
      setIsEditing(false);
      setEditedContact(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContact(null);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'prospect': 'bg-blue-100 text-blue-800',
      'customer': 'bg-emerald-100 text-emerald-800',
      'vendor': 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const currentContact = isEditing ? editedContact : contact;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold">
                  {currentContact?.firstName[0]}{currentContact?.lastName[0]}
                </span>
              </div>
              <div>
                <DialogTitle className="text-2xl">
                  {currentContact?.firstName} {currentContact?.lastName}
                </DialogTitle>
                <DialogDescription>
                  {currentContact?.title} at {currentContact?.company}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(currentContact?.status || '')}>
                {currentContact?.status}
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
            <TabsTrigger value="communication">Communication</TabsTrigger>
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
                    <Label>First Name</Label>
                    {isEditing ? (
                      <Input
                        value={currentContact?.firstName || ''}
                        onChange={(e) => setEditedContact({ ...currentContact!, firstName: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm font-medium">{currentContact?.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    {isEditing ? (
                      <Input
                        value={currentContact?.lastName || ''}
                        onChange={(e) => setEditedContact({ ...currentContact!, lastName: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm font-medium">{currentContact?.lastName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    {isEditing ? (
                      <Input
                        value={currentContact?.email || ''}
                        onChange={(e) => setEditedContact({ ...currentContact!, email: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <p className="text-sm">{currentContact?.email}</p>
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
                        value={currentContact?.phone || ''}
                        onChange={(e) => setEditedContact({ ...currentContact!, phone: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <p className="text-sm">{currentContact?.phone}</p>
                        <Button size="sm" variant="ghost">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Contact</Label>
                    <p className="text-sm">{currentContact?.preferredContact}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Assigned To</Label>
                    {isEditing ? (
                      <Input
                        value={currentContact?.assignedTo || ''}
                        onChange={(e) => setEditedContact({ ...currentContact!, assignedTo: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{currentContact?.assignedTo}</p>
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
                        value={currentContact?.company || ''}
                        onChange={(e) => setEditedContact({ ...currentContact!, company: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm font-medium">{currentContact?.company}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    {isEditing ? (
                      <Input
                        value={currentContact?.title || ''}
                        onChange={(e) => setEditedContact({ ...currentContact!, title: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{currentContact?.title}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    {isEditing ? (
                      <Input
                        value={currentContact?.department || ''}
                        onChange={(e) => setEditedContact({ ...currentContact!, department: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{currentContact?.department}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    {isEditing ? (
                      <Input
                        value={currentContact?.website || ''}
                        onChange={(e) => setEditedContact({ ...currentContact!, website: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <p className="text-sm">{currentContact?.website}</p>
                        <Button size="sm" variant="ghost">
                          <Globe className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Source</Label>
                    <p className="text-sm">{currentContact?.source}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Created Date</Label>
                    <p className="text-sm">{currentContact?.createdAt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Address</Label>
                    {isEditing ? (
                      <Input
                        value={currentContact?.address || ''}
                        onChange={(e) => setEditedContact({ ...currentContact!, address: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{currentContact?.address}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    {isEditing ? (
                      <Input
                        value={currentContact?.city || ''}
                        onChange={(e) => setEditedContact({ ...currentContact!, city: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{currentContact?.city}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>State/Province</Label>
                    {isEditing ? (
                      <Input
                        value={currentContact?.state || ''}
                        onChange={(e) => setEditedContact({ ...currentContact!, state: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{currentContact?.state}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <p className="text-sm">{currentContact?.country}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <p className="text-sm">{currentContact?.timezone}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <p className="text-sm">{currentContact?.language}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interaction Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Interaction Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold">{currentContact?.totalInteractions}</div>
                    <div className="text-sm text-muted-foreground">Total Interactions</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold">{currentContact?.lastContact}</div>
                    <div className="text-sm text-muted-foreground">Last Contact</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="text-2xl font-bold">{currentContact?.lastInteraction}</div>
                    <div className="text-sm text-muted-foreground">Last Interaction</div>
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
                  {currentContact?.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Communication History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Contact created</p>
                        <p className="text-xs text-muted-foreground">{currentContact?.createdAt}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Contact was created from {currentContact?.source}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Last interaction</p>
                        <p className="text-xs text-muted-foreground">{currentContact?.lastInteraction}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Total interactions: {currentContact?.totalInteractions}
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
                    value={currentContact?.notes || ''}
                    onChange={(e) => setEditedContact({ ...currentContact!, notes: e.target.value })}
                    rows={6}
                    placeholder="Add notes about this contact..."
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{currentContact?.notes || 'No notes available'}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
