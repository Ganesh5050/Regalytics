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
  CheckCircle, 
  Clock, 
  User, 
  Flag,
  Play,
  Pause,
  Square
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'call' | 'email' | 'meeting' | 'follow-up' | 'proposal' | 'other';
  assignedTo: string;
  createdBy: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
  relatedTo: string;
  relatedType: 'lead' | 'deal' | 'contact';
  notes: string;
  attachments: string[];
}

interface TaskAnalyticsProps {
  tasks: Task[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function TaskAnalytics({ tasks }: TaskAnalyticsProps) {
  // Calculate metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const overdueTasks = tasks.filter(task => new Date(task.dueDate) < new Date() && task.status !== 'completed').length;
  const completionRate = (completedTasks / totalTasks) * 100;

  // Status distribution
  const statusData = [
    { name: 'To Do', value: tasks.filter(task => task.status === 'todo').length, color: '#8884d8' },
    { name: 'In Progress', value: tasks.filter(task => task.status === 'in-progress').length, color: '#0088FE' },
    { name: 'Review', value: tasks.filter(task => task.status === 'review').length, color: '#FFBB28' },
    { name: 'Completed', value: tasks.filter(task => task.status === 'completed').length, color: '#00C49F' },
    { name: 'Cancelled', value: tasks.filter(task => task.status === 'cancelled').length, color: '#FF8042' }
  ];

  // Priority distribution
  const priorityData = [
    { name: 'Low', value: tasks.filter(task => task.priority === 'low').length },
    { name: 'Medium', value: tasks.filter(task => task.priority === 'medium').length },
    { name: 'High', value: tasks.filter(task => task.priority === 'high').length },
    { name: 'Urgent', value: tasks.filter(task => task.priority === 'urgent').length }
  ];

  // Type distribution
  const typeData = [
    { name: 'Call', value: tasks.filter(task => task.type === 'call').length },
    { name: 'Email', value: tasks.filter(task => task.type === 'email').length },
    { name: 'Meeting', value: tasks.filter(task => task.type === 'meeting').length },
    { name: 'Follow-up', value: tasks.filter(task => task.type === 'follow-up').length },
    { name: 'Proposal', value: tasks.filter(task => task.type === 'proposal').length },
    { name: 'Other', value: tasks.filter(task => task.type === 'other').length }
  ];

  // Monthly trend (mock data)
  const monthlyTrend = [
    { month: 'Jan', created: 45, completed: 38 },
    { month: 'Feb', created: 52, completed: 45 },
    { month: 'Mar', created: 48, completed: 42 },
    { month: 'Apr', created: 61, completed: 55 },
    { month: 'May', created: 55, completed: 48 },
    { month: 'Jun', created: 67, completed: 62 }
  ];

  // Team performance
  const teamPerformance = [
    { name: 'Sarah Johnson', total: tasks.filter(task => task.assignedTo === 'Sarah Johnson').length, completed: tasks.filter(task => task.assignedTo === 'Sarah Johnson' && task.status === 'completed').length },
    { name: 'Mike Chen', total: tasks.filter(task => task.assignedTo === 'Mike Chen').length, completed: tasks.filter(task => task.assignedTo === 'Mike Chen' && task.status === 'completed').length }
  ];

  // Time tracking
  const totalEstimatedHours = tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
  const totalActualHours = tasks.reduce((sum, task) => sum + task.actualHours, 0);
  const avgEstimatedHours = totalEstimatedHours / totalTasks;
  const avgActualHours = totalActualHours / totalTasks;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              +8% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Pause className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
            <p className="text-xs text-muted-foreground">
              +5% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground">
              -3% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="time">Time Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Task Status Distribution</CardTitle>
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

            {/* Priority Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Task Priority Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={priorityData}>
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

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamPerformance.map((member, index) => (
                    <div key={member.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <span className="font-medium">{member.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{member.completed}/{member.total}</div>
                        <div className="text-xs text-muted-foreground">
                          {member.total > 0 ? ((member.completed / member.total) * 100).toFixed(1) : 0}% completion
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Task Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Task Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={typeData}>
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
            {/* Monthly Task Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Task Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="created" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="completed" stackId="1" stroke="#00C49F" fill="#00C49F" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Completion Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Completion Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="completed" stroke="#00C49F" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="time" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Time Tracking Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Time Tracking Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Estimated Hours</span>
                    <span className="font-bold">{totalEstimatedHours.toFixed(1)}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Actual Hours</span>
                    <span className="font-bold">{totalActualHours.toFixed(1)}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Estimated</span>
                    <span className="font-bold">{avgEstimatedHours.toFixed(1)}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Actual</span>
                    <span className="font-bold">{avgActualHours.toFixed(1)}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Efficiency</span>
                    <span className="font-bold">
                      {totalEstimatedHours > 0 ? ((totalActualHours / totalEstimatedHours) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Time Distribution by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {typeData.map((type) => {
                    const typeTasks = tasks.filter(task => task.type === type.name.toLowerCase());
                    const estimatedHours = typeTasks.reduce((sum, task) => sum + task.estimatedHours, 0);
                    const actualHours = typeTasks.reduce((sum, task) => sum + task.actualHours, 0);
                    
                    return (
                      <div key={type.name} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{type.name}</span>
                        <div className="text-right">
                          <div className="font-bold">{actualHours.toFixed(1)}h</div>
                          <div className="text-xs text-muted-foreground">
                            Est: {estimatedHours.toFixed(1)}h
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
