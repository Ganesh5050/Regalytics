import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  Video,
  Phone,
  Info
} from "lucide-react";

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

interface CalendarViewProps {
  events: CalendarEvent[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function CalendarView({ events, currentDate, onDateChange, onEventClick }: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.startDate === dateString);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Users className="h-3 w-3" />;
      case 'call': return <Phone className="h-3 w-3" />;
      case 'appointment': return <CalendarIcon className="h-3 w-3" />;
      case 'demo': return <Video className="h-3 w-3" />;
      case 'follow-up': return <Clock className="h-3 w-3" />;
      default: return <Info className="h-3 w-3" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'call': return 'bg-green-100 text-green-800 border-green-200';
      case 'appointment': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'demo': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'border-gray-300';
      case 'confirmed': return 'border-green-300';
      case 'completed': return 'border-blue-300';
      case 'cancelled': return 'border-red-300';
      case 'rescheduled': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('month')}
          >
            Month
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('week')}
          >
            Week
          </Button>
          <Button
            variant={viewMode === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('day')}
          >
            Day
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b">
            {dayNames.map((day) => (
              <div key={day} className="p-3 text-center font-medium text-muted-foreground border-r last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} className="h-24 border-r last:border-r-0" />;
              }

              const dayEvents = getEventsForDate(date);
              const isCurrentDay = isToday(date);
              const isCurrentMonthDay = isCurrentMonth(date);

              return (
                <div
                  key={date.toISOString()}
                  className={`min-h-24 p-2 border-r last:border-r-0 border-b last:border-b-0 ${
                    isCurrentDay ? 'bg-blue-50' : ''
                  } ${!isCurrentMonthDay ? 'bg-gray-50 text-muted-foreground' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${isCurrentDay ? 'text-blue-600' : ''}`}>
                      {date.getDate()}
                    </span>
                    {dayEvents.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {dayEvents.length}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className={`text-xs p-1 rounded cursor-pointer border-l-2 ${getTypeColor(event.type)} ${getStatusColor(event.status)} hover:shadow-sm transition-shadow`}
                        title={`${event.title} - ${formatTime(event.startTime)}`}
                      >
                        <div className="flex items-center space-x-1">
                          {getTypeIcon(event.type)}
                          <span className="truncate">{event.title}</span>
                        </div>
                        {!event.isAllDay && (
                          <div className="text-xs opacity-75">
                            {formatTime(event.startTime)}
                          </div>
                        )}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
          <span>Meeting</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
          <span>Call</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded"></div>
          <span>Appointment</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>
          <span>Demo</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
          <span>Follow-up</span>
        </div>
      </div>
    </div>
  );
}
