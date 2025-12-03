import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Edit, 
  Copy, 
  Trash2, 
  Send,
  Mail,
  FileText,
  Calendar,
  User,
  MoreHorizontal
} from "lucide-react";
import { TemplateFormModal } from "@/components/email/TemplateFormModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'welcome' | 'follow-up' | 'proposal' | 'meeting' | 'contract' | 'other';
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  usageCount: number;
  lastUsed?: string;
}

const mockTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Welcome Email - New Client",
    subject: "Welcome to Regalytics - Your Compliance Journey Starts Here",
    body: "Dear {{client_name}},\n\nWelcome to Regalytics! We're excited to partner with you on your compliance journey.\n\nOur team is committed to providing you with the best compliance solutions and support.\n\nBest regards,\n{{sender_name}}",
    category: "welcome",
    tags: ["welcome", "onboarding", "client"],
    isActive: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    createdBy: "Sarah Johnson",
    usageCount: 15,
    lastUsed: "2024-01-22"
  },
  {
    id: "2",
    name: "Follow-up - Proposal Sent",
    subject: "Follow-up on Your Compliance Proposal",
    body: "Hi {{contact_name}},\n\nI hope you had a chance to review the compliance proposal I sent earlier.\n\nI'd love to schedule a call to discuss any questions you might have.\n\nWhen would be a good time for you?\n\nBest regards,\n{{sender_name}}",
    category: "follow-up",
    tags: ["follow-up", "proposal", "meeting"],
    isActive: true,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    createdBy: "Mike Chen",
    usageCount: 8,
    lastUsed: "2024-01-21"
  },
  {
    id: "3",
    name: "Meeting Invitation - Demo",
    subject: "Demo Invitation - {{product_name}} Compliance Suite",
    body: "Hi {{contact_name}},\n\nI'd like to invite you to a personalized demo of our {{product_name}} compliance suite.\n\nBased on our previous conversation, I believe this will address your specific needs.\n\nPlease let me know your availability.\n\nBest regards,\n{{sender_name}}",
    category: "meeting",
    tags: ["demo", "invitation", "meeting"],
    isActive: true,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-19",
    createdBy: "Sarah Johnson",
    usageCount: 12,
    lastUsed: "2024-01-20"
  }
];

const categoryColors = {
  'welcome': 'bg-green-100 text-green-800',
  'follow-up': 'bg-blue-100 text-blue-800',
  'proposal': 'bg-purple-100 text-purple-800',
  'meeting': 'bg-orange-100 text-orange-800',
  'contract': 'bg-red-100 text-red-800',
  'other': 'bg-gray-100 text-gray-800'
};

export function EmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);
  const [filteredTemplates, setFilteredTemplates] = useState<EmailTemplate[]>(mockTemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isTemplateFormOpen, setIsTemplateFormOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  // Filter templates
  const filterTemplates = () => {
    let filtered = templates;

    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(template => template.category === categoryFilter);
    }

    setFilteredTemplates(filtered);
  };

  // Apply filters when dependencies change
  React.useEffect(() => {
    filterTemplates();
  }, [searchTerm, categoryFilter, templates]);

  const handleAddTemplate = (newTemplate: Omit<EmailTemplate, 'id'>) => {
    const template: EmailTemplate = {
      ...newTemplate,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      usageCount: 0
    };
    setTemplates([...templates, template]);
  };

  const handleUpdateTemplate = (updatedTemplate: EmailTemplate) => {
    setTemplates(templates.map(template => 
      template.id === updatedTemplate.id 
        ? { ...updatedTemplate, updatedAt: new Date().toISOString().split('T')[0] }
        : template
    ));
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsTemplateFormOpen(true);
  };

  const handleDuplicateTemplate = (template: EmailTemplate) => {
    const duplicatedTemplate: EmailTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      usageCount: 0
    };
    setTemplates([...templates, duplicatedTemplate]);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(template => template.id !== templateId));
  };

  const getCategoryCount = (category: string) => {
    return templates.filter(template => template.category === category).length;
  };

  const totalTemplates = templates.length;
  const activeTemplates = templates.filter(template => template.isActive).length;
  const totalUsage = templates.reduce((sum, template) => sum + template.usageCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Email Templates</h2>
          <p className="text-muted-foreground">
            Create and manage email templates for your communications
          </p>
        </div>
        <Button onClick={() => setIsTemplateFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTemplates}</div>
            <p className="text-xs text-muted-foreground">
              +3 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTemplates}</div>
            <p className="text-xs text-muted-foreground">
              {((activeTemplates / totalTemplates) * 100).toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage}</div>
            <p className="text-xs text-muted-foreground">
              +25% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="welcome">Welcome</TabsTrigger>
          <TabsTrigger value="follow-up">Follow-up</TabsTrigger>
          <TabsTrigger value="proposal">Proposal</TabsTrigger>
          <TabsTrigger value="meeting">Meeting</TabsTrigger>
          <TabsTrigger value="contract">Contract</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="welcome">Welcome</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Templates List */}
          <Card>
            <CardHeader>
              <CardTitle>Templates ({filteredTemplates.length})</CardTitle>
              <CardDescription>
                Manage your email templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{template.name}</h4>
                          <Badge className={categoryColors[template.category]}>
                            {template.category}
                          </Badge>
                          {template.isActive ? (
                            <Badge variant="outline" className="text-green-600">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-600">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{template.subject}</p>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {template.body.substring(0, 150)}...
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {template.createdBy}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {template.updatedAt}
                          </div>
                          <div className="flex items-center">
                            <Send className="h-3 w-3 mr-1" />
                            {template.usageCount} uses
                          </div>
                          {template.lastUsed && (
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Last used: {template.lastUsed}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />
                              Use Template
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteTemplate(template.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
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

        {/* Category-specific tabs */}
        {['welcome', 'follow-up', 'proposal', 'meeting', 'contract'].map((category) => (
          <TabsContent key={category} value={category} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {category.charAt(0).toUpperCase() + category.slice(1)} Templates 
                  ({getCategoryCount(category)})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTemplates
                    .filter(template => template.category === category)
                    .map((template) => (
                    <div
                      key={template.id}
                      className="p-4 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{template.name}</h4>
                            <Badge className={categoryColors[template.category]}>
                              {template.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{template.subject}</p>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {template.body.substring(0, 150)}...
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {template.createdBy}
                            </div>
                            <div className="flex items-center">
                              <Send className="h-3 w-3 mr-1" />
                              {template.usageCount} uses
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditTemplate(template)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDuplicateTemplate(template)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Template Form Modal */}
      <TemplateFormModal
        isOpen={isTemplateFormOpen}
        onClose={() => {
          setIsTemplateFormOpen(false);
          setSelectedTemplate(null);
        }}
        onSave={selectedTemplate ? handleUpdateTemplate : handleAddTemplate}
        template={selectedTemplate}
      />
    </div>
  );
}
