import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar,
  Clock,
  User,
  Filter,
  Search
} from "lucide-react";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  department: string;
  address: string;
  city: string;
  state: string;
  country: string;
  website: string;
  source: string;
  status: 'active' | 'inactive' | 'prospect' | 'customer' | 'vendor';
  tags: string[];
  notes: string;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  totalInteractions: number;
  lastInteraction: string;
  preferredContact: 'email' | 'phone' | 'sms';
  timezone: string;
  language: string;
}

interface Communication {
  id: string;
  contactId: string;
  type: 'email' | 'phone' | 'meeting' | 'note' | 'sms';
  subject: string;
  content: string;
  direction: 'inbound' | 'outbound';
  date: string;
  duration?: number; // in minutes for calls/meetings
  status: 'completed' | 'scheduled' | 'pending' | 'failed';
  assignedTo: string;
  tags: string[];
}

const mockCommunications: Communication[] = [
  {
    id: "1",
    contactId: "1",
    type: "email",
    subject: "Follow-up on compliance solution",
    content: "Thank you for the demo. We're interested in moving forward with the enterprise package.",
    direction: "inbound",
    date: "2024-01-22T10:30:00Z",
    status: "completed",
    assignedTo: "Sarah Johnson",
    tags: ["follow-up", "positive"]
  },
  {
    id: "2",
    contactId: "1",
    type: "phone",
    subject: "Initial discovery call",
    content: "Discussed current compliance challenges and requirements. They need enterprise-level solution.",
    direction: "outbound",
    date: "2024-01-20T14:00:00Z",
    duration: 45,
    status: "completed",
    assignedTo: "Sarah Johnson",
    tags: ["discovery", "requirements"]
  },
  {
    id: "3",
    contactId: "2",
    type: "meeting",
    subject: "Product demo - Compliance Suite",
    content: "Scheduled demo for next week. Key stakeholders will attend.",
    direction: "outbound",
    date: "2024-01-21T09:00:00Z",
    duration: 60,
    status: "scheduled",
    assignedTo: "Mike Chen",
    tags: ["demo", "scheduled"]
  },
  {
    id: "4",
    contactId: "3",
    type: "note",
    subject: "Risk assessment discussion",
    content: "Contacted about their risk management needs. Very interested in our risk assessment tools.",
    direction: "outbound",
    date: "2024-01-20T16:30:00Z",
    status: "completed",
    assignedTo: "Sarah Johnson",
    tags: ["risk", "assessment"]
  }
];

interface CommunicationHistoryProps {
  contacts: Contact[];
}

export function CommunicationHistory({ contacts }: CommunicationHistoryProps) {
  const [communications, setCommunications] = useState<Communication[]>(mockCommunications);
  const [filteredCommunications, setFilteredCommunications] = useState<Communication[]>(mockCommunications);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [contactFilter, setContactFilter] = useState<string>("all");

  // Filter communications
  const filterCommunications = () => {
    let filtered = communications;

    if (searchTerm) {
      filtered = filtered.filter(comm =>
        comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comm.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(comm => comm.type === typeFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(comm => comm.status === statusFilter);
    }

    if (contactFilter !== "all") {
      filtered = filtered.filter(comm => comm.contactId === contactFilter);
    }

    setFilteredCommunications(filtered);
  };

  // Apply filters when dependencies change
  React.useEffect(() => {
    filterCommunications();
  }, [searchTerm, typeFilter, statusFilter, contactFilter, communications]);

  const getContactName = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown';
  };

  const getContactCompany = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? contact.company : 'Unknown';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'note': return <MessageSquare className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800';
      case 'phone': return 'bg-green-100 text-green-800';
      case 'meeting': return 'bg-purple-100 text-purple-800';
      case 'note': return 'bg-yellow-100 text-yellow-800';
      case 'sms': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Communication Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search communications..."
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
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="note">Note</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={contactFilter} onValueChange={setContactFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Contact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contacts</SelectItem>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.firstName} {contact.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Communication List */}
      <Card>
        <CardHeader>
          <CardTitle>Communication History ({filteredCommunications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCommunications.map((comm) => (
              <div
                key={comm.id}
                className="p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                      {getTypeIcon(comm.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{comm.subject}</h4>
                        <Badge className={getTypeColor(comm.type)}>
                          {comm.type}
                        </Badge>
                        <Badge className={getStatusColor(comm.status)}>
                          {comm.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {getContactName(comm.contactId)} • {getContactCompany(comm.contactId)}
                      </p>
                      <p className="text-sm mb-2">{comm.content}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(comm.date)}
                        </div>
                        {comm.duration && (
                          <div>Duration: {comm.duration} min</div>
                        )}
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {comm.assignedTo}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {comm.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
