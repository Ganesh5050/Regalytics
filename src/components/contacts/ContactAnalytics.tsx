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
  Users, 
  Building, 
  MapPin, 
  Globe,
  MessageSquare,
  Star
} from "lucide-react";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  department: string;
  address: string;
  city: string;
  state: string;
  country: string;
  website: string;
  source: string;
  status: 'active' | 'inactive' | 'prospect' | 'customer' | 'vendor';
  tags: string[];
  notes: string;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  totalInteractions: number;
  lastInteraction: string;
  preferredContact: 'email' | 'phone' | 'sms';
  timezone: string;
  language: string;
}

interface ContactAnalyticsProps {
  contacts: Contact[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function ContactAnalytics({ contacts }: ContactAnalyticsProps) {
  // Calculate metrics
  const totalContacts = contacts.length;
  const activeContacts = contacts.filter(contact => contact.status === 'active').length;
  const customerContacts = contacts.filter(contact => contact.status === 'customer').length;
  const avgInteractions = contacts.reduce((sum, contact) => sum + contact.totalInteractions, 0) / totalContacts;

  // Status distribution
  const statusData = [
    { name: 'Active', value: contacts.filter(contact => contact.status === 'active').length, color: '#00C49F' },
    { name: 'Inactive', value: contacts.filter(contact => contact.status === 'inactive').length, color: '#FF8042' },
    { name: 'Prospect', value: contacts.filter(contact => contact.status === 'prospect').length, color: '#0088FE' },
    { name: 'Customer', value: contacts.filter(contact => contact.status === 'customer').length, color: '#82CA9D' },
    { name: 'Vendor', value: contacts.filter(contact => contact.status === 'vendor').length, color: '#8884D8' }
  ];

  // Source distribution
  const sourceData = [
    { name: 'Website', value: contacts.filter(contact => contact.source === 'Website').length },
    { name: 'Referral', value: contacts.filter(contact => contact.source === 'Referral').length },
    { name: 'LinkedIn', value: contacts.filter(contact => contact.source === 'LinkedIn').length },
    { name: 'Email', value: contacts.filter(contact => contact.source === 'Email').length },
    { name: 'Phone', value: contacts.filter(contact => contact.source === 'Phone').length }
  ];

  // Geographic distribution
  const countryData = [
    { name: 'USA', value: contacts.filter(contact => contact.country === 'USA').length },
    { name: 'Canada', value: contacts.filter(contact => contact.country === 'Canada').length },
    { name: 'UK', value: contacts.filter(contact => contact.country === 'UK').length },
    { name: 'Germany', value: contacts.filter(contact => contact.country === 'Germany').length },
    { name: 'Other', value: contacts.filter(contact => !['USA', 'Canada', 'UK', 'Germany'].includes(contact.country)).length }
  ];

  // Department distribution
  const departmentData = [
    { name: 'Technology', value: contacts.filter(contact => contact.department === 'Technology').length },
    { name: 'Compliance', value: contacts.filter(contact => contact.department === 'Compliance').length },
    { name: 'Risk Management', value: contacts.filter(contact => contact.department === 'Risk Management').length },
    { name: 'Finance', value: contacts.filter(contact => contact.department === 'Finance').length },
    { name: 'Other', value: contacts.filter(contact => !['Technology', 'Compliance', 'Risk Management', 'Finance'].includes(contact.department)).length }
  ];

  // Monthly trend (mock data)
  const monthlyTrend = [
    { month: 'Jan', contacts: 45, interactions: 120 },
    { month: 'Feb', contacts: 52, interactions: 145 },
    { month: 'Mar', contacts: 48, interactions: 138 },
    { month: 'Apr', contacts: 61, interactions: 167 },
    { month: 'May', contacts: 55, interactions: 152 },
    { month: 'Jun', contacts: 67, interactions: 189 }
  ];

  // Top companies
  const companyCounts = contacts.reduce((acc, contact) => {
    acc[contact.company] = (acc[contact.company] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCompanies = Object.entries(companyCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([company, count]) => ({ name: company, value: count }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeContacts}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerContacts}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Interactions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgInteractions)}</div>
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
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Source Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sourceData}>
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

        <TabsContent value="geographic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Country Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={countryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {countryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
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

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Contact Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Contact Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="contacts" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Interaction Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Interactions</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="interactions" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="companies" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Companies */}
            <Card>
              <CardHeader>
                <CardTitle>Top Companies by Contact Count</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCompanies.map((company, index) => (
                    <div key={company.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <span className="font-medium">{company.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{company.value}</div>
                        <div className="text-xs text-muted-foreground">contacts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Company Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Company Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topCompanies}>
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
      </Tabs>
    </div>
  );
}
