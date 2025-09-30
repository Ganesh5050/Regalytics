import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Reply, 
  Forward, 
  Archive, 
  Trash2, 
  Star, 
  Flag,
  Paperclip,
  Clock,
  User,
  Mail,
  Calendar,
  MessageSquare
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Email {
  id: string;
  subject: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  body: string;
  type: 'sent' | 'received' | 'draft' | 'scheduled';
  status: 'read' | 'unread' | 'replied' | 'forwarded' | 'archived';
  priority: 'low' | 'normal' | 'high';
  tags: string[];
  attachments: string[];
  sentAt: string;
  receivedAt?: string;
  relatedTo: string;
  relatedType: 'lead' | 'deal' | 'contact';
  templateId?: string;
  campaignId?: string;
  isStarred: boolean;
  isImportant: boolean;
}

interface EmailDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: Email | null;
  onUpdate: (email: Email) => void;
}

export function EmailDetailsModal({ isOpen, onClose, email, onUpdate }: EmailDetailsModalProps) {
  const [isStarred, setIsStarred] = useState(email?.isStarred || false);

  if (!email) return null;

  const handleStar = () => {
    const newStarred = !isStarred;
    setIsStarred(newStarred);
    onUpdate({ ...email, isStarred: newStarred });
  };

  const handleArchive = () => {
    onUpdate({ ...email, status: 'archived' });
    onClose();
  };

  const handleReply = () => {
    // Open reply modal
    onClose();
  };

  const handleForward = () => {
    // Open forward modal
    onClose();
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'read': 'bg-blue-100 text-blue-800',
      'unread': 'bg-gray-100 text-gray-800',
      'replied': 'bg-green-100 text-green-800',
      'forwarded': 'bg-purple-100 text-purple-800',
      'archived': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'bg-gray-100 text-gray-800',
      'normal': 'bg-blue-100 text-blue-800',
      'high': 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl mb-2">{email.subject}</DialogTitle>
              <DialogDescription>
                {email.type === 'sent' ? 'Sent Email' : 'Received Email'}
              </DialogDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(email.status)}>
                {email.status}
              </Badge>
              <Badge className={getPriorityColor(email.priority)}>
                {email.priority}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleStar}
              >
                <Star className={`h-4 w-4 ${isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            {/* Email Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">From</Label>
                      <p className="text-sm">{email.from}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">To</Label>
                      <p className="text-sm">{email.to.join(', ')}</p>
                    </div>
                    {email.cc && email.cc.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">CC</Label>
                        <p className="text-sm">{email.cc.join(', ')}</p>
                      </div>
                    )}
                    {email.bcc && email.bcc.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">BCC</Label>
                        <p className="text-sm">{email.bcc.join(', ')}</p>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Sent Date</Label>
                      <p className="text-sm">{formatDate(email.sentAt)}</p>
                    </div>
                    {email.receivedAt && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Received Date</Label>
                        <p className="text-sm">{formatDate(email.receivedAt)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Body */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Message Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {email.body}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {email.tags && email.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {email.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleReply}>
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                  <Button variant="outline" onClick={handleForward}>
                    <Forward className="h-4 w-4 mr-2" />
                    Forward
                  </Button>
                  <Button variant="outline" onClick={handleArchive}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                  <Button variant="outline">
                    <Flag className="h-4 w-4 mr-2" />
                    Flag
                  </Button>
                  <Button variant="outline">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Email Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Email Type</Label>
                      <p className="text-sm">{email.type}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge className={getStatusColor(email.status)}>
                        {email.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Priority</Label>
                      <Badge className={getPriorityColor(email.priority)}>
                        {email.priority}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Starred</Label>
                      <p className="text-sm">{email.isStarred ? 'Yes' : 'No'}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Important</Label>
                      <p className="text-sm">{email.isImportant ? 'Yes' : 'No'}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Related To</Label>
                      <p className="text-sm">{email.relatedType} #{email.relatedTo}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Email sent</p>
                        <p className="text-xs text-muted-foreground">{formatDate(email.sentAt)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {email.type === 'sent' ? 'Email was sent' : 'Email was received'}
                      </p>
                    </div>
                  </div>
                  {email.receivedAt && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Email received</p>
                          <p className="text-xs text-muted-foreground">{formatDate(email.receivedAt)}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Email was delivered to recipient
                        </p>
                      </div>
                    </div>
                  )}
                  {email.status === 'replied' && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Reply sent</p>
                          <p className="text-xs text-muted-foreground">Recently</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Recipient replied to this email
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attachments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Paperclip className="h-5 w-5 mr-2" />
                  Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {email.attachments && email.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {email.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{attachment}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            Download
                          </Button>
                          <Button size="sm" variant="outline">
                            Preview
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No attachments found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
