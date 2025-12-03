import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Edit, 
  Clock,
  User,
  Calendar,
  Flag,
  CheckCircle,
  Play,
  Pause,
  Square,
  MessageSquare,
  Paperclip
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdate: (task: Task) => void;
}

export function TaskDetailsModal({ isOpen, onClose, task, onUpdate }: TaskDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);

  if (!task) return null;

  const handleEdit = () => {
    setEditedTask({ ...task });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedTask) {
      onUpdate(editedTask);
      setIsEditing(false);
      setEditedTask(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask(null);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'todo': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'review': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
      case 'todo': return <Square className="h-4 w-4" />;
      case 'in-progress': return <Play className="h-4 w-4" />;
      case 'review': return <Pause className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <Square className="h-4 w-4" />;
      default: return <Square className="h-4 w-4" />;
    }
  };

  const currentTask = isEditing ? editedTask : task;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{currentTask?.title}</DialogTitle>
              <DialogDescription>
                {currentTask?.type} • {currentTask?.relatedType} #{currentTask?.relatedTo}
              </DialogDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(currentTask?.status || '')}>
                {getStatusIcon(currentTask?.status || '')}
                <span className="ml-1">{currentTask?.status?.replace('-', ' ')}</span>
              </Badge>
              <Badge className={getPriorityColor(currentTask?.priority || '')}>
                <Flag className="h-3 w-3 mr-1" />
                {currentTask?.priority}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={isEditing ? handleSave : handleEdit}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Save' : 'Edit'}
              </Button>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Task Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Task Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Description</Label>
                    {isEditing ? (
                      <Textarea
                        value={currentTask?.description || ''}
                        onChange={(e) => setEditedTask({ ...currentTask!, description: e.target.value })}
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm">{currentTask?.description}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Task Type</Label>
                      <p className="text-sm">{currentTask?.type}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Related To</Label>
                      <p className="text-sm">{currentTask?.relatedType} #{currentTask?.relatedTo}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assignment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Assignment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Assigned To</Label>
                    {isEditing ? (
                      <Input
                        value={currentTask?.assignedTo || ''}
                        onChange={(e) => setEditedTask({ ...currentTask!, assignedTo: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm font-medium">{currentTask?.assignedTo}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Created By</Label>
                    <p className="text-sm">{currentTask?.createdBy}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={currentTask?.dueDate || ''}
                        onChange={(e) => setEditedTask({ ...currentTask!, dueDate: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{currentTask?.dueDate}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Created Date</Label>
                    <p className="text-sm">{currentTask?.createdAt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Time Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold">{currentTask?.estimatedHours}h</div>
                    <div className="text-sm text-muted-foreground">Estimated</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Play className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold">{currentTask?.actualHours}h</div>
                    <div className="text-sm text-muted-foreground">Actual</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Calendar className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold">
                      {currentTask?.completedAt ? 'Completed' : 'Pending'}
                    </div>
                    <div className="text-sm text-muted-foreground">Status</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentTask?.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            {currentTask?.attachments && currentTask.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Paperclip className="h-5 w-5 mr-2" />
                    Attachments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentTask.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                        <Paperclip className="h-4 w-4" />
                        <span className="text-sm">{attachment}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Task created</p>
                        <p className="text-xs text-muted-foreground">{currentTask?.createdAt}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Created by {currentTask?.createdBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Status updated</p>
                        <p className="text-xs text-muted-foreground">{currentTask?.updatedAt}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Status changed to {currentTask?.status}
                      </p>
                    </div>
                  </div>
                  {currentTask?.completedAt && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Task completed</p>
                          <p className="text-xs text-muted-foreground">{currentTask.completedAt}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Completed by {currentTask.assignedTo}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={currentTask?.notes || ''}
                    onChange={(e) => setEditedTask({ ...currentTask!, notes: e.target.value })}
                    rows={6}
                    placeholder="Add notes about this task..."
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{currentTask?.notes || 'No notes available'}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
