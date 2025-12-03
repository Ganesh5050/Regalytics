import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { AlertTriangle, Clock, User, DollarSign, FileText } from 'lucide-react';

interface AlertFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AlertFormData {
  title: string;
  description: string;
  priority: string;
  category: string;
  assignedTo: string;
  dueDate: string;
  clientId: string;
  transactionId: string;
  notes: string;
}

export function AlertFormModal({ isOpen, onClose }: AlertFormModalProps) {
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState<AlertFormData>({
    title: '',
    description: '',
    priority: 'medium',
    category: 'compliance',
    assignedTo: '',
    dueDate: '',
    clientId: '',
    transactionId: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof AlertFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call the real backend API
      const response = await fetch('http://localhost:3001/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          category: formData.category,
          assignedTo: formData.assignedTo,
          dueDate: formData.dueDate,
          clientId: formData.clientId,
          transactionId: formData.transactionId,
          notes: formData.notes
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      addNotification({
        type: 'success',
        title: 'Alert Created Successfully',
        message: `Alert "${formData.title}" has been created with ID: ${result.id || 'N/A'}`
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'compliance',
        assignedTo: '',
        dueDate: '',
        clientId: '',
        transactionId: '',
        notes: ''
      });

      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addNotification({
        type: 'error',
        title: 'Alert Creation Failed',
        message: `Failed to create alert: ${errorMessage}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'compliance': return 'bg-blue-100 text-blue-800';
      case 'transaction': return 'bg-purple-100 text-purple-800';
      case 'kyc': return 'bg-indigo-100 text-indigo-800';
      case 'risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Create New Alert
          </DialogTitle>
          <DialogDescription>
            Create a manual alert for compliance monitoring or risk management.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Alert Details
              </CardTitle>
              <CardDescription>Basic alert information and classification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Alert Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter alert title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the alert details"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="transaction">Transaction</SelectItem>
                      <SelectItem value="kyc">KYC</SelectItem>
                      <SelectItem value="risk">Risk Assessment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment & Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Assignment & Timeline
              </CardTitle>
              <CardDescription>Assign responsibility and set deadlines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange('assignedTo', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin User</SelectItem>
                      <SelectItem value="compliance">Compliance Team</SelectItem>
                      <SelectItem value="risk">Risk Management</SelectItem>
                      <SelectItem value="operations">Operations Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Entities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Related Entities
              </CardTitle>
              <CardDescription>Link to specific clients or transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input
                    id="clientId"
                    value={formData.clientId}
                    onChange={(e) => handleInputChange('clientId', e.target.value)}
                    placeholder="Enter client ID (optional)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transactionId">Transaction ID</Label>
                  <Input
                    id="transactionId"
                    value={formData.transactionId}
                    onChange={(e) => handleInputChange('transactionId', e.target.value)}
                    placeholder="Enter transaction ID (optional)"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional notes or context"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
              <CardDescription>Review the alert information before creation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{formData.title || 'Alert Title'}</span>
                  <div className="flex gap-2">
                    <Badge className={getPriorityBadgeColor(formData.priority)}>
                      {formData.priority.toUpperCase()}
                    </Badge>
                    <Badge className={getCategoryBadgeColor(formData.category)}>
                      {formData.category.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{formData.description || 'No description provided'}</p>
                  {formData.assignedTo && (
                    <p>Assigned to: {formData.assignedTo}</p>
                  )}
                  {formData.dueDate && (
                    <p>Due: {new Date(formData.dueDate).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Alert'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
