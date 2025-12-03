import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save, Upload, Link } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DocumentFormData {
  name: string;
  description: string;
  type: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx' | 'txt' | 'image' | 'other';
  category: 'contract' | 'proposal' | 'report' | 'presentation' | 'legal' | 'financial' | 'other';
  url: string;
  tags: string[];
  isPublic: boolean;
  isStarred: boolean;
  isLocked: boolean;
  version: string;
  uploadedBy: string;
  relatedTo: string;
  relatedType: 'lead' | 'deal' | 'contact' | 'task' | 'email';
  permissions: {
    canView: string[];
    canEdit: string[];
    canDelete: string[];
  };
}

interface DocumentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (document: Omit<DocumentFormData, 'id'>) => void;
  document?: DocumentFormData;
}

export function DocumentFormModal({ isOpen, onClose, onSave, document }: DocumentFormModalProps) {
  const [formData, setFormData] = useState<DocumentFormData>({
    name: document?.name || "",
    description: document?.description || "",
    type: document?.type || "other",
    category: document?.category || "other",
    url: document?.url || "",
    tags: document?.tags || [],
    isPublic: document?.isPublic || false,
    isStarred: document?.isStarred || false,
    isLocked: document?.isLocked || false,
    version: document?.version || "1.0",
    uploadedBy: document?.uploadedBy || "",
    relatedTo: document?.relatedTo || "",
    relatedType: document?.relatedType || "contact",
    permissions: document?.permissions || {
      canView: [],
      canEdit: [],
      canDelete: []
    }
  });

  const [newTag, setNewTag] = useState("");
  const [newViewer, setNewViewer] = useState("");
  const [newEditor, setNewEditor] = useState("");
  const [newDeleter, setNewDeleter] = useState("");

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

  const handleAddViewer = () => {
    if (newViewer.trim() && !formData.permissions.canView.includes(newViewer.trim())) {
      setFormData({
        ...formData,
        permissions: {
          ...formData.permissions,
          canView: [...formData.permissions.canView, newViewer.trim()]
        }
      });
      setNewViewer("");
    }
  };

  const handleRemoveViewer = (viewerToRemove: string) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        canView: formData.permissions.canView.filter(viewer => viewer !== viewerToRemove)
      }
    });
  };

  const handleAddEditor = () => {
    if (newEditor.trim() && !formData.permissions.canEdit.includes(newEditor.trim())) {
      setFormData({
        ...formData,
        permissions: {
          ...formData.permissions,
          canEdit: [...formData.permissions.canEdit, newEditor.trim()]
        }
      });
      setNewEditor("");
    }
  };

  const handleRemoveEditor = (editorToRemove: string) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        canEdit: formData.permissions.canEdit.filter(editor => editor !== editorToRemove)
      }
    });
  };

  const handleAddDeleter = () => {
    if (newDeleter.trim() && !formData.permissions.canDelete.includes(newDeleter.trim())) {
      setFormData({
        ...formData,
        permissions: {
          ...formData.permissions,
          canDelete: [...formData.permissions.canDelete, newDeleter.trim()]
        }
      });
      setNewDeleter("");
    }
  };

  const handleRemoveDeleter = (deleterToRemove: string) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        canDelete: formData.permissions.canDelete.filter(deleter => deleter !== deleterToRemove)
      }
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{document ? 'Edit Document' : 'Create New Document'}</DialogTitle>
          <DialogDescription>
            {document ? 'Update document information' : 'Create a new document entry'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Document Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Document Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Document Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Document Type *</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="doc">DOC</SelectItem>
                    <SelectItem value="docx">DOCX</SelectItem>
                    <SelectItem value="xls">XLS</SelectItem>
                    <SelectItem value="xlsx">XLSX</SelectItem>
                    <SelectItem value="ppt">PPT</SelectItem>
                    <SelectItem value="pptx">PPTX</SelectItem>
                    <SelectItem value="txt">TXT</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="presentation">Presentation</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="uploadedBy">Uploaded By</Label>
                <Input
                  id="uploadedBy"
                  value={formData.uploadedBy}
                  onChange={(e) => setFormData({ ...formData, uploadedBy: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Document URL *</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Document Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Document Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isPublic" className="text-sm">
                    Public Document
                  </Label>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isStarred"
                    checked={formData.isStarred}
                    onChange={(e) => setFormData({ ...formData, isStarred: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isStarred" className="text-sm">
                    Starred
                  </Label>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isLocked"
                    checked={formData.isLocked}
                    onChange={(e) => setFormData({ ...formData, isLocked: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isLocked" className="text-sm">
                    Locked
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Related To */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Related To</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="relatedType">Related Type</Label>
                <Select value={formData.relatedType} onValueChange={(value: any) => setFormData({ ...formData, relatedType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="deal">Deal</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="relatedTo">Related ID</Label>
                <Input
                  id="relatedTo"
                  value={formData.relatedTo}
                  onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value })}
                  placeholder="Enter related ID"
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

          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Permissions</h3>
            
            {/* View Permissions */}
            <div className="space-y-2">
              <Label>Can View</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add viewer..."
                  value={newViewer}
                  onChange={(e) => setNewViewer(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleAddViewer)}
                />
                <Button type="button" onClick={handleAddViewer} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.permissions.canView.map((viewer) => (
                  <Badge key={viewer} variant="outline" className="flex items-center gap-1">
                    {viewer}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveViewer(viewer)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Edit Permissions */}
            <div className="space-y-2">
              <Label>Can Edit</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add editor..."
                  value={newEditor}
                  onChange={(e) => setNewEditor(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleAddEditor)}
                />
                <Button type="button" onClick={handleAddEditor} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.permissions.canEdit.map((editor) => (
                  <Badge key={editor} variant="outline" className="flex items-center gap-1">
                    {editor}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveEditor(editor)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Delete Permissions */}
            <div className="space-y-2">
              <Label>Can Delete</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add deleter..."
                  value={newDeleter}
                  onChange={(e) => setNewDeleter(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleAddDeleter)}
                />
                <Button type="button" onClick={handleAddDeleter} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.permissions.canDelete.map((deleter) => (
                  <Badge key={deleter} variant="outline" className="flex items-center gap-1">
                    {deleter}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveDeleter(deleter)}
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
              {document ? 'Update Document' : 'Create Document'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
