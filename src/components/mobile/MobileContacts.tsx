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
  User,
  Building,
  Star,
  MessageSquare
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Contact {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'prospect' | 'customer' | 'partner';
  source: string;
  lastContact: string;
  nextFollowUp: string;
  location: string;
  isStarred: boolean;
  notes: string;
}

interface MobileContactsProps {
  className?: string;
}

export function MobileContacts({ className }: MobileContactsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  // Mock data
  const contacts: Contact[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      company: "TechCorp Solutions",
      title: "CTO",
      email: "sarah@techcorp.com",
      phone: "+1 (555) 123-4567",
      status: "customer",
      source: "Website",
      lastContact: "2024-01-20",
      nextFollowUp: "2024-01-25",
      location: "San Francisco, CA",
      isStarred: true,
      notes: "Key decision maker for enterprise solutions"
    },
    {
      id: "2",
      name: "Mike Chen",
      company: "FinanceFirst",
      title: "VP of Operations",
      email: "mike@financefirst.com",
      phone: "+1 (555) 234-5678",
      status: "prospect",
      source: "Referral",
      lastContact: "2024-01-22",
      nextFollowUp: "2024-01-26",
      location: "New York, NY",
      isStarred: false,
      notes: "Interested in compliance automation"
    },
    {
      id: "3",
      name: "Emily Davis",
      company: "MedTech Innovations",
      title: "Head of IT",
      email: "emily@medtech.com",
      phone: "+1 (555) 345-6789",
      status: "active",
      source: "Social Media",
      lastContact: "2024-01-21",
      nextFollowUp: "2024-01-24",
      location: "Boston, MA",
      isStarred: true,
      notes: "Looking for scalable solutions"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-purple-100 text-purple-800';
      case 'partner': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
    const matchesSource = sourceFilter === "all" || contact.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className={`space-y-4 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Contacts</h1>
          <p className="text-sm text-gray-500">{filteredContacts.length} contacts found</p>
        </div>
        <Button size="sm" className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Contact</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search contacts..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="partner">Partner</SelectItem>
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

      {/* Contacts List */}
      <div className="space-y-3">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="p-4">
            <CardContent className="p-0">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                      {contact.isStarred && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 flex items-center space-x-1">
                      <Building className="h-3 w-3" />
                      <span>{contact.company}</span>
                    </p>
                    <p className="text-xs text-gray-500">{contact.title}</p>
                  </div>
                  <Badge className={getStatusColor(contact.status)}>
                    {contact.status}
                  </Badge>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    <span>{contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>{contact.location}</span>
                  </div>
                </div>

                {/* Notes */}
                {contact.notes && (
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">{contact.notes}</p>
                  </div>
                )}

                {/* Last Contact */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Last contact: {contact.lastContact}</span>
                  <span>Next follow-up: {contact.nextFollowUp}</span>
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
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Note
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
              <p className="text-2xl font-bold text-green-600">156</p>
              <p className="text-xs text-gray-500">Active Contacts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">89</p>
              <p className="text-xs text-gray-500">Customers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">45</p>
              <p className="text-xs text-gray-500">Prospects</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">12</p>
              <p className="text-xs text-gray-500">Partners</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
