import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'welcome' | 'follow-up' | 'proposal' | 'meeting' | 'contract' | 'other';
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  usageCount: number;
  lastUsed?: string;
}

interface TemplateFormData {
  name: string;
  subject: string;
  body: string;
  category: 'welcome' | 'follow-up' | 'proposal' | 'meeting' | 'contract' | 'other';
  tags: string[];
  isActive: boolean;
  createdBy: string;
}

interface TemplateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Omit<TemplateFormData, 'id'>) => void;
  template?: EmailTemplate;
}

export function TemplateFormModal({ isOpen, onClose, onSave, template }: TemplateFormModalProps) {
  const [formData, setFormData] = useState<TemplateFormData>({
    name: template?.name || "",
    subject: template?.subject || "",
    body: template?.body || "",
    category: template?.category || "other",
    tags: template?.tags || [],
    isActive: template?.isActive ?? true,
    createdBy: template?.createdBy || ""
  });

  const [newTag, setNewTag] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const processTemplate = (text: string) => {
    // Replace template variables with sample data
    return text
      .replace(/\{\{client_name\}\}/g, 'John Smith')
      .replace(/\{\{contact_name\}\}/g, 'Emily Davis')
      .replace(/\{\{sender_name\}\}/g, 'Sarah Johnson')
      .replace(/\{\{product_name\}\}/g, 'Regalytics Compliance Suite')
      .replace(/\{\{company_name\}\}/g, 'TechCorp Solutions');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template ? 'Edit Template' : 'Create Email Template'}</DialogTitle>
          <DialogDescription>
            {template ? 'Update template content' : 'Create a new email template for your communications'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isActive" className="text-sm">
                    Active
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Email Content */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Email Content</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject Line *</Label>
              {previewMode ? (
                <div className="p-3 border rounded-lg bg-muted">
                  <p className="text-sm">{processTemplate(formData.subject)}</p>
                </div>
              ) : (
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Email Body *</Label>
              {previewMode ? (
                <div className="p-4 border rounded-lg bg-muted min-h-[200px]">
                  <div className="whitespace-pre-wrap text-sm">
                    {processTemplate(formData.body)}
                  </div>
                </div>
              ) : (
                <Textarea
                  id="body"
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  rows={12}
                  required
                  placeholder="Enter your email template content here..."
                />
              )}
            </div>
          </div>

          {/* Template Variables */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Available Variables</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { variable: '{{client_name}}', description: 'Client name' },
                { variable: '{{contact_name}}', description: 'Contact name' },
                { variable: '{{sender_name}}', description: 'Sender name' },
                { variable: '{{product_name}}', description: 'Product name' },
                { variable: '{{company_name}}', description: 'Company name' },
                { variable: '{{date}}', description: 'Current date' }
              ].map((item) => (
                <div key={item.variable} className="p-2 border rounded text-xs">
                  <code className="font-mono bg-muted px-1 rounded">{item.variable}</code>
                  <p className="text-muted-foreground mt-1">{item.description}</p>
                </div>
              ))}
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
                  onKeyPress={handleKeyPress}
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {template ? 'Update Template' : 'Create Template'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
