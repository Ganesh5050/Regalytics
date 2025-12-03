import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Video, 
  Phone, 
  Info,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Check
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface EventListProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onEventUpdate: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  onEventDuplicate?: (event: CalendarEvent) => void;
}

export function EventList({ 
  events, 
  onEventClick, 
  onEventUpdate, 
  onEventDelete, 
  onEventDuplicate 
}: EventListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("startDate");
  const [sortOrder, setSortOrder] = useState<string>("asc");

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getRelativeDate = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0) return `In ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
  };

  const filteredAndSortedEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.attendees.some(attendee => attendee.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = typeFilter === "all" || event.type === typeFilter;
      const matchesStatus = statusFilter === "all" || event.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'startDate':
        default:
          aValue = new Date(a.startDate).getTime();
          bValue = new Date(b.startDate).getTime();
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleStatusChange = (event: CalendarEvent, newStatus: string) => {
    const updatedEvent = { ...event, status: newStatus as any };
    onEventUpdate(updatedEvent);
  };

  const handleDelete = (event: CalendarEvent) => {
    if (onEventDelete && window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      onEventDelete(event.id);
    }
  };

  const handleDuplicate = (event: CalendarEvent) => {
    if (onEventDuplicate) {
      onEventDuplicate(event);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="appointment">Appointment</SelectItem>
                <SelectItem value="demo">Demo</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startDate">Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="type">Type</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-3">
        {filteredAndSortedEvents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No events found</h3>
              <p className="text-muted-foreground">
                {searchTerm || typeFilter !== "all" || statusFilter !== "all" 
                  ? "Try adjusting your filters or search terms."
                  : "No events scheduled. Create your first event to get started."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1" onClick={() => onEventClick(event)}>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(event.type)}
                        <h3 className="font-medium text-lg">{event.title}</h3>
                      </div>
                      <Badge className={getTypeColor(event.type)}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </Badge>
                    </div>
                    
                    {event.description && (
                      <p className="text-muted-foreground mb-3">{event.description}</p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(event.startDate)}</span>
                        <span className="text-muted-foreground">({getRelativeDate(event.startDate)})</span>
                      </div>
                      
                      {!event.isAllDay && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                        </div>
                      )}
                      
                      {event.location && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    
                    {event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {event.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEventClick(event)}>
                          <Edit className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(event, 'confirmed')}>
                          <Check className="h-4 w-4 mr-2" />
                          Mark as Confirmed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(event, 'completed')}>
                          <Check className="h-4 w-4 mr-2" />
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(event)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(event)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
