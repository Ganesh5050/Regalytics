import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  TrendingUp,
  User,
  Building
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  source: string;
  value: number;
  score: number;
  lastContact: string;
  nextFollowUp: string;
  location: string;
}

interface MobileLeadsProps {
  className?: string;
}

export function MobileLeads({ className }: MobileLeadsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  // Mock data
  const leads: Lead[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      company: "TechCorp Solutions",
      email: "sarah@techcorp.com",
      phone: "+1 (555) 123-4567",
      status: "qualified",
      source: "Website",
      value: 45000,
      score: 85,
      lastContact: "2024-01-20",
      nextFollowUp: "2024-01-25",
      location: "San Francisco, CA"
    },
    {
      id: "2",
      name: "Mike Chen",
      company: "FinanceFirst",
      email: "mike@financefirst.com",
      phone: "+1 (555) 234-5678",
      status: "proposal",
      source: "Referral",
      value: 32000,
      score: 92,
      lastContact: "2024-01-22",
      nextFollowUp: "2024-01-26",
      location: "New York, NY"
    },
    {
      id: "3",
      name: "Emily Davis",
      company: "MedTech Innovations",
      email: "emily@medtech.com",
      phone: "+1 (555) 345-6789",
      status: "contacted",
      source: "Social Media",
      value: 28000,
      score: 78,
      lastContact: "2024-01-21",
      nextFollowUp: "2024-01-24",
      location: "Boston, MA"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'closed-won': return 'bg-green-100 text-green-800';
      case 'closed-lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className={`space-y-4 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Leads</h1>
          <p className="text-sm text-gray-500">{filteredLeads.length} leads found</p>
        </div>
        <Button size="sm" className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Lead</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="proposal">Proposal</SelectItem>
              <SelectItem value="negotiation">Negotiation</SelectItem>
              <SelectItem value="closed-won">Closed Won</SelectItem>
              <SelectItem value="closed-lost">Closed Lost</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="Website">Website</SelectItem>
              <SelectItem value="Referral">Referral</SelectItem>
              <SelectItem value="Social Media">Social Media</SelectItem>
              <SelectItem value="Email">Email</SelectItem>
              <SelectItem value="Cold Call">Cold Call</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-3">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="p-4">
            <CardContent className="p-0">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center space-x-1">
                      <Building className="h-3 w-3" />
                      <span>{lead.company}</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status.replace('-', ' ')}
                    </Badge>
                    <div className={`text-sm font-medium ${getScoreColor(lead.score)}`}>
                      {lead.score}
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    <span>{lead.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>{lead.location}</span>
                  </div>
                </div>

                {/* Value and Source */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(lead.value)}
                    </p>
                    <p className="text-xs text-gray-500">Potential value</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{lead.source}</p>
                    <p className="text-xs text-gray-500">Source</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">24</p>
              <p className="text-xs text-gray-500">Qualified Leads</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">$1.2M</p>
              <p className="text-xs text-gray-500">Pipeline Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">18%</p>
              <p className="text-xs text-gray-500">Conversion Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">5</p>
              <p className="text-xs text-gray-500">Hot Leads</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
