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
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
  Flag,
  MoreHorizontal,
  Play,
  Pause,
  Square
} from "lucide-react";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";
import { TaskDetailsModal } from "@/components/tasks/TaskDetailsModal";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { TaskAnalytics } from "@/components/tasks/TaskAnalytics";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  relatedTo: string; // Lead, Deal, Contact ID
  relatedType: 'lead' | 'deal' | 'contact';
  notes: string;
  attachments: string[];
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Follow up with John Smith",
    description: "Call to discuss compliance solution proposal",
    status: "in-progress",
    priority: "high",
    type: "call",
    assignedTo: "Sarah Johnson",
    createdBy: "Mike Chen",
    dueDate: "2024-01-25",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-22",
    estimatedHours: 1,
    actualHours: 0.5,
    tags: ["follow-up", "proposal"],
    relatedTo: "1",
    relatedType: "lead",
    notes: "John showed interest in enterprise package",
    attachments: []
  },
  {
    id: "2",
    title: "Prepare demo for FinanceFirst",
    description: "Create presentation for compliance automation demo",
    status: "todo",
    priority: "urgent",
    type: "meeting",
    assignedTo: "Mike Chen",
    createdBy: "Sarah Johnson",
    dueDate: "2024-01-24",
    createdAt: "2024-01-21",
    updatedAt: "2024-01-21",
    estimatedHours: 3,
    actualHours: 0,
    tags: ["demo", "presentation"],
    relatedTo: "2",
    relatedType: "deal",
    notes: "Key stakeholders will attend",
    attachments: []
  },
  {
    id: "3",
    title: "Send contract to MetroBank",
    description: "Email the finalized contract for risk assessment project",
    status: "review",
    priority: "medium",
    type: "email",
    assignedTo: "Sarah Johnson",
    createdBy: "Mike Chen",
    dueDate: "2024-01-23",
    createdAt: "2024-01-19",
    updatedAt: "2024-01-22",
    estimatedHours: 0.5,
    actualHours: 0.5,
    tags: ["contract", "legal"],
    relatedTo: "3",
    relatedType: "deal",
    notes: "Waiting for legal review",
    attachments: ["contract.pdf"]
  }
];

const statusColors = {
  'todo': 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'review': 'bg-yellow-100 text-yellow-800',
  'completed': 'bg-green-100 text-green-800',
  'cancelled': 'bg-red-100 text-red-800'
};

const priorityColors = {
  'low': 'bg-gray-100 text-gray-800',
  'medium': 'bg-blue-100 text-blue-800',
  'high': 'bg-orange-100 text-orange-800',
  'urgent': 'bg-red-100 text-red-800'
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [assignedFilter, setAssignedFilter] = useState<string>("all");
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter tasks based on search and filters
  useEffect(() => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    if (assignedFilter !== "all") {
      filtered = filtered.filter(task => task.assignedTo === assignedFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, statusFilter, priorityFilter, assignedFilter]);

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      actualHours: 0
    };
    setTasks([...tasks, task]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  const getStatusCount = (status: string) => {
    return tasks.filter(task => task.status === status).length;
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const overdueTasks = tasks.filter(task => new Date(task.dueDate) < new Date() && task.status !== 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
          <p className="text-muted-foreground">
            Manage tasks, activities, and follow-ups for your sales team
          </p>
        </div>
        <Button onClick={() => setIsTaskFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* KPI Cards */}
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
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground">
              -5% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="board" className="space-y-6">
        <TabsList>
          <TabsTrigger value="board">Board View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="space-y-6">
          <TaskBoard tasks={tasks} onUpdateTask={handleUpdateTask} onViewTask={handleViewTask} />
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={assignedFilter} onValueChange={setAssignedFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Assigned To" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Table */}
          <Card>
            <CardHeader>
              <CardTitle>Tasks ({filteredTasks.length})</CardTitle>
              <CardDescription>
                Manage your tasks and track their progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleViewTask(task)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-muted-foreground">{task.description}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={statusColors[task.status]}>
                          {task.status.replace('-', ' ')}
                        </Badge>
                        <Badge className={priorityColors[task.priority]}>
                          {task.priority}
                        </Badge>
                        <Badge variant="outline">{task.type}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{task.assignedTo}</div>
                        <div className="text-sm text-muted-foreground">Due: {task.dueDate}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost">
                          <Play className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewTask(task)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="h-4 w-4 mr-2" />
                              Reschedule
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <User className="h-4 w-4 mr-2" />
                              Reassign
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <TaskAnalytics tasks={tasks} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <TaskFormModal
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSave={handleAddTask}
      />

      <TaskDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        task={selectedTask}
        onUpdate={handleUpdateTask}
      />
    </div>
  );
}
