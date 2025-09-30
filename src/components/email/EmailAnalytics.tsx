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
  Mail, 
  MailOpen, 
  MousePointer, 
  UserX, 
  Send,
  Clock,
  TrendingUp,
  Users
} from "lucide-react";

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

interface EmailAnalyticsProps {
  emails: Email[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function EmailAnalytics({ emails }: EmailAnalyticsProps) {
  // Calculate metrics
  const totalEmails = emails.length;
  const sentEmails = emails.filter(email => email.type === 'sent').length;
  const receivedEmails = emails.filter(email => email.type === 'received').length;
  const unreadEmails = emails.filter(email => email.status === 'unread').length;
  const repliedEmails = emails.filter(email => email.status === 'replied').length;
  const starredEmails = emails.filter(email => email.isStarred).length;

  // Type distribution
  const typeData = [
    { name: 'Sent', value: sentEmails, color: '#0088FE' },
    { name: 'Received', value: receivedEmails, color: '#00C49F' },
    { name: 'Draft', value: emails.filter(email => email.type === 'draft').length, color: '#FFBB28' },
    { name: 'Scheduled', value: emails.filter(email => email.type === 'scheduled').length, color: '#FF8042' }
  ];

  // Status distribution
  const statusData = [
    { name: 'Read', value: emails.filter(email => email.status === 'read').length },
    { name: 'Unread', value: unreadEmails },
    { name: 'Replied', value: repliedEmails },
    { name: 'Forwarded', value: emails.filter(email => email.status === 'forwarded').length },
    { name: 'Archived', value: emails.filter(email => email.status === 'archived').length }
  ];

  // Priority distribution
  const priorityData = [
    { name: 'High', value: emails.filter(email => email.priority === 'high').length },
    { name: 'Normal', value: emails.filter(email => email.priority === 'normal').length },
    { name: 'Low', value: emails.filter(email => email.priority === 'low').length }
  ];

  // Monthly trend (mock data)
  const monthlyTrend = [
    { month: 'Jan', sent: 45, received: 38, replied: 12 },
    { month: 'Feb', sent: 52, received: 45, replied: 15 },
    { month: 'Mar', sent: 48, received: 42, replied: 18 },
    { month: 'Apr', sent: 61, received: 55, replied: 22 },
    { month: 'May', sent: 55, received: 48, replied: 19 },
    { month: 'Jun', sent: 67, received: 62, replied: 28 }
  ];

  // Top senders
  const senderCounts = emails.reduce((acc, email) => {
    acc[email.from] = (acc[email.from] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topSenders = Object.entries(senderCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([sender, count]) => ({ name: sender, value: count }));

  // Response time analysis (mock data)
  const responseTimeData = [
    { range: '0-1h', count: 15 },
    { range: '1-4h', count: 28 },
    { range: '4-24h', count: 42 },
    { range: '1-3 days', count: 18 },
    { range: '3+ days', count: 8 }
  ];

  // Email volume by day of week
  const dayOfWeekData = [
    { day: 'Mon', count: 25 },
    { day: 'Tue', count: 32 },
    { day: 'Wed', count: 28 },
    { day: 'Thu', count: 35 },
    { day: 'Fri', count: 22 },
    { day: 'Sat', count: 8 },
    { day: 'Sun', count: 5 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmails}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sentEmails}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Received</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{receivedEmails}</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <MailOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadEmails}</div>
            <p className="text-xs text-muted-foreground">
              -8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Replied</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{repliedEmails}</div>
            <p className="text-xs text-muted-foreground">
              +25% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Starred</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{starredEmails}</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="volume">Volume Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Email Type Distribution</CardTitle>
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

            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Email Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusData}>
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

        <TabsContent value="volume" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Email Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Email Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="sent" stackId="1" stroke="#0088FE" fill="#0088FE" />
                    <Area type="monotone" dataKey="received" stackId="1" stroke="#00C49F" fill="#00C49F" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Day of Week Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Email Volume by Day of Week</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dayOfWeekData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Senders */}
            <Card>
              <CardHeader>
                <CardTitle>Top Email Senders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSenders.map((sender, index) => (
                    <div key={sender.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <span className="font-medium text-sm">{sender.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{sender.value}</div>
                        <div className="text-xs text-muted-foreground">emails</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Response Time Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Response Time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={responseTimeData}>
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

        <TabsContent value="patterns" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Priority Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Email Priority Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Reply Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Reply Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="replied" stroke="#00C49F" strokeWidth={2} />
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
