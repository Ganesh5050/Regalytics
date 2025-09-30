import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { User, Building, Phone, Mail, CreditCard, FileText, Shield } from 'lucide-react';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  pan: string;
  aadhaar: string;
  address: string;
  riskLevel: string;
  kycStatus: string;
  notes: string;
}

export function ClientFormModal({ isOpen, onClose }: ClientFormModalProps) {
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    pan: '',
    aadhaar: '',
    address: '',
    riskLevel: 'medium',
    kycStatus: 'pending',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call the real backend API
      const response = await fetch('http://localhost:3001/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          pan: formData.pan,
          aadhaar: formData.aadhaar,
          address: formData.address,
          riskLevel: formData.riskLevel,
          kycStatus: formData.kycStatus,
          notes: formData.notes
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      addNotification({
        type: 'success',
        title: 'Client Added Successfully',
        message: `Client ${formData.name} has been registered with ID: ${result.id || 'N/A'}`
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        pan: '',
        aadhaar: '',
        address: '',
        riskLevel: 'medium',
        kycStatus: 'pending',
        notes: ''
      });

      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addNotification({
        type: 'error',
        title: 'Registration Failed',
        message: `Failed to register client: ${errorMessage}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getKycBadgeColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'incomplete': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Add New Client
          </DialogTitle>
          <DialogDescription>
            Register a new client for compliance monitoring and risk assessment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Basic Information
              </CardTitle>
              <CardDescription>Personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KYC Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-4 w-4" />
                KYC Information
              </CardTitle>
              <CardDescription>Know Your Customer documentation details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN Number</Label>
                  <Input
                    id="pan"
                    value={formData.pan}
                    onChange={(e) => handleInputChange('pan', e.target.value)}
                    placeholder="Enter PAN number"
                    maxLength={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Number</Label>
                  <Input
                    id="aadhaar"
                    value={formData.aadhaar}
                    onChange={(e) => handleInputChange('aadhaar', e.target.value)}
                    placeholder="Enter Aadhaar number"
                    maxLength={12}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter complete address"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Risk Assessment
              </CardTitle>
              <CardDescription>Initial risk classification and KYC status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="riskLevel">Risk Level</Label>
                  <Select value={formData.riskLevel} onValueChange={(value) => handleInputChange('riskLevel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kycStatus">KYC Status</Label>
                  <Select value={formData.kycStatus} onValueChange={(value) => handleInputChange('kycStatus', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select KYC status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="incomplete">Incomplete</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional notes or comments"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
              <CardDescription>Review the client information before submission</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{formData.name || 'Client Name'}</span>
                  <div className="flex gap-2">
                    <Badge className={getRiskBadgeColor(formData.riskLevel)}>
                      {formData.riskLevel.toUpperCase()} RISK
                    </Badge>
                    <Badge className={getKycBadgeColor(formData.kycStatus)}>
                      {formData.kycStatus.toUpperCase()} KYC
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{formData.email || 'Email not provided'}</p>
                  <p>{formData.company || 'Company not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register Client'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
