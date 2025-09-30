import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNotifications } from '@/hooks/useNotifications';
import { Shield, AlertTriangle, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';

interface RiskAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RiskAssessmentData {
  clientId: string;
  assessmentType: string;
  riskFactors: string[];
  transactionPattern: string;
  geographicRisk: string;
  businessRisk: string;
  notes: string;
}

export function RiskAssessmentModal({ isOpen, onClose }: RiskAssessmentModalProps) {
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState<RiskAssessmentData>({
    clientId: '',
    assessmentType: 'comprehensive',
    riskFactors: [],
    transactionPattern: 'normal',
    geographicRisk: 'low',
    businessRisk: 'medium',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [riskScore, setRiskScore] = useState(0);

  const handleInputChange = (field: keyof RiskAssessmentData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRiskFactorToggle = (factor: string) => {
    const updatedFactors = formData.riskFactors.includes(factor)
      ? formData.riskFactors.filter(f => f !== factor)
      : [...formData.riskFactors, factor];
    handleInputChange('riskFactors', updatedFactors);
  };

  const calculateRiskScore = () => {
    let score = 0;
    
    // Base score from assessment type
    switch (formData.assessmentType) {
      case 'basic': score += 20; break;
      case 'standard': score += 40; break;
      case 'comprehensive': score += 60; break;
    }
    
    // Risk factors
    score += formData.riskFactors.length * 10;
    
    // Transaction pattern
    switch (formData.transactionPattern) {
      case 'normal': score += 10; break;
      case 'unusual': score += 30; break;
      case 'suspicious': score += 50; break;
    }
    
    // Geographic risk
    switch (formData.geographicRisk) {
      case 'low': score += 5; break;
      case 'medium': score += 20; break;
      case 'high': score += 40; break;
    }
    
    // Business risk
    switch (formData.businessRisk) {
      case 'low': score += 5; break;
      case 'medium': score += 20; break;
      case 'high': score += 40; break;
    }
    
    return Math.min(score, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate risk assessment calculation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const calculatedScore = calculateRiskScore();
      setRiskScore(calculatedScore);
      setShowResults(true);
      
      addNotification({
        type: 'success',
        title: 'Risk Assessment Complete',
        message: `Risk assessment completed with score: ${calculatedScore}/100`
      });

    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Assessment Failed',
        message: 'Failed to complete risk assessment. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: 'Low', color: 'bg-green-100 text-green-800' };
    if (score < 60) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    if (score < 80) return { level: 'High', color: 'bg-orange-100 text-orange-800' };
    return { level: 'Critical', color: 'bg-red-100 text-red-800' };
  };

  const riskFactors = [
    'High transaction volume',
    'International transfers',
    'Cash transactions',
    'PEP (Politically Exposed Person)',
    'Sanctioned country',
    'Unusual business activity',
    'Document discrepancies',
    'Previous compliance issues'
  ];

  const riskLevel = getRiskLevel(riskScore);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Risk Assessment
          </DialogTitle>
          <DialogDescription>
            Conduct a comprehensive risk assessment for compliance monitoring.
          </DialogDescription>
        </DialogHeader>

        {!showResults ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Client Information
                </CardTitle>
                <CardDescription>Basic client details for risk assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client ID *</Label>
                  <Input
                    id="clientId"
                    value={formData.clientId}
                    onChange={(e) => handleInputChange('clientId', e.target.value)}
                    placeholder="Enter client ID"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessmentType">Assessment Type</Label>
                  <Select value={formData.assessmentType} onValueChange={(value) => handleInputChange('assessmentType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assessment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Assessment</SelectItem>
                      <SelectItem value="standard">Standard Assessment</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive Assessment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Risk Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Factors
                </CardTitle>
                <CardDescription>Select applicable risk factors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {riskFactors.map((factor) => (
                    <div key={factor} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={factor}
                        checked={formData.riskFactors.includes(factor)}
                        onChange={() => handleRiskFactorToggle(factor)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={factor} className="text-sm">
                        {factor}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Risk Categories
                </CardTitle>
                <CardDescription>Assess different risk dimensions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transactionPattern">Transaction Pattern</Label>
                    <Select value={formData.transactionPattern} onValueChange={(value) => handleInputChange('transactionPattern', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="unusual">Unusual</SelectItem>
                        <SelectItem value="suspicious">Suspicious</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="geographicRisk">Geographic Risk</Label>
                    <Select value={formData.geographicRisk} onValueChange={(value) => handleInputChange('geographicRisk', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessRisk">Business Risk</Label>
                    <Select value={formData.businessRisk} onValueChange={(value) => handleInputChange('businessRisk', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Additional Information
                </CardTitle>
                <CardDescription>Additional notes and observations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="notes">Assessment Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Additional observations or notes"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Assessing...' : 'Run Assessment'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Risk Assessment Results
                </CardTitle>
                <CardDescription>Assessment completed successfully</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold">{riskScore}/100</div>
                  <Badge className={`text-lg px-4 py-2 ${riskLevel.color}`}>
                    {riskLevel.level} RISK
                  </Badge>
                  <Progress value={riskScore} className="w-full" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Selected Risk Factors:</h4>
                    <div className="space-y-1">
                      {formData.riskFactors.length > 0 ? (
                        formData.riskFactors.map((factor) => (
                          <div key={factor} className="text-sm text-muted-foreground">
                            • {factor}
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">No risk factors selected</div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Assessment Details:</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Type: {formData.assessmentType}</div>
                      <div>Transaction Pattern: {formData.transactionPattern}</div>
                      <div>Geographic Risk: {formData.geographicRisk}</div>
                      <div>Business Risk: {formData.businessRisk}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowResults(false)}>
                Reassess
              </Button>
              <Button onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
