import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DealFormData {
  name: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  source: string;
  notes: string;
  tags: string[];
  products: string[];
}

interface DealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deal: Omit<DealFormData, 'id'>) => void;
  deal?: DealFormData;
}

export function DealFormModal({ isOpen, onClose, onSave, deal }: DealFormModalProps) {
  const [formData, setFormData] = useState<DealFormData>({
    name: deal?.name || "",
    company: deal?.company || "",
    contact: deal?.contact || "",
    email: deal?.email || "",
    phone: deal?.phone || "",
    value: deal?.value || 0,
    stage: deal?.stage || "prospecting",
    probability: deal?.probability || 0,
    expectedCloseDate: deal?.expectedCloseDate || "",
    assignedTo: deal?.assignedTo || "",
    source: deal?.source || "Website",
    notes: deal?.notes || "",
    tags: deal?.tags || [],
    products: deal?.products || []
  });

  const [newTag, setNewTag] = useState("");
  const [newProduct, setNewProduct] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleAddProduct = () => {
    if (newProduct.trim() && !formData.products.includes(newProduct.trim())) {
      setFormData({
        ...formData,
        products: [...formData.products, newProduct.trim()]
      });
      setNewProduct("");
    }
  };

  const handleRemoveProduct = (productToRemove: string) => {
    setFormData({
      ...formData,
      products: formData.products.filter(product => product !== productToRemove)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.currentTarget.id === 'newTag') {
        handleAddTag();
      } else if (e.currentTarget.id === 'newProduct') {
        handleAddProduct();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{deal ? 'Edit Deal' : 'Add New Deal'}</DialogTitle>
          <DialogDescription>
            {deal ? 'Update deal information' : 'Create a new sales opportunity'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Deal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Deal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Deal Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Deal Value ($) *</Label>
                <Input
                  id="value"
                  type="number"
                  min="0"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="probability">Probability (%)</Label>
                <Input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Name *</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input
                  id="assignedTo"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Deal Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Deal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select value={formData.stage} onValueChange={(value: any) => setFormData({ ...formData, stage: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prospecting">Prospecting</SelectItem>
                    <SelectItem value="qualification">Qualification</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="closed-won">Closed Won</SelectItem>
                    <SelectItem value="closed-lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Lead Source</Label>
                <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                    <SelectItem value="Trade Show">Trade Show</SelectItem>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                <Input
                  id="expectedCloseDate"
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Products/Services</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  id="newProduct"
                  placeholder="Add a product/service..."
                  value={newProduct}
                  onChange={(e) => setNewProduct(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button type="button" onClick={handleAddProduct} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.products.map((product) => (
                  <Badge key={product} variant="secondary" className="flex items-center gap-1">
                    {product}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveProduct(product)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Tags</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  id="newTag"
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button type="button" onClick={handleAddTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notes</h3>
            <Textarea
              placeholder="Add notes about this deal..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {deal ? 'Update Deal' : 'Create Deal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
