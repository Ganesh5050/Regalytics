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
  Phone, 
  Mail, 
  Calendar,
  MessageSquare,
  Building,
  User,
  MapPin,
  Globe,
  Star,
  MoreHorizontal
} from "lucide-react";
import { ContactFormModal } from "@/components/contacts/ContactFormModal";
import { ContactDetailsModal } from "@/components/contacts/ContactDetailsModal";
import { CommunicationHistory } from "@/components/contacts/CommunicationHistory";
import { ContactAnalytics } from "@/components/contacts/ContactAnalytics";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const mockContacts: Contact[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@techcorp.com",
    phone: "+1-555-0123",
    company: "TechCorp Solutions",
    title: "Chief Technology Officer",
    department: "Technology",
    address: "123 Tech Street",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    website: "https://techcorp.com",
    source: "Website",
    status: "customer",
    tags: ["enterprise", "decision-maker", "high-value"],
    notes: "Primary decision maker for enterprise solutions",
    assignedTo: "Sarah Johnson",
    createdAt: "2024-01-15",
    lastContact: "2024-01-22",
    totalInteractions: 15,
    lastInteraction: "2024-01-22",
    preferredContact: "email",
    timezone: "PST",
    language: "English"
  },
  {
    id: "2",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@finance.com",
    phone: "+1-555-0456",
    company: "FinanceFirst",
    title: "Compliance Manager",
    department: "Compliance",
    address: "456 Finance Ave",
    city: "New York",
    state: "NY",
    country: "USA",
    website: "https://financefirst.com",
    source: "Referral",
    status: "prospect",
    tags: ["finance", "compliance", "urgent"],
    notes: "Interested in compliance automation",
    assignedTo: "Mike Chen",
    createdAt: "2024-01-10",
    lastContact: "2024-01-21",
    totalInteractions: 8,
    lastInteraction: "2024-01-21",
    preferredContact: "phone",
    timezone: "EST",
    language: "English"
  },
  {
    id: "3",
    firstName: "Robert",
    lastName: "Wilson",
    email: "r.wilson@banking.com",
    phone: "+1-555-0789",
    company: "MetroBank",
    title: "Risk Director",
    department: "Risk Management",
    address: "789 Banking Blvd",
    city: "Chicago",
    state: "IL",
    country: "USA",
    website: "https://metrobank.com",
    source: "LinkedIn",
    status: "active",
    tags: ["banking", "risk", "enterprise"],
    notes: "Key contact for risk management solutions",
    assignedTo: "Sarah Johnson",
    createdAt: "2024-01-18",
    lastContact: "2024-01-20",
    totalInteractions: 12,
    lastInteraction: "2024-01-20",
    preferredContact: "email",
    timezone: "CST",
    language: "English"
  }
];

const statusColors = {
  'active': 'bg-green-100 text-green-800',
  'inactive': 'bg-gray-100 text-gray-800',
  'prospect': 'bg-blue-100 text-blue-800',
  'customer': 'bg-emerald-100 text-emerald-800',
  'vendor': 'bg-purple-100 text-purple-800'
};

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(mockContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter contacts based on search and filters
  useEffect(() => {
    let filtered = contacts;

    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(contact => contact.status === statusFilter);
    }

    if (companyFilter !== "all") {
      filtered = filtered.filter(contact => contact.company === companyFilter);
    }

    setFilteredContacts(filtered);
  }, [contacts, searchTerm, statusFilter, companyFilter]);

  const handleAddContact = (newContact: Omit<Contact, 'id'>) => {
    const contact: Contact = {
      ...newContact,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      totalInteractions: 0
    };
    setContacts([...contacts, contact]);
  };

  const handleUpdateContact = (updatedContact: Contact) => {
    setContacts(contacts.map(contact => contact.id === updatedContact.id ? updatedContact : contact));
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailsOpen(true);
  };

  const getStatusCount = (status: string) => {
    return contacts.filter(contact => contact.status === status).length;
  };

  const totalContacts = contacts.length;
  const activeContacts = contacts.filter(contact => contact.status === 'active').length;
  const customerContacts = contacts.filter(contact => contact.status === 'customer').length;
  const avgInteractions = contacts.reduce((sum, contact) => sum + contact.totalInteractions, 0) / contacts.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Management</h1>
          <p className="text-muted-foreground">
            Manage your contacts and track communication history
          </p>
        </div>
        <Button onClick={() => setIsContactFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeContacts}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerContacts}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Interactions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgInteractions)}</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">Contact List</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={companyFilter} onValueChange={setCompanyFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    <SelectItem value="TechCorp Solutions">TechCorp Solutions</SelectItem>
                    <SelectItem value="FinanceFirst">FinanceFirst</SelectItem>
                    <SelectItem value="MetroBank">MetroBank</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contacts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Contacts ({filteredContacts.length})</CardTitle>
              <CardDescription>
                Manage your contacts and track their information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleViewContact(contact)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {contact.firstName[0]}{contact.lastName[0]}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                        <div className="text-sm text-muted-foreground">{contact.title} at {contact.company}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={statusColors[contact.status]}>
                          {contact.status}
                        </Badge>
                        <Badge variant="outline">{contact.totalInteractions} interactions</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{contact.email}</div>
                        <div className="text-sm text-muted-foreground">{contact.phone}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewContact(contact)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="h-4 w-4 mr-2" />
                              Schedule Meeting
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <CommunicationHistory contacts={contacts} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <ContactAnalytics contacts={contacts} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ContactFormModal
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
        onSave={handleAddContact}
      />

      <ContactDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        contact={selectedContact}
        onUpdate={handleUpdateContact}
      />
    </div>
  );
}
