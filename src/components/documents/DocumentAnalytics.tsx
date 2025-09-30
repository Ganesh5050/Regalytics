import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { 
  FileText, 
  Download, 
  Eye, 
  Users,
  Folder,
  TrendingUp,
  Clock,
  Star
} from "lucide-react";

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

interface DocumentAnalyticsProps {
  documents: Document[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function DocumentAnalytics({ documents }: DocumentAnalyticsProps) {
  // Calculate metrics
  const totalDocuments = documents.length;
  const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);
  const totalDownloads = documents.reduce((sum, doc) => sum + doc.downloadCount, 0);
  const totalViews = documents.reduce((sum, doc) => sum + doc.viewCount, 0);
  const starredDocuments = documents.filter(doc => doc.isStarred).length;
  const publicDocuments = documents.filter(doc => doc.isPublic).length;

  // Type distribution
  const typeData = [
    { name: 'PDF', value: documents.filter(doc => doc.type === 'pdf').length, color: '#FF6B6B' },
    { name: 'DOC/DOCX', value: documents.filter(doc => ['doc', 'docx'].includes(doc.type)).length, color: '#4ECDC4' },
    { name: 'XLS/XLSX', value: documents.filter(doc => ['xls', 'xlsx'].includes(doc.type)).length, color: '#45B7D1' },
    { name: 'PPT/PPTX', value: documents.filter(doc => ['ppt', 'pptx'].includes(doc.type)).length, color: '#96CEB4' },
    { name: 'Images', value: documents.filter(doc => doc.type === 'image').length, color: '#FFEAA7' },
    { name: 'Other', value: documents.filter(doc => doc.type === 'other').length, color: '#DDA0DD' }
  ];

  // Category distribution
  const categoryData = [
    { name: 'Contract', value: documents.filter(doc => doc.category === 'contract').length },
    { name: 'Proposal', value: documents.filter(doc => doc.category === 'proposal').length },
    { name: 'Report', value: documents.filter(doc => doc.category === 'report').length },
    { name: 'Presentation', value: documents.filter(doc => doc.category === 'presentation').length },
    { name: 'Legal', value: documents.filter(doc => doc.category === 'legal').length },
    { name: 'Financial', value: documents.filter(doc => doc.category === 'financial').length },
    { name: 'Other', value: documents.filter(doc => doc.category === 'other').length }
  ];

  // Monthly trend (mock data)
  const monthlyTrend = [
    { month: 'Jan', uploaded: 12, downloaded: 45, viewed: 89 },
    { month: 'Feb', uploaded: 18, downloaded: 52, viewed: 112 },
    { month: 'Mar', uploaded: 15, downloaded: 48, viewed: 98 },
    { month: 'Apr', uploaded: 22, downloaded: 67, viewed: 134 },
    { month: 'May', uploaded: 19, downloaded: 55, viewed: 108 },
    { month: 'Jun', uploaded: 25, downloaded: 73, viewed: 156 }
  ];

  // Top documents by downloads
  const topDownloads = documents
    .sort((a, b) => b.downloadCount - a.downloadCount)
    .slice(0, 5)
    .map(doc => ({ name: doc.name, downloads: doc.downloadCount }));

  // Top documents by views
  const topViews = documents
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5)
    .map(doc => ({ name: doc.name, views: doc.viewCount }));

  // Upload activity by user
  const uploadActivity = documents.reduce((acc, doc) => {
    acc[doc.uploadedBy] = (acc[doc.uploadedBy] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topUploaders = Object.entries(uploadActivity)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([user, count]) => ({ name: user, uploads: count }));

  // Size distribution
  const sizeRanges = [
    { range: '0-1MB', count: documents.filter(doc => doc.size < 1024 * 1024).length },
    { range: '1-5MB', count: documents.filter(doc => doc.size >= 1024 * 1024 && doc.size < 5 * 1024 * 1024).length },
    { range: '5-10MB', count: documents.filter(doc => doc.size >= 5 * 1024 * 1024 && doc.size < 10 * 1024 * 1024).length },
    { range: '10MB+', count: documents.filter(doc => doc.size >= 10 * 1024 * 1024).length }
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
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
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDownloads}</div>
            <p className="text-xs text-muted-foreground">
              +22% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
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
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publicDocuments}</div>
            <p className="text-xs text-muted-foreground">
              +5 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Document Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Document Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Document Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Downloads */}
            <Card>
              <CardHeader>
                <CardTitle>Top Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topDownloads.map((doc, index) => (
                    <div key={doc.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <span className="font-medium text-sm truncate">{doc.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{doc.downloads}</div>
                        <div className="text-xs text-muted-foreground">downloads</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Views */}
            <Card>
              <CardHeader>
                <CardTitle>Top Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topViews.map((doc, index) => (
                    <div key={doc.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <span className="font-medium text-sm truncate">{doc.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{doc.views}</div>
                        <div className="text-xs text-muted-foreground">views</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Upload Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Document Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="uploaded" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="downloaded" stackId="1" stroke="#00C49F" fill="#00C49F" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Size Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Document Size Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sizeRanges}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Uploaders */}
            <Card>
              <CardHeader>
                <CardTitle>Top Uploaders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topUploaders.map((user, index) => (
                    <div key={user.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{user.uploads}</div>
                        <div className="text-xs text-muted-foreground">uploads</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* View vs Download Trend */}
            <Card>
              <CardHeader>
                <CardTitle>View vs Download Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="viewed" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="downloaded" stroke="#00C49F" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
