import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Share2, 
  Star, 
  Lock, 
  Unlock,
  FileText,
  Image,
  File,
  Eye,
  Edit,
  Trash2,
  Copy,
  Clock,
  User,
  Calendar,
  BarChart3,
  Link
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Document {
  id: string;
  name: string;
  description: string;
  type: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx' | 'txt' | 'image' | 'other';
  category: 'contract' | 'proposal' | 'report' | 'presentation' | 'legal' | 'financial' | 'other';
  size: number;
  url: string;
  thumbnail?: string;
  tags: string[];
  isPublic: boolean;
  isStarred: boolean;
  isLocked: boolean;
  version: string;
  uploadedBy: string;
  uploadedAt: string;
  lastModified: string;
  lastModifiedBy: string;
  downloadCount: number;
  viewCount: number;
  relatedTo: string;
  relatedType: 'lead' | 'deal' | 'contact' | 'task' | 'email';
  permissions: {
    canView: string[];
    canEdit: string[];
    canDelete: string[];
  };
}

interface DocumentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onUpdate: (document: Document) => void;
}

export function DocumentDetailsModal({ isOpen, onClose, document, onUpdate }: DocumentDetailsModalProps) {
  const [isStarred, setIsStarred] = useState(document?.isStarred || false);

  if (!document) return null;

  const handleStar = () => {
    const newStarred = !isStarred;
    setIsStarred(newStarred);
    onUpdate({ ...document, isStarred: newStarred });
  };

  const handleDownload = () => {
    // Simulate download
    onUpdate({ ...document, downloadCount: document.downloadCount + 1 });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-12 w-12 text-red-500" />;
      case 'doc':
      case 'docx': return <FileText className="h-12 w-12 text-blue-500" />;
      case 'xls':
      case 'xlsx': return <FileText className="h-12 w-12 text-green-500" />;
      case 'ppt':
      case 'pptx': return <FileText className="h-12 w-12 text-orange-500" />;
      case 'image': return <Image className="h-12 w-12 text-purple-500" />;
      default: return <File className="h-12 w-12 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            <div className="flex items-center space-x-4">
              {getFileIcon(document.type)}
              <div>
                <DialogTitle className="text-xl">{document.name}</DialogTitle>
                <DialogDescription>
                  {document.type.toUpperCase()} • {formatFileSize(document.size)} • Version {document.version}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {document.isPublic && <Badge variant="outline">Public</Badge>}
              {document.isLocked && <Badge variant="outline">Locked</Badge>}
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

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Document Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Document Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm">{document.description || 'No description available'}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Category</Label>
                      <Badge variant="outline">{document.category}</Badge>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Type</Label>
                      <Badge variant="outline">{document.type.toUpperCase()}</Badge>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Size</Label>
                      <p className="text-sm">{formatFileSize(document.size)}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Version</Label>
                      <p className="text-sm">{document.version}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {document.tags && document.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {document.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Link className="h-5 w-5 mr-2" />
                  Related Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Related To</Label>
                  <p className="text-sm">{document.relatedType} #{document.relatedTo}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Document Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* View Permissions */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Can View</Label>
                    <div className="flex flex-wrap gap-2">
                      {document.permissions.canView.map((viewer) => (
                        <Badge key={viewer} variant="outline">
                          {viewer}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Edit Permissions */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Can Edit</Label>
                    <div className="flex flex-wrap gap-2">
                      {document.permissions.canEdit.map((editor) => (
                        <Badge key={editor} variant="outline">
                          {editor}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Delete Permissions */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Can Delete</Label>
                    <div className="flex flex-wrap gap-2">
                      {document.permissions.canDelete.map((deleter) => (
                        <Badge key={deleter} variant="outline">
                          {deleter}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Document Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Document uploaded</p>
                        <p className="text-xs text-muted-foreground">{formatDate(document.uploadedAt)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Uploaded by {document.uploadedBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Last modified</p>
                        <p className="text-xs text-muted-foreground">{formatDate(document.lastModified)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Modified by {document.lastModifiedBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Document viewed</p>
                        <p className="text-xs text-muted-foreground">Recently</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Total views: {document.viewCount}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Document Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Eye className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold">{document.viewCount}</div>
                    <div className="text-sm text-muted-foreground">Total Views</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Download className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold">{document.downloadCount}</div>
                    <div className="text-sm text-muted-foreground">Downloads</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Calendar className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold">
                      {Math.round((document.downloadCount / Math.max(document.viewCount, 1)) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Download Rate</div>
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
