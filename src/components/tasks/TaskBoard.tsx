import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock,
  User,
  Calendar,
  Flag,
  MoreHorizontal,
  Play,
  Pause,
  CheckCircle,
  Square
} from "lucide-react";
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
  relatedTo: string;
  relatedType: 'lead' | 'deal' | 'contact';
  notes: string;
  attachments: string[];
}

interface TaskBoardProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onViewTask: (task: Task) => void;
}

const boardColumns = [
  { id: 'todo', name: 'To Do', color: 'bg-gray-100 text-gray-800' },
  { id: 'in-progress', name: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { id: 'review', name: 'Review', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'completed', name: 'Completed', color: 'bg-green-100 text-green-800' },
  { id: 'cancelled', name: 'Cancelled', color: 'bg-red-100 text-red-800' }
];

export function TaskBoard({ tasks, onUpdateTask, onViewTask }: TaskBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      const updatedTask = { 
        ...draggedTask, 
        status: newStatus as any,
        updatedAt: new Date().toISOString().split('T')[0],
        completedAt: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined
      };
      onUpdateTask(updatedTask);
    }
    setDraggedTask(null);
  };

  const getStatusCount = (status: string) => {
    return getTasksByStatus(status).length;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'bg-gray-100 text-gray-800',
      'medium': 'bg-blue-100 text-blue-800',
      'high': 'bg-orange-100 text-orange-800',
      'urgent': 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return <Square className="h-3 w-3" />;
      case 'in-progress': return <Play className="h-3 w-3" />;
      case 'review': return <Pause className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'cancelled': return <Square className="h-3 w-3" />;
      default: return <Square className="h-3 w-3" />;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !tasks.find(t => t.id === tasks.find(t => t.dueDate === dueDate)?.id)?.completedAt;
  };

  return (
    <div className="space-y-6">
      {/* Board Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Task Board Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {boardColumns.map((column) => (
              <div key={column.id} className="text-center">
                <div className="text-2xl font-bold">{getStatusCount(column.id)}</div>
                <div className="text-sm text-muted-foreground">{column.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {boardColumns.map((column) => (
          <Card key={column.id} className="min-h-[500px]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{column.name}</CardTitle>
                <Badge className={column.color}>
                  {getStatusCount(column.id)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent
              className="space-y-3"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {getTasksByStatus(column.id).map((task) => (
                <div
                  key={task.id}
                  className="p-3 border rounded-lg bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  onClick={() => onViewTask(task)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewTask(task)}>
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
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          <Flag className="h-2 w-2 mr-1" />
                          {task.priority}
                        </Badge>
                        <Badge variant="outline">{task.type}</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      <span>{task.assignedTo}</span>
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className={isOverdue(task.dueDate) ? 'text-red-600 font-medium' : ''}>
                        Due: {task.dueDate}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{task.estimatedHours}h estimated</span>
                    </div>
                    
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {task.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {task.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            +{task.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {getTasksByStatus(column.id).length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  No tasks in this column
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Board Instructions */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>💡 <strong>Tip:</strong> Drag and drop tasks between columns to update their status</p>
            <p>Click on any task card to view detailed information</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
