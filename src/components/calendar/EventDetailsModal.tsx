import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Video, 
  Phone, 
  Edit, 
  Trash2, 
  Copy, 
  X,
  Check,
  AlertCircle,
  Info
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  onUpdate: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
  onDuplicate: (event: CalendarEvent) => void;
}

export function EventDetailsModal({ 
  isOpen, 
  onClose, 
  event, 
  onUpdate, 
  onDelete, 
  onDuplicate 
}: EventDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editNotes, setEditNotes] = useState(event?.notes || "");
  const [editStatus, setEditStatus] = useState(event?.status || "scheduled");

  if (!event) return null;

  const handleSaveNotes = () => {
    const updatedEvent = { ...event, notes: editNotes };
    onUpdate(updatedEvent);
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus: string) => {
    const updatedEvent = { ...event, status: newStatus as any };
    onUpdate(updatedEvent);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      onDelete(event.id);
      onClose();
    }
  };

  const handleDuplicate = () => {
    onDuplicate(event);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Users className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'appointment': return <Calendar className="h-4 w-4" />;
      case 'demo': return <Video className="h-4 w-4" />;
      case 'follow-up': return <Clock className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-gray-100 text-gray-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'call': return 'bg-green-100 text-green-800';
      case 'appointment': return 'bg-purple-100 text-purple-800';
      case 'demo': return 'bg-orange-100 text-orange-800';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getTypeIcon(event.type)}
              <DialogTitle className="text-xl">{event.title}</DialogTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getTypeColor(event.type)}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </Badge>
              <Badge className={getStatusColor(event.status)}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Badge>
            </div>
          </div>
          <DialogDescription>
            {event.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Date</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(event.startDate)}
                  {event.endDate !== event.startDate && ` - ${formatDate(event.endDate)}`}
                </p>
              </div>

              {!event.isAllDay && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Time</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </p>
                </div>
              )}

              {event.location && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              )}

              {event.meetingLink && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Meeting Link</span>
                  </div>
                  <a 
                    href={event.meetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Join Meeting
                  </a>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Organizer</span>
                </div>
                <p className="text-sm text-muted-foreground">{event.organizer}</p>
              </div>

              {event.isRecurring && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Recurring</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {event.recurrencePattern?.charAt(0).toUpperCase() + event.recurrencePattern?.slice(1)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Attendees */}
          {event.attendees.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Attendees</h3>
              <div className="flex flex-wrap gap-2">
                {event.attendees.map((attendee) => (
                  <Badge key={attendee} variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {attendee}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Related To */}
          {event.relatedTo && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Related To</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {event.relatedType.charAt(0).toUpperCase() + event.relatedType.slice(1)}: {event.relatedTo}
                </Badge>
              </div>
            </div>
          )}

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Notes</h3>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={4}
                  placeholder="Add notes about this event..."
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleSaveNotes}>
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setEditNotes(event.notes);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {event.notes || "No notes added yet."}
              </p>
            )}
          </div>

          {/* Status Update */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Status</h3>
            <div className="flex flex-wrap gap-2">
              {['scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled'].map((status) => (
                <Button
                  key={status}
                  variant={event.status === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
          <Button onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
