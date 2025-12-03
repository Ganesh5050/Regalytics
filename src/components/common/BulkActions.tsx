import React, { useState } from 'react';
import { 
  Trash2, 
  Download, 
  Edit, 
  Mail, 
  Tag, 
  Archive,
  MoreHorizontal,
  CheckSquare,
  Square
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface BulkActionsProps {
  selectedItems: string[];
  totalItems: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkDelete: (items: string[]) => void;
  onBulkUpdate: (items: string[], updates: Record<string, any>) => void;
  onBulkExport: (items: string[]) => void;
  onBulkEmail: (items: string[]) => void;
  onBulkTag: (items: string[], tag: string) => void;
  onBulkArchive: (items: string[]) => void;
  itemType: 'leads' | 'contacts' | 'tasks' | 'deals' | 'documents' | 'emails';
  className?: string;
}

export function BulkActions({
  selectedItems,
  totalItems,
  onSelectAll,
  onClearSelection,
  onBulkDelete,
  onBulkUpdate,
  onBulkExport,
  onBulkEmail,
  onBulkTag,
  onBulkArchive,
  itemType,
  className
}: BulkActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [updateData, setUpdateData] = useState({
    status: '',
    priority: '',
    notes: ''
  });

  const isAllSelected = selectedItems.length === totalItems;
  const isPartiallySelected = selectedItems.length > 0 && selectedItems.length < totalItems;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onClearSelection();
    } else {
      onSelectAll();
    }
  };

  const handleBulkDelete = () => {
    onBulkDelete(selectedItems);
    setShowDeleteDialog(false);
    onClearSelection();
  };

  const handleBulkUpdate = () => {
    const updates: Record<string, any> = {};
    if (updateData.status) updates.status = updateData.status;
    if (updateData.priority) updates.priority = updateData.priority;
    if (updateData.notes) updates.notes = updateData.notes;
    
    onBulkUpdate(selectedItems, updates);
    setShowUpdateDialog(false);
    setUpdateData({ status: '', priority: '', notes: '' });
    onClearSelection();
  };

  const handleBulkTag = () => {
    if (newTag.trim()) {
      onBulkTag(selectedItems, newTag.trim());
      setShowTagDialog(false);
      setNewTag('');
      onClearSelection();
    }
  };

  const getItemTypeLabel = () => {
    return itemType.charAt(0).toUpperCase() + itemType.slice(1);
  };

  if (selectedItems.length === 0) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSelectAll}
          className="h-8 w-8 p-0"
        >
          {isAllSelected ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </Button>
        <span className="text-sm text-muted-foreground">
          {isAllSelected ? 'Deselect all' : 'Select all'} {totalItems} {getItemTypeLabel().toLowerCase()}
        </span>
      </div>
    );
  }

  return (
    <>
      <div className={cn("flex items-center gap-2 p-3 bg-muted/50 rounded-lg", className)}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSelectAll}
          className="h-8 w-8 p-0"
        >
          {isAllSelected ? (
            <CheckSquare className="h-4 w-4" />
          ) : isPartiallySelected ? (
            <div className="h-4 w-4 border-2 border-primary rounded-sm bg-primary/20" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </Button>
        
        <Badge variant="secondary" className="text-xs">
          {selectedItems.length} selected
        </Badge>

        <div className="flex items-center gap-1 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkExport(selectedItems)}
            className="h-8"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowUpdateDialog(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Update Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowTagDialog(true)}>
                <Tag className="h-4 w-4 mr-2" />
                Add Tag
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBulkEmail(selectedItems)}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBulkArchive(selectedItems)}>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-8 text-muted-foreground"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedItems.length} {getItemTypeLabel().toLowerCase()}?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the selected {getItemTypeLabel().toLowerCase()}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update {selectedItems.length} {getItemTypeLabel().toLowerCase()}</DialogTitle>
            <DialogDescription>
              Update the status and priority for the selected {getItemTypeLabel().toLowerCase()}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                value={updateData.status}
                onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value }))}
                placeholder="Enter new status"
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                value={updateData.priority}
                onChange={(e) => setUpdateData(prev => ({ ...prev, priority: e.target.value }))}
                placeholder="Enter new priority"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={updateData.notes}
                onChange={(e) => setUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add notes (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkUpdate}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tag Dialog */}
      <Dialog open={showTagDialog} onOpenChange={setShowTagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tag to {selectedItems.length} {getItemTypeLabel().toLowerCase()}</DialogTitle>
            <DialogDescription>
              Add a tag to the selected {getItemTypeLabel().toLowerCase()}.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="tag">Tag</Label>
            <Input
              id="tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Enter tag name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTagDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkTag} disabled={!newTag.trim()}>
              Add Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
