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
  Send,
  Mail,
  MailOpen,
  Reply,
  Forward,
  Archive,
  Trash2,
  Star,
  Clock,
  User,
  MoreHorizontal,
  Eye,
  EyeOff
} from "lucide-react";
import { EmailFormModal } from "@/components/email/EmailFormModal";
import { EmailDetailsModal } from "@/components/email/EmailDetailsModal";
import { EmailTemplates } from "@/components/email/EmailTemplates";
import { EmailCampaigns } from "@/components/email/EmailCampaigns";
import { EmailAnalytics } from "@/components/email/EmailAnalytics";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Email {
  id: string;
  subject: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  body: string;
  type: 'sent' | 'received' | 'draft' | 'scheduled';
  status: 'read' | 'unread' | 'replied' | 'forwarded' | 'archived';
  priority: 'low' | 'normal' | 'high';
  tags: string[];
  attachments: string[];
  sentAt: string;
  receivedAt?: string;
  relatedTo: string; // Lead, Deal, Contact ID
  relatedType: 'lead' | 'deal' | 'contact';
  templateId?: string;
  campaignId?: string;
  isStarred: boolean;
  isImportant: boolean;
}

const mockEmails: Email[] = [
  {
    id: "1",
    subject: "Follow-up on Compliance Solution Proposal",
    from: "john.smith@techcorp.com",
    to: ["sarah.johnson@regalytics.com"],
    body: "Thank you for the comprehensive proposal. We're very interested in moving forward with the enterprise compliance package. Could we schedule a call to discuss the implementation timeline?",
    type: "received",
    status: "read",
    priority: "high",
    tags: ["proposal", "follow-up", "enterprise"],
    attachments: ["proposal.pdf"],
    sentAt: "2024-01-22T10:30:00Z",
    receivedAt: "2024-01-22T10:35:00Z",
    relatedTo: "1",
    relatedType: "lead",
    isStarred: true,
    isImportant: true
  },
  {
    id: "2",
    subject: "Demo Invitation - FinanceFirst Compliance Suite",
    from: "mike.chen@regalytics.com",
    to: ["emily.davis@finance.com"],
    body: "Hi Emily, I'd like to invite you to a personalized demo of our compliance automation suite. Based on our previous conversation, I believe this will address your specific needs for transaction monitoring and reporting.",
    type: "sent",
    status: "read",
    priority: "normal",
    tags: ["demo", "invitation", "compliance"],
    attachments: [],
    sentAt: "2024-01-21T14:00:00Z",
    relatedTo: "2",
    relatedType: "deal",
    isStarred: false,
    isImportant: true
  },
  {
    id: "3",
    subject: "Contract Review - MetroBank Risk Assessment",
    from: "legal@metrobank.com",
    to: ["sarah.johnson@regalytics.com"],
    body: "Please find attached the revised contract for the risk assessment project. We've incorporated your feedback and are ready to proceed with the implementation phase.",
    type: "received",
    status: "unread",
    priority: "high",
    tags: ["contract", "legal", "risk"],
    attachments: ["contract_v2.pdf", "terms.pdf"],
    sentAt: "2024-01-23T09:15:00Z",
    receivedAt: "2024-01-23T09:20:00Z",
    relatedTo: "3",
    relatedType: "deal",
    isStarred: false,
    isImportant: true
  }
];

const statusColors = {
  'read': 'bg-blue-100 text-blue-800',
  'unread': 'bg-gray-100 text-gray-800',
  'replied': 'bg-green-100 text-green-800',
  'forwarded': 'bg-purple-100 text-purple-800',
  'archived': 'bg-yellow-100 text-yellow-800'
};

const priorityColors = {
  'low': 'bg-gray-100 text-gray-800',
  'normal': 'bg-blue-100 text-blue-800',
  'high': 'bg-red-100 text-red-800'
};

export default function Email() {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [filteredEmails, setFilteredEmails] = useState<Email[]>(mockEmails);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter emails based on search and filters
  useEffect(() => {
    let filtered = emails;

    if (searchTerm) {
      filtered = filtered.filter(email =>
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(email => email.type === typeFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(email => email.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(email => email.priority === priorityFilter);
    }

    setFilteredEmails(filtered);
  }, [emails, searchTerm, typeFilter, statusFilter, priorityFilter]);

  const handleAddEmail = (newEmail: Omit<Email, 'id'>) => {
    const email: Email = {
      ...newEmail,
      id: Date.now().toString(),
      sentAt: new Date().toISOString(),
      isStarred: false,
      isImportant: false
    };
    setEmails([...emails, email]);
  };

  const handleUpdateEmail = (updatedEmail: Email) => {
    setEmails(emails.map(email => email.id === updatedEmail.id ? updatedEmail : email));
  };

  const handleViewEmail = (email: Email) => {
    setSelectedEmail(email);
    setIsDetailsOpen(true);
    // Mark as read if unread
    if (email.status === 'unread') {
      handleUpdateEmail({ ...email, status: 'read' });
    }
  };

  const handleStarEmail = (email: Email) => {
    handleUpdateEmail({ ...email, isStarred: !email.isStarred });
  };

  const handleArchiveEmail = (email: Email) => {
    handleUpdateEmail({ ...email, status: 'archived' });
  };

  const getStatusCount = (status: string) => {
    return emails.filter(email => email.status === status).length;
  };

  const totalEmails = emails.length;
  const unreadEmails = emails.filter(email => email.status === 'unread').length;
  const sentEmails = emails.filter(email => email.type === 'sent').length;
  const receivedEmails = emails.filter(email => email.type === 'received').length;
  const starredEmails = emails.filter(email => email.isStarred).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Management</h1>
          <p className="text-muted-foreground">
            Manage your email communications and campaigns
          </p>
        </div>
        <Button onClick={() => setIsEmailFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Compose Email
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmails}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <MailOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadEmails}</div>
            <p className="text-xs text-muted-foreground">
              -8% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sentEmails}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Received</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{receivedEmails}</div>
            <p className="text-xs text-muted-foreground">
              +18% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Starred</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{starredEmails}</div>
            <p className="text-xs text-muted-foreground">
              +5% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="inbox" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                    <SelectItem value="forwarded">Forwarded</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Emails List */}
          <Card>
            <CardHeader>
              <CardTitle>Inbox ({filteredEmails.filter(e => e.type === 'received').length})</CardTitle>
              <CardDescription>
                Manage your incoming emails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredEmails
                  .filter(email => email.type === 'received')
                  .map((email) => (
                  <div
                    key={email.id}
                    className={`flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer ${
                      email.status === 'unread' ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => handleViewEmail(email)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStarEmail(email);
                          }}
                        >
                          <Star className={`h-4 w-4 ${email.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </Button>
                        {email.status === 'unread' && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="font-medium">{email.from}</div>
                        <div className="text-sm text-muted-foreground">{email.subject}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-md">
                          {email.body.substring(0, 100)}...
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={statusColors[email.status]}>
                          {email.status}
                        </Badge>
                        <Badge className={priorityColors[email.priority]}>
                          {email.priority}
                        </Badge>
                        {email.attachments.length > 0 && (
                          <Badge variant="outline">📎 {email.attachments.length}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {new Date(email.sentAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(email.sentAt).toLocaleTimeString()}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewEmail(email)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Reply className="h-4 w-4 mr-2" />
                            Reply
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Forward className="h-4 w-4 mr-2" />
                            Forward
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleArchiveEmail(email)}>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sent Emails ({filteredEmails.filter(e => e.type === 'sent').length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredEmails
                  .filter(email => email.type === 'sent')
                  .map((email) => (
                  <div
                    key={email.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleViewEmail(email)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <div className="font-medium">To: {email.to.join(', ')}</div>
                        <div className="text-sm text-muted-foreground">{email.subject}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-md">
                          {email.body.substring(0, 100)}...
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={statusColors[email.status]}>
                          {email.status}
                        </Badge>
                        <Badge className={priorityColors[email.priority]}>
                          {email.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {new Date(email.sentAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(email.sentAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Draft Emails ({filteredEmails.filter(e => e.type === 'draft').length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                No draft emails found
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <EmailTemplates />
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <EmailCampaigns />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <EmailAnalytics emails={emails} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <EmailFormModal
        isOpen={isEmailFormOpen}
        onClose={() => setIsEmailFormOpen(false)}
        onSave={handleAddEmail}
      />

      <EmailDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        email={selectedEmail}
        onUpdate={handleUpdateEmail}
      />
    </div>
  );
}
