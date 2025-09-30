import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save, Calendar, Users, Target } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  templateId: string;
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'cancelled';
  type: 'newsletter' | 'promotional' | 'follow-up' | 'announcement' | 'other';
  targetAudience: string[];
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  bouncedCount: number;
  unsubscribedCount: number;
}

interface CampaignFormData {
  name: string;
  subject: string;
  templateId: string;
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'cancelled';
  type: 'newsletter' | 'promotional' | 'follow-up' | 'announcement' | 'other';
  targetAudience: string[];
  scheduledAt?: string;
  createdBy: string;
  totalRecipients: number;
}

interface CampaignFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: Omit<CampaignFormData, 'id'>) => void;
  campaign?: EmailCampaign;
}

const mockTemplates = [
  { id: "1", name: "Welcome Email - New Client" },
  { id: "2", name: "Follow-up - Proposal Sent" },
  { id: "3", name: "Meeting Invitation - Demo" }
];

const audienceOptions = [
  { id: "all_clients", name: "All Clients" },
  { id: "enterprise_clients", name: "Enterprise Clients" },
  { id: "prospects", name: "Prospects" },
  { id: "leads", name: "Leads" },
  { id: "all_subscribers", name: "All Subscribers" },
  { id: "newsletter_subscribers", name: "Newsletter Subscribers" }
];

export function CampaignFormModal({ isOpen, onClose, onSave, campaign }: CampaignFormModalProps) {
  const [formData, setFormData] = useState<CampaignFormData>({
    name: campaign?.name || "",
    subject: campaign?.subject || "",
    templateId: campaign?.templateId || "",
    status: campaign?.status || "draft",
    type: campaign?.type || "newsletter",
    targetAudience: campaign?.targetAudience || [],
    scheduledAt: campaign?.scheduledAt,
    createdBy: campaign?.createdBy || "",
    totalRecipients: campaign?.totalRecipients || 0
  });

  const [newAudience, setNewAudience] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleAddAudience = () => {
    if (newAudience.trim() && !formData.targetAudience.includes(newAudience.trim())) {
      setFormData({
        ...formData,
        targetAudience: [...formData.targetAudience, newAudience.trim()]
      });
      setNewAudience("");
    }
  };

  const handleRemoveAudience = (audienceToRemove: string) => {
    setFormData({
      ...formData,
      targetAudience: formData.targetAudience.filter(audience => audience !== audienceToRemove)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAudience();
    }
  };

  const getAudienceName = (audienceId: string) => {
    const audience = audienceOptions.find(opt => opt.id === audienceId);
    return audience ? audience.name : audienceId;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{campaign ? 'Edit Campaign' : 'Create Email Campaign'}</DialogTitle>
          <DialogDescription>
            {campaign ? 'Update campaign settings' : 'Create a new email marketing campaign'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Campaign Type *</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="templateId">Email Template *</Label>
                <Select value={formData.templateId} onValueChange={(value) => setFormData({ ...formData, templateId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="createdBy">Created By</Label>
                <Input
                  id="createdBy"
                  value={formData.createdBy}
                  onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Target Audience */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Target Audience</h3>
            <div className="space-y-2">
              <Label>Select Audience Segments</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {audienceOptions.map((audience) => (
                  <div key={audience.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={audience.id}
                      checked={formData.targetAudience.includes(audience.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            targetAudience: [...formData.targetAudience, audience.id]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            targetAudience: formData.targetAudience.filter(id => id !== audience.id)
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <Label htmlFor={audience.id} className="text-sm">
                      {audience.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Custom Audience</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom audience segment..."
                  value={newAudience}
                  onChange={(e) => setNewAudience(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button type="button" onClick={handleAddAudience} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.targetAudience.map((audience) => (
                  <Badge key={audience} variant="secondary" className="flex items-center gap-1">
                    {getAudienceName(audience)}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveAudience(audience)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Scheduling</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Schedule Send Date</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalRecipients">Estimated Recipients</Label>
                <Input
                  id="totalRecipients"
                  type="number"
                  min="0"
                  value={formData.totalRecipients}
                  onChange={(e) => setFormData({ ...formData, totalRecipients: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          {/* Campaign Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Campaign Preview</h3>
            <div className="p-4 border rounded-lg bg-muted">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span className="font-medium">Campaign: {formData.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Audience: {formData.targetAudience.length} segments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {formData.scheduledAt 
                      ? `Scheduled: ${new Date(formData.scheduledAt).toLocaleString()}`
                      : 'Send immediately'
                    }
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Subject: {formData.subject}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {campaign ? 'Update Campaign' : 'Create Campaign'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
