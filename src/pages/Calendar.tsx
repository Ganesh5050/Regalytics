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
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  Video,
  Phone,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
  List,
  Grid3X3
} from "lucide-react";
import { EventFormModal } from "@/components/calendar/EventFormModal";
import { EventDetailsModal } from "@/components/calendar/EventDetailsModal";
import { CalendarView } from "@/components/calendar/CalendarView";
import { EventList } from "@/components/calendar/EventList";
import { CalendarAnalytics } from "@/components/calendar/CalendarAnalytics";
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
  reminder: number; // minutes before
  tags: string[];
  relatedTo: string; // Lead, Deal, Contact ID
  relatedType: 'lead' | 'deal' | 'contact' | 'task' | 'email';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Demo Call - TechCorp Solutions",
    description: "Product demonstration for compliance solution",
    startDate: "2024-01-25",
    endDate: "2024-01-25",
    startTime: "10:00",
    endTime: "11:00",
    type: "demo",
    status: "confirmed",
    location: "Conference Room A",
    attendees: ["Sarah Johnson", "John Smith", "Mike Chen"],
    organizer: "Sarah Johnson",
    isAllDay: false,
    isRecurring: false,
    reminder: 15,
    tags: ["demo", "enterprise", "compliance"],
    relatedTo: "1",
    relatedType: "deal",
    notes: "Key stakeholders will attend. Prepare demo environment.",
    createdAt: "2024-01-20T10:30:00Z",
    updatedAt: "2024-01-22T14:15:00Z"
  },
  {
    id: "2",
    title: "Follow-up Call - FinanceFirst",
    description: "Follow-up on proposal and next steps",
    startDate: "2024-01-26",
    endDate: "2024-01-26",
    startTime: "14:00",
    endTime: "14:30",
    type: "follow-up",
    status: "scheduled",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    attendees: ["Mike Chen", "Emily Davis"],
    organizer: "Mike Chen",
    isAllDay: false,
    isRecurring: false,
    reminder: 30,
    tags: ["follow-up", "proposal", "finance"],
    relatedTo: "2",
    relatedType: "deal",
    notes: "Discuss implementation timeline and pricing.",
    createdAt: "2024-01-21T09:00:00Z",
    updatedAt: "2024-01-21T09:00:00Z"
  },
  {
    id: "3",
    title: "Team Standup",
    description: "Daily team standup meeting",
    startDate: "2024-01-24",
    endDate: "2024-01-24",
    startTime: "09:00",
    endTime: "09:30",
    type: "meeting",
    status: "confirmed",
    location: "Main Conference Room",
    attendees: ["Sarah Johnson", "Mike Chen", "Admin"],
    organizer: "Admin",
    isAllDay: false,
    isRecurring: true,
    recurrencePattern: "daily",
    reminder: 5,
    tags: ["standup", "team", "daily"],
    relatedTo: "",
    relatedType: "task",
    notes: "Review daily progress and blockers.",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T08:00:00Z"
  }
];

const typeColors = {
  'meeting': 'bg-blue-100 text-blue-800',
  'call': 'bg-green-100 text-green-800',
  'appointment': 'bg-purple-100 text-purple-800',
  'demo': 'bg-orange-100 text-orange-800',
  'follow-up': 'bg-yellow-100 text-yellow-800',
  'other': 'bg-gray-100 text-gray-800'
};

const statusColors = {
  'scheduled': 'bg-gray-100 text-gray-800',
  'confirmed': 'bg-green-100 text-green-800',
  'completed': 'bg-blue-100 text-blue-800',
  'cancelled': 'bg-red-100 text-red-800',
  'rescheduled': 'bg-yellow-100 text-yellow-800'
};

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>(mockEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter events based on search and filters
  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.attendees.some(attendee => attendee.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(event => event.type === typeFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, typeFilter, statusFilter]);

  const handleAddEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const event: CalendarEvent = {
      ...newEvent,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEvents([...events, event]);
  };

  const handleUpdateEvent = (updatedEvent: CalendarEvent) => {
    setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
  };

  const handleViewEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const getStatusCount = (status: string) => {
    return events.filter(event => event.status === status).length;
  };

  const totalEvents = events.length;
  const todayEvents = events.filter(event => event.startDate === new Date().toISOString().split('T')[0]).length;
  const upcomingEvents = events.filter(event => new Date(event.startDate) > new Date()).length;
  const completedEvents = events.filter(event => event.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar & Scheduling</h1>
          <p className="text-muted-foreground">
            Manage your appointments, meetings, and events
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}>
            {viewMode === 'calendar' ? <List className="h-4 w-4 mr-2" /> : <Grid3X3 className="h-4 w-4 mr-2" />}
            {viewMode === 'calendar' ? 'List View' : 'Calendar View'}
          </Button>
          <Button onClick={() => setIsEventFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
                <CalendarCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayEvents}</div>
            <p className="text-xs text-muted-foreground">
              {todayEvents > 0 ? 'Events scheduled' : 'No events today'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedEvents}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="list">Event List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
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
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Calendar View */}
          <CalendarView 
            events={filteredEvents} 
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            onEventClick={handleViewEvent}
          />
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <EventList 
            events={filteredEvents}
            onEventClick={handleViewEvent}
            onEventUpdate={handleUpdateEvent}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <CalendarAnalytics events={events} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <EventFormModal
        isOpen={isEventFormOpen}
        onClose={() => setIsEventFormOpen(false)}
        onSave={handleAddEvent}
      />

      <EventDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        event={selectedEvent}
        onUpdate={handleUpdateEvent}
      />
    </div>
  );
}
