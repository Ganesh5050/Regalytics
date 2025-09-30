import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save, Calendar, Clock, Users, MapPin, Video, Phone } from "lucide-react";
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

interface EventFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'call' | 'appointment' | 'demo' | 'follow-up' | 'other';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  location: string;
  meetingLink: string;
  attendees: string[];
  organizer: string;
  isAllDay: boolean;
  isRecurring: boolean;
  recurrencePattern: string;
  reminder: number;
  tags: string[];
  relatedTo: string;
  relatedType: 'lead' | 'deal' | 'contact' | 'task' | 'email';
  notes: string;
}

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<EventFormData, 'id'>) => void;
  event?: EventFormData;
}

export function EventFormModal({ isOpen, onClose, onSave, event }: EventFormModalProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: event?.title || "",
    description: event?.description || "",
    startDate: event?.startDate || "",
    endDate: event?.endDate || "",
    startTime: event?.startTime || "",
    endTime: event?.endTime || "",
    type: event?.type || "meeting",
    status: event?.status || "scheduled",
    location: event?.location || "",
    meetingLink: event?.meetingLink || "",
    attendees: event?.attendees || [],
    organizer: event?.organizer || "",
    isAllDay: event?.isAllDay || false,
    isRecurring: event?.isRecurring || false,
    recurrencePattern: event?.recurrencePattern || "",
    reminder: event?.reminder || 15,
    tags: event?.tags || [],
    relatedTo: event?.relatedTo || "",
    relatedType: event?.relatedType || "contact",
    notes: event?.notes || ""
  });

  const [newTag, setNewTag] = useState("");
  const [newAttendee, setNewAttendee] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleAddAttendee = () => {
    if (newAttendee.trim() && !formData.attendees.includes(newAttendee.trim())) {
      setFormData({
        ...formData,
        attendees: [...formData.attendees, newAttendee.trim()]
      });
      setNewAttendee("");
    }
  };

  const handleRemoveAttendee = (attendeeToRemove: string) => {
    setFormData({
      ...formData,
      attendees: formData.attendees.filter(attendee => attendee !== attendeeToRemove)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          <DialogDescription>
            {event ? 'Update event details' : 'Schedule a new event or meeting'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Event Type *</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="appointment">Appointment</SelectItem>
                    <SelectItem value="demo">Demo</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="rescheduled">Rescheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Date and Time</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isAllDay"
                    checked={formData.isAllDay}
                    onChange={(e) => setFormData({ ...formData, isAllDay: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isAllDay" className="text-sm">
                    All Day Event
                  </Label>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isRecurring" className="text-sm">
                    Recurring Event
                  </Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
              {!formData.isAllDay && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                    />
                  </div>
                </>
              )}
              {formData.isRecurring && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="recurrencePattern">Recurrence Pattern</Label>
                  <Select value={formData.recurrencePattern} onValueChange={(value) => setFormData({ ...formData, recurrencePattern: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Location and Meeting Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Location and Meeting Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Physical location or room"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meetingLink">Meeting Link</Label>
                <Input
                  id="meetingLink"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  placeholder="Zoom, Teams, Google Meet URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizer">Organizer</Label>
                <Input
                  id="organizer"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  placeholder="Event organizer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reminder">Reminder (minutes before)</Label>
                <Select value={formData.reminder.toString()} onValueChange={(value) => setFormData({ ...formData, reminder: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No reminder</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="1440">1 day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Attendees */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Attendees</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add attendee..."
                  value={newAttendee}
                  onChange={(e) => setNewAttendee(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleAddAttendee)}
                />
                <Button type="button" onClick={handleAddAttendee} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.attendees.map((attendee) => (
                  <Badge key={attendee} variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {attendee}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveAttendee(attendee)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Related To */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Related To</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="relatedType">Related Type</Label>
                <Select value={formData.relatedType} onValueChange={(value: any) => setFormData({ ...formData, relatedType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="deal">Deal</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="relatedTo">Related ID</Label>
                <Input
                  id="relatedTo"
                  value={formData.relatedTo}
                  onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value })}
                  placeholder="Enter related ID"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Tags</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleAddTag)}
                />
                <Button type="button" onClick={handleAddTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notes</h3>
            <Textarea
              placeholder="Add notes about this event..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {event ? 'Update Event' : 'Create Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
