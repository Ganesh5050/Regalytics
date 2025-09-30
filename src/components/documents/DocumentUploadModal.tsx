import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload, FileText, Image, File } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DocumentUploadData {
  name: string;
  description: string;
  type: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx' | 'txt' | 'image' | 'other';
  category: 'contract' | 'proposal' | 'report' | 'presentation' | 'legal' | 'financial' | 'other';
  tags: string[];
  isPublic: boolean;
  isStarred: boolean;
  isLocked: boolean;
  uploadedBy: string;
  relatedTo: string;
  relatedType: 'lead' | 'deal' | 'contact' | 'task' | 'email';
}

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (document: Omit<DocumentUploadData, 'id'>) => void;
}

export function DocumentUploadModal({ isOpen, onClose, onUpload }: DocumentUploadModalProps) {
  const [formData, setFormData] = useState<DocumentUploadData>({
    name: "",
    description: "",
    type: "other",
    category: "other",
    tags: [],
    isPublic: false,
    isStarred: false,
    isLocked: false,
    uploadedBy: "",
    relatedTo: "",
    relatedType: "contact"
  });

  const [newTag, setNewTag] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate file upload
    selectedFiles.forEach((file) => {
      const documentData = {
        ...formData,
        name: formData.name || file.name,
        type: getFileType(file.name) as any,
        url: `/documents/${file.name}`,
        size: file.size
      };
      onUpload(documentData);
    });
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    
    // Auto-fill form data based on first file
    if (files.length > 0) {
      const firstFile = files[0];
      setFormData(prev => ({
        ...prev,
        name: prev.name || firstFile.name,
        type: getFileType(firstFile.name) as any
      }));
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setSelectedFiles(selectedFiles.filter(file => file.name !== fileName));
  };

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'pdf';
      case 'doc': return 'doc';
      case 'docx': return 'docx';
      case 'xls': return 'xls';
      case 'xlsx': return 'xlsx';
      case 'ppt': return 'ppt';
      case 'pptx': return 'pptx';
      case 'txt': return 'txt';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'image';
      default: return 'other';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-8 w-8 text-red-500" />;
      case 'doc':
      case 'docx': return <FileText className="h-8 w-8 text-blue-500" />;
      case 'xls':
      case 'xlsx': return <FileText className="h-8 w-8 text-green-500" />;
      case 'ppt':
      case 'pptx': return <FileText className="h-8 w-8 text-orange-500" />;
      case 'image': return <Image className="h-8 w-8 text-purple-500" />;
      default: return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>
            Upload and organize your documents
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Files</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </Label>
                <p className="text-sm text-gray-500">
                  PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, Images
                </p>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files ({selectedFiles.length})</Label>
                <div className="space-y-2">
                  {selectedFiles.map((file) => (
                    <div key={file.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(getFileType(file.name))}
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(file.name)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Document Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Document Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Document Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter document name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
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
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Enter document description"
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
              <div className="space-y-2">
                <Label htmlFor="uploadedBy">Uploaded By</Label>
                <Input
                  id="uploadedBy"
                  value={formData.uploadedBy}
                  onChange={(e) => setFormData({ ...formData, uploadedBy: e.target.value })}
                  placeholder="Enter uploader name"
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
            <Button type="submit" disabled={selectedFiles.length === 0}>
              <Upload className="h-4 w-4 mr-2" />
              Upload {selectedFiles.length > 0 ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}` : 'Files'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
