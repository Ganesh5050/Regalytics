import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  FileText,
  Image,
  File,
  Folder,
  Share2,
  Star,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Copy,
  Lock,
  Unlock
} from "lucide-react";
import { DocumentFormModal } from "@/components/documents/DocumentFormModal";
import { DocumentDetailsModal } from "@/components/documents/DocumentDetailsModal";
import { DocumentUploadModal } from "@/components/documents/DocumentUploadModal";
import { DocumentAnalytics } from "@/components/documents/DocumentAnalytics";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Document {
  id: string;
  name: string;
  description: string;
  type: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx' | 'txt' | 'image' | 'other';
  category: 'contract' | 'proposal' | 'report' | 'presentation' | 'legal' | 'financial' | 'other';
  size: number; // in bytes
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
  relatedTo: string; // Lead, Deal, Contact ID
  relatedType: 'lead' | 'deal' | 'contact' | 'task' | 'email';
  permissions: {
    canView: string[];
    canEdit: string[];
    canDelete: string[];
  };
}

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Compliance Proposal - TechCorp Solutions",
    description: "Comprehensive compliance solution proposal for enterprise client",
    type: "pdf",
    category: "proposal",
    size: 2048576, // 2MB
    url: "/documents/proposal-techcorp.pdf",
    thumbnail: "/thumbnails/proposal-techcorp.jpg",
    tags: ["proposal", "compliance", "enterprise", "techcorp"],
    isPublic: false,
    isStarred: true,
    isLocked: false,
    version: "1.2",
    uploadedBy: "Sarah Johnson",
    uploadedAt: "2024-01-15T10:30:00Z",
    lastModified: "2024-01-20T14:15:00Z",
    lastModifiedBy: "Mike Chen",
    downloadCount: 15,
    viewCount: 45,
    relatedTo: "1",
    relatedType: "deal",
    permissions: {
      canView: ["Sarah Johnson", "Mike Chen", "Admin"],
      canEdit: ["Sarah Johnson", "Mike Chen"],
      canDelete: ["Sarah Johnson"]
    }
  },
  {
    id: "2",
    name: "Risk Assessment Report - Q1 2024",
    description: "Quarterly risk assessment report with compliance metrics",
    type: "pdf",
    category: "report",
    size: 1536000, // 1.5MB
    url: "/documents/risk-assessment-q1-2024.pdf",
    thumbnail: "/thumbnails/risk-assessment-q1-2024.jpg",
    tags: ["report", "risk", "compliance", "q1-2024"],
    isPublic: true,
    isStarred: false,
    isLocked: true,
    version: "2.0",
    uploadedBy: "Mike Chen",
    uploadedAt: "2024-01-10T09:00:00Z",
    lastModified: "2024-01-18T16:30:00Z",
    lastModifiedBy: "Sarah Johnson",
    downloadCount: 28,
    viewCount: 67,
    relatedTo: "2",
    relatedType: "deal",
    permissions: {
      canView: ["All Users"],
      canEdit: ["Sarah Johnson", "Mike Chen"],
      canDelete: ["Admin"]
    }
  },
  {
    id: "3",
    name: "Contract Template - Standard Agreement",
    description: "Standard contract template for compliance services",
    type: "docx",
    category: "contract",
    size: 512000, // 512KB
    url: "/documents/contract-template-standard.docx",
    tags: ["contract", "template", "legal", "standard"],
    isPublic: false,
    isStarred: true,
    isLocked: false,
    version: "3.1",
    uploadedBy: "Legal Team",
    uploadedAt: "2024-01-05T11:00:00Z",
    lastModified: "2024-01-22T10:45:00Z",
    lastModifiedBy: "Legal Team",
    downloadCount: 42,
    viewCount: 89,
    relatedTo: "3",
    relatedType: "deal",
    permissions: {
      canView: ["All Users"],
      canEdit: ["Legal Team"],
      canDelete: ["Legal Team"]
    }
  }
];

const typeColors = {
  'pdf': 'bg-red-100 text-red-800',
  'doc': 'bg-blue-100 text-blue-800',
  'docx': 'bg-blue-100 text-blue-800',
  'xls': 'bg-green-100 text-green-800',
  'xlsx': 'bg-green-100 text-green-800',
  'ppt': 'bg-orange-100 text-orange-800',
  'pptx': 'bg-orange-100 text-orange-800',
  'txt': 'bg-gray-100 text-gray-800',
  'image': 'bg-purple-100 text-purple-800',
  'other': 'bg-gray-100 text-gray-800'
};

const categoryColors = {
  'contract': 'bg-red-100 text-red-800',
  'proposal': 'bg-blue-100 text-blue-800',
  'report': 'bg-green-100 text-green-800',
  'presentation': 'bg-orange-100 text-orange-800',
  'legal': 'bg-purple-100 text-purple-800',
  'financial': 'bg-yellow-100 text-yellow-800',
  'other': 'bg-gray-100 text-gray-800'
};

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isDocumentFormOpen, setIsDocumentFormOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter documents based on search and filters
  useEffect(() => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(doc => doc.type === typeFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(doc => doc.category === categoryFilter);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, typeFilter, categoryFilter]);

  const handleAddDocument = (newDocument: Omit<Document, 'id'>) => {
    const document: Document = {
      ...newDocument,
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      downloadCount: 0,
      viewCount: 0
    };
    setDocuments([...documents, document]);
  };

  const handleUpdateDocument = (updatedDocument: Document) => {
    setDocuments(documents.map(doc => doc.id === updatedDocument.id ? updatedDocument : doc));
  };

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsDetailsOpen(true);
    // Increment view count
    handleUpdateDocument({ ...document, viewCount: document.viewCount + 1 });
  };

  const handleStarDocument = (document: Document) => {
    handleUpdateDocument({ ...document, isStarred: !document.isStarred });
  };

  const handleDownloadDocument = (document: Document) => {
    // Simulate download
    handleUpdateDocument({ ...document, downloadCount: document.downloadCount + 1 });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const totalDocuments = documents.length;
  const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);
  const starredDocuments = documents.filter(doc => doc.isStarred).length;
  const publicDocuments = documents.filter(doc => doc.isPublic).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Management</h1>
          <p className="text-muted-foreground">
            Store, organize, and share your documents
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button onClick={() => setIsDocumentFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocuments}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Starred</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{starredDocuments}</div>
            <p className="text-xs text-muted-foreground">
              +3 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Public</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publicDocuments}</div>
            <p className="text-xs text-muted-foreground">
              +5 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="starred">Starred</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
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
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="presentation">Presentation</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Documents Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
              <CardDescription>
                Manage your documents and files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleViewDocument(document)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(document.type)}
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1 line-clamp-1">{document.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{document.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {document.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                        {document.isLocked && <Lock className="h-4 w-4 text-gray-500" />}
                        {document.isPublic && <Share2 className="h-4 w-4 text-blue-500" />}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge className={typeColors[document.type]}>
                          {document.type.toUpperCase()}
                        </Badge>
                        <Badge className={categoryColors[document.category]}>
                          {document.category}
                        </Badge>
                        <Badge variant="outline">v{document.version}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatFileSize(document.size)}</span>
                        <span>{document.downloadCount} downloads</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>By {document.uploadedBy}</span>
                        <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStarDocument(document);
                          }}
                        >
                          <Star className={`h-4 w-4 ${document.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadDocument(document);
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDocument(document)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="starred" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Starred Documents ({documents.filter(doc => doc.isStarred).length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents
                  .filter(doc => doc.isStarred)
                  .map((document) => (
                  <div
                    key={document.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleViewDocument(document)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(document.type)}
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1 line-clamp-1">{document.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{document.description}</p>
                        </div>
                      </div>
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge className={typeColors[document.type]}>
                          {document.type.toUpperCase()}
                        </Badge>
                        <Badge className={categoryColors[document.category]}>
                          {document.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatFileSize(document.size)}</span>
                        <span>{document.downloadCount} downloads</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents
                  .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
                  .slice(0, 10)
                  .map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleViewDocument(document)}
                  >
                    <div className="flex items-center space-x-3">
                      {getFileIcon(document.type)}
                      <div>
                        <h4 className="font-medium text-sm">{document.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          Modified by {document.lastModifiedBy} • {new Date(document.lastModified).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={typeColors[document.type]}>
                        {document.type.toUpperCase()}
                      </Badge>
                      {document.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shared" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shared Documents ({documents.filter(doc => doc.isPublic).length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents
                  .filter(doc => doc.isPublic)
                  .map((document) => (
                  <div
                    key={document.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleViewDocument(document)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(document.type)}
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1 line-clamp-1">{document.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{document.description}</p>
                        </div>
                      </div>
                      <Share2 className="h-4 w-4 text-blue-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge className={typeColors[document.type]}>
                          {document.type.toUpperCase()}
                        </Badge>
                        <Badge className={categoryColors[document.category]}>
                          {document.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatFileSize(document.size)}</span>
                        <span>{document.viewCount} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <DocumentAnalytics documents={documents} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <DocumentFormModal
        isOpen={isDocumentFormOpen}
        onClose={() => setIsDocumentFormOpen(false)}
        onSave={handleAddDocument}
      />

      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleAddDocument}
      />

      <DocumentDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        document={selectedDocument}
        onUpdate={handleUpdateDocument}
      />
    </div>
  );
}
