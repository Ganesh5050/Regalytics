import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Line
} from "recharts";
import { 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'call' | 'appointment' | 'demo' | 'follow-up' | 'other';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  location?: string;
  meetingLink?: string;
  attendees: string[];
  organizer: string;
  isAllDay: boolean;
  isRecurring: boolean;
  recurrencePattern?: string;
  reminder: number;
  tags: string[];
  relatedTo: string;
  relatedType: 'lead' | 'deal' | 'contact' | 'task' | 'email';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface CalendarAnalyticsProps {
  events: CalendarEvent[];
}

export function CalendarAnalytics({ events }: CalendarAnalyticsProps) {
  // Calculate analytics data
  const totalEvents = events.length;
  const completedEvents = events.filter(e => e.status === 'completed').length;
  const cancelledEvents = events.filter(e => e.status === 'cancelled').length;
  const upcomingEvents = events.filter(e => new Date(e.startDate) > new Date()).length;
  
  const completionRate = totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;
  const cancellationRate = totalEvents > 0 ? (cancelledEvents / totalEvents) * 100 : 0;

  // Event type distribution
  const typeDistribution = events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeData = Object.entries(typeDistribution).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count,
    percentage: totalEvents > 0 ? (count / totalEvents) * 100 : 0
  }));

  // Status distribution
  const statusDistribution = events.reduce((acc, event) => {
    acc[event.status] = (acc[event.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusDistribution).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count,
    percentage: totalEvents > 0 ? (count / totalEvents) * 100 : 0
  }));

  // Monthly trends
  const monthlyData = events.reduce((acc, event) => {
    const month = new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { scheduled: 0, completed: 0, cancelled: 0 };
    }
    acc[month][event.status as keyof typeof acc[string]]++;
    return acc;
  }, {} as Record<string, { scheduled: number; completed: number; cancelled: number }>);

  const monthlyTrends = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    ...data
  }));

  // Top organizers
  const organizerData = events.reduce((acc, event) => {
    acc[event.organizer] = (acc[event.organizer] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topOrganizers = Object.entries(organizerData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([organizer, count]) => ({ organizer, count }));

  // Average attendees per event
  const totalAttendees = events.reduce((sum, event) => sum + event.attendees.length, 0);
  const averageAttendees = totalEvents > 0 ? totalAttendees / totalEvents : 0;

  // Recurring events
  const recurringEvents = events.filter(e => e.isRecurring).length;
  const recurringRate = totalEvents > 0 ? (recurringEvents / totalEvents) * 100 : 0;

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rescheduled': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingEvents} upcoming events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {completedEvents} of {totalEvents} events completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancellation Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cancellationRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {cancelledEvents} of {totalEvents} events cancelled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageAttendees.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {recurringRate.toFixed(1)}% are recurring
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Event Types</CardTitle>
            <CardDescription>Distribution of events by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percentage }) => `${type} (${percentage.toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            <CardTitle>Event Status</CardTitle>
            <CardDescription>Distribution of events by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>Event trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="scheduled" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="completed" stroke="#00C49F" strokeWidth={2} />
              <Line type="monotone" dataKey="cancelled" stroke="#FF8042" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Organizers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Organizers</CardTitle>
          <CardDescription>Most active event organizers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topOrganizers.map((organizer, index) => (
              <div key={organizer.organizer} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {organizer.organizer.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium">{organizer.organizer}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{organizer.count} events</Badge>
                  <span className="text-sm text-muted-foreground">
                    {((organizer.count / totalEvents) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Status Breakdown</CardTitle>
          <CardDescription>Detailed view of event statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {statusData.map((status) => (
              <div key={status.status} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {getStatusIcon(status.status.toLowerCase())}
                </div>
                <div className="text-2xl font-bold">{status.count}</div>
                <div className="text-sm text-muted-foreground">{status.status}</div>
                <div className="text-xs text-muted-foreground">
                  {status.percentage.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
