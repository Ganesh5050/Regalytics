import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  Calendar,
  Flag,
  MessageSquare
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  dueDate: string;
  createdDate: string;
  relatedTo: string;
  relatedType: 'lead' | 'deal' | 'contact' | 'email';
  tags: string[];
  estimatedHours: number;
  actualHours: number;
}

interface MobileTasksProps {
  className?: string;
}

export function MobileTasks({ className }: MobileTasksProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Mock data
  const tasks: Task[] = [
    {
      id: "1",
      title: "Follow up with TechCorp Solutions",
      description: "Schedule demo call for enterprise compliance solution",
      status: "in-progress",
      priority: "high",
      assignee: "Sarah Johnson",
      dueDate: "2024-01-25",
      createdDate: "2024-01-20",
      relatedTo: "TechCorp Solutions",
      relatedType: "lead",
      tags: ["demo", "enterprise"],
      estimatedHours: 2,
      actualHours: 1
    },
    {
      id: "2",
      title: "Prepare proposal for FinanceFirst",
      description: "Create detailed proposal for compliance automation",
      status: "todo",
      priority: "urgent",
      assignee: "Mike Chen",
      dueDate: "2024-01-24",
      createdDate: "2024-01-22",
      relatedTo: "FinanceFirst",
      relatedType: "deal",
      tags: ["proposal", "compliance"],
      estimatedHours: 4,
      actualHours: 0
    },
    {
      id: "3",
      title: "Update contact information",
      description: "Verify and update contact details for MedTech Innovations",
      status: "completed",
      priority: "medium",
      assignee: "Emily Davis",
      dueDate: "2024-01-23",
      createdDate: "2024-01-21",
      relatedTo: "MedTech Innovations",
      relatedType: "contact",
      tags: ["data-entry", "verification"],
      estimatedHours: 1,
      actualHours: 1
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="h-3 w-3 text-red-600" />;
      case 'high': return <Flag className="h-3 w-3 text-orange-600" />;
      case 'medium': return <Flag className="h-3 w-3 text-yellow-600" />;
      case 'low': return <Flag className="h-3 w-3 text-green-600" />;
      default: return <Flag className="h-3 w-3 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'todo': return <Clock className="h-4 w-4 text-gray-600" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.relatedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className={`space-y-4 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Tasks</h1>
          <p className="text-sm text-gray-500">{filteredTasks.length} tasks found</p>
        </div>
        <Button size="sm" className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Task</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <Card key={task.id} className={`p-4 ${isOverdue(task.dueDate) ? 'border-red-200 bg-red-50' : ''}`}>
            <CardContent className="p-0">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(task.status)}
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace('-', ' ')}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      {getPriorityIcon(task.priority)}
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Assignee and Due Date */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User className="h-3 w-3" />
                    <span>{task.assignee}</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-600'}`}>
                    <Calendar className="h-3 w-3" />
                    <span>{task.dueDate}</span>
                    {isOverdue(task.dueDate) && (
                      <AlertCircle className="h-3 w-3 text-red-600" />
                    )}
                  </div>
                </div>

                {/* Related To */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Related to:</span>
                  <Badge variant="outline" className="text-xs">
                    {task.relatedType}: {task.relatedTo}
                  </Badge>
                </div>

                {/* Tags */}
                {task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Time Tracking */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Estimated: {task.estimatedHours}h</span>
                  <span>Actual: {task.actualHours}h</span>
                  <span className={`${task.actualHours > task.estimatedHours ? 'text-red-600' : 'text-green-600'}`}>
                    {task.actualHours > task.estimatedHours ? 'Over' : 'Under'} budget
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Complete
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Comment
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Log Time
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">24</p>
              <p className="text-xs text-gray-500">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">156</p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">8</p>
              <p className="text-xs text-gray-500">Overdue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">12</p>
              <p className="text-xs text-gray-500">Urgent</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
