import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Paperclip, Send, Save, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EmailFormData {
  subject: string;
  to: string[];
  cc: string[];
  bcc: string[];
  body: string;
  priority: 'low' | 'normal' | 'high';
  tags: string[];
  attachments: string[];
  relatedTo: string;
  relatedType: 'lead' | 'deal' | 'contact';
  templateId?: string;
  campaignId?: string;
  isScheduled: boolean;
  scheduledAt?: string;
}

interface EmailFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (email: Omit<EmailFormData, 'id'>) => void;
  email?: EmailFormData;
  replyTo?: string;
  forwardSubject?: string;
}

export function EmailFormModal({ isOpen, onClose, onSave, email, replyTo, forwardSubject }: EmailFormModalProps) {
  const [formData, setFormData] = useState<EmailFormData>({
    subject: email?.subject || forwardSubject || "",
    to: email?.to || (replyTo ? [replyTo] : []),
    cc: email?.cc || [],
    bcc: email?.bcc || [],
    body: email?.body || "",
    priority: email?.priority || "normal",
    tags: email?.tags || [],
    attachments: email?.attachments || [],
    relatedTo: email?.relatedTo || "",
    relatedType: email?.relatedType || "contact",
    templateId: email?.templateId,
    campaignId: email?.campaignId,
    isScheduled: email?.isScheduled || false,
    scheduledAt: email?.scheduledAt
  });

  const [newTag, setNewTag] = useState("");
  const [newTo, setNewTo] = useState("");
  const [newCc, setNewCc] = useState("");
  const [newBcc, setNewBcc] = useState("");
  const [newAttachment, setNewAttachment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleAddTo = () => {
    if (newTo.trim() && !formData.to.includes(newTo.trim())) {
      setFormData({
        ...formData,
        to: [...formData.to, newTo.trim()]
      });
      setNewTo("");
    }
  };

  const handleRemoveTo = (emailToRemove: string) => {
    setFormData({
      ...formData,
      to: formData.to.filter(email => email !== emailToRemove)
    });
  };

  const handleAddCc = () => {
    if (newCc.trim() && !formData.cc.includes(newCc.trim())) {
      setFormData({
        ...formData,
        cc: [...formData.cc, newCc.trim()]
      });
      setNewCc("");
    }
  };

  const handleRemoveCc = (emailToRemove: string) => {
    setFormData({
      ...formData,
      cc: formData.cc.filter(email => email !== emailToRemove)
    });
  };

  const handleAddBcc = () => {
    if (newBcc.trim() && !formData.bcc.includes(newBcc.trim())) {
      setFormData({
        ...formData,
        bcc: [...formData.bcc, newBcc.trim()]
      });
      setNewBcc("");
    }
  };

  const handleRemoveBcc = (emailToRemove: string) => {
    setFormData({
      ...formData,
      bcc: formData.bcc.filter(email => email !== emailToRemove)
    });
  };

  const handleAddAttachment = () => {
    if (newAttachment.trim() && !formData.attachments.includes(newAttachment.trim())) {
      setFormData({
        ...formData,
        attachments: [...formData.attachments, newAttachment.trim()]
      });
      setNewAttachment("");
    }
  };

  const handleRemoveAttachment = (attachmentToRemove: string) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter(attachment => attachment !== attachmentToRemove)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{email ? 'Edit Email' : 'Compose Email'}</DialogTitle>
          <DialogDescription>
            {email ? 'Update email content' : 'Create and send a new email'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipients */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recipients</h3>
            
            {/* To */}
            <div className="space-y-2">
              <Label>To *</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email address..."
                  value={newTo}
                  onChange={(e) => setNewTo(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleAddTo)}
                />
                <Button type="button" onClick={handleAddTo} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.to.map((email) => (
                  <Badge key={email} variant="secondary" className="flex items-center gap-1">
                    {email}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTo(email)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* CC */}
            <div className="space-y-2">
              <Label>CC</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter CC email address..."
                  value={newCc}
                  onChange={(e) => setNewCc(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleAddCc)}
                />
                <Button type="button" onClick={handleAddCc} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.cc.map((email) => (
                  <Badge key={email} variant="outline" className="flex items-center gap-1">
                    {email}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveCc(email)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* BCC */}
            <div className="space-y-2">
              <Label>BCC</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter BCC email address..."
                  value={newBcc}
                  onChange={(e) => setNewBcc(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleAddBcc)}
                />
                <Button type="button" onClick={handleAddBcc} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.bcc.map((email) => (
                  <Badge key={email} variant="outline" className="flex items-center gap-1">
                    {email}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveBcc(email)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>

          {/* Email Body */}
          <div className="space-y-2">
            <Label htmlFor="body">Message *</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              rows={12}
              required
              placeholder="Type your message here..."
            />
          </div>

          {/* Email Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Email Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="relatedType">Related To</Label>
                <Select value={formData.relatedType} onValueChange={(value: any) => setFormData({ ...formData, relatedType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="deal">Deal</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="relatedTo">Related ID</Label>
                <Input
                  id="relatedTo"
                  value={formData.relatedTo}
                  onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value })}
                  placeholder="Enter lead, deal, or contact ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Schedule Send</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value, isScheduled: !!e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Tags</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleAddTag)}
                />
                <Button type="button" onClick={handleAddTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Attachments</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add attachment..."
                  value={newAttachment}
                  onChange={(e) => setNewAttachment(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleAddAttachment)}
                />
                <Button type="button" onClick={handleAddAttachment} size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.attachments.map((attachment) => (
                  <Badge key={attachment} variant="outline" className="flex items-center gap-1">
                    <Paperclip className="h-3 w-3" />
                    {attachment}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveAttachment(attachment)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button type="button" variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              {formData.isScheduled && (
                <Button type="button" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                {formData.isScheduled ? 'Schedule Send' : 'Send'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
