import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface PCCFormData {
  // Sender Information
  dealerCode: string;
  dealerName: string;
  dealerLocation: string;
  senderName: string;
  senderEmail: string;
  assignment: string;
  teamAgent: string;
  
  // Vehicle Details
  brand: string;
  topic: string;
  subtopic: string;
  justifiedTicket: string;
  vin: string;
  modelCode: string;
  dateOfProduction: string;
  engineCode: string;
  gearboxCode: string;
  kilometer: string;
  repairDate: string;
  breakdown: string;
  repeatedRepair: string;
  dissTicketNo: string;
  warrantyClaimNo: string;
  
  // Complaint & Initial Assessment
  damagePartsNumber: string;
  damagePartAvailable: string;
  customerExpectation: string;
  
  // VOC & Findings
  voc: string;
  dealerObservations: string;
  actionTaken: string;
  expectations: string;
  tffRemarks: string;
  
  // TSC Information
  responsibleName: string;
  responsibleEmail: string;
  responseDate: string;
  analysisCompleted: string;
  solutionAvailable: string;
  
  // Workshop Information
  repairMeasures: string;
  problemSolved: string;
  workshopComment: string;
  
  // Escalation
  escalatedToBrand: string;
  escalationDescription: string;
}

export default function DealerPCCPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isDealer = user?.dealerCode;
  const isAdmin = user?.role === 'super_admin' || user?.role === 'manufacturer_admin';
  
  const [showForm, setShowForm] = useState(false);
  const [showEscalationDialog, setShowEscalationDialog] = useState(false);
  const [formData, setFormData] = useState<PCCFormData>({
    dealerCode: user?.dealerCode || '',
    dealerName: user?.dealerName || '',
    dealerLocation: '',
    senderName: user?.name || '',
    senderEmail: user?.email || '',
    assignment: 'Service Team - IND-Warranty Team',
    teamAgent: 'Amit (IND) Shrivastava',
    brand: '',
    topic: 'Dealer PCC',
    subtopic: '',
    justifiedTicket: '',
    vin: '',
    modelCode: '',
    dateOfProduction: '',
    engineCode: '',
    gearboxCode: '',
    kilometer: '',
    repairDate: '',
    breakdown: '',
    repeatedRepair: '',
    dissTicketNo: '',
    warrantyClaimNo: '',
    damagePartsNumber: '',
    damagePartAvailable: '',
    customerExpectation: '',
    voc: '',
    dealerObservations: '',
    actionTaken: '',
    expectations: '',
    tffRemarks: '',
    responsibleName: '',
    responsibleEmail: '',
    responseDate: '',
    analysisCompleted: '',
    solutionAvailable: '',
    repairMeasures: '',
    problemSolved: '',
    workshopComment: '',
    escalatedToBrand: 'No',
    escalationDescription: '',
  });

  const handleInputChange = (field: keyof PCCFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Open escalation dialog if "Escalated to Brand" is set to "Yes"
    if (field === 'escalatedToBrand' && value === 'Yes') {
      setShowEscalationDialog(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.tffRemarks.trim()) {
      alert('TFF Remarks is required');
      return;
    }
    console.log('Form submitted:', formData);
    alert('PCC form submitted successfully!');
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">📋 Dealer PCC Management</h1>
              <p className="text-sm opacity-90">
                Problem Case Conference - Technical Support
              </p>
            </div>
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Escalation Dialog */}
      <Dialog open={showEscalationDialog} onOpenChange={setShowEscalationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Brand Escalation Details</DialogTitle>
            <DialogDescription>
              Please provide details about the brand escalation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Escalation Description *</Label>
              <Textarea
                value={formData.escalationDescription}
                onChange={(e) => handleInputChange('escalationDescription', e.target.value)}
                placeholder="Describe the escalation details..."
                rows={6}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowEscalationDialog(false);
                setFormData(prev => ({ ...prev, escalatedToBrand: 'No', escalationDescription: '' }));
              }}>
                Cancel
              </Button>
              <Button onClick={() => setShowEscalationDialog(false)}>
                Save Escalation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 py-6">
        {showForm ? (
          // PCC Form
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>New Dealer PCC Submission</CardTitle>
                <CardDescription>Complete all sections of the Problem Case Conference form</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                
                {/* Sender Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Sender Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Dealer Code *</Label>
                      <Input value={formData.dealerCode} onChange={(e) => handleInputChange('dealerCode', e.target.value)} placeholder="Enter dealership code" required />
                    </div>
                    <div>
                      <Label>Dealer Name *</Label>
                      <Input value={formData.dealerName} onChange={(e) => handleInputChange('dealerName', e.target.value)} placeholder="Enter dealership name" required />
                    </div>
                    <div>
                      <Label>Dealer Location *</Label>
                      <Input value={formData.dealerLocation} onChange={(e) => handleInputChange('dealerLocation', e.target.value)} placeholder="City & State" required />
                    </div>
                    <div>
                      <Label>Sender Name *</Label>
                      <Input value={formData.senderName} onChange={(e) => handleInputChange('senderName', e.target.value)} placeholder="Enter sender's name" required />
                    </div>
                    <div>
                      <Label>Sender Email *</Label>
                      <Input type="email" value={formData.senderEmail} onChange={(e) => handleInputChange('senderEmail', e.target.value)} placeholder="Enter sender's email" required />
                    </div>
                    <div>
                      <Label>Assignment</Label>
                      <Input value={formData.assignment} readOnly className="bg-muted" />
                    </div>
                    <div>
                      <Label>Team Agent</Label>
                      <Select value={formData.teamAgent} onChange={(e) => handleInputChange('teamAgent', e.target.value)}>
                        <option value="Amit (IND) Shrivastava">Amit (IND) Shrivastava</option>
                        <option value="Dedicated Team Agent - Dealer PCC">Dedicated Team Agent - Dealer PCC</option>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Vehicle Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Brand *</Label>
                      <Select value={formData.brand} onChange={(e) => handleInputChange('brand', e.target.value)} required>
                        <option value="">Select Brand</option>
                        <option value="Skoda">Škoda</option>
                        <option value="Volkswagen">Volkswagen</option>
                      </Select>
                    </div>
                    <div>
                      <Label>Topic *</Label>
                      <Select value={formData.topic} onChange={(e) => handleInputChange('topic', e.target.value)} required>
                        <option value="Dealer PCC">Dealer PCC</option>
                        <option value="Long Term PCC">Long Term PCC</option>
                      </Select>
                    </div>
                    <div>
                      <Label>Subtopic</Label>
                      <Input value={formData.subtopic} onChange={(e) => handleInputChange('subtopic', e.target.value)} placeholder="Enter subtopic" />
                    </div>
                    <div>
                      <Label>Justified Ticket *</Label>
                      <Select value={formData.justifiedTicket} onChange={(e) => handleInputChange('justifiedTicket', e.target.value)} required>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </Select>
                    </div>
                    <div>
                      <Label>VIN *</Label>
                      <Input value={formData.vin} onChange={(e) => handleInputChange('vin', e.target.value)} placeholder="Vehicle chassis number" required />
                    </div>
                    <div>
                      <Label>Model Code *</Label>
                      <Input value={formData.modelCode} onChange={(e) => handleInputChange('modelCode', e.target.value)} placeholder="Enter model code" required />
                    </div>
                    <div>
                      <Label>Date of Production *</Label>
                      <Input type="date" value={formData.dateOfProduction} onChange={(e) => handleInputChange('dateOfProduction', e.target.value)} required />
                    </div>
                    <div>
                      <Label>Engine Code</Label>
                      <Input value={formData.engineCode} onChange={(e) => handleInputChange('engineCode', e.target.value)} placeholder="Enter engine code" />
                    </div>
                    <div>
                      <Label>Gearbox Code</Label>
                      <Input value={formData.gearboxCode} onChange={(e) => handleInputChange('gearboxCode', e.target.value)} placeholder="Enter gearbox code" />
                    </div>
                    <div>
                      <Label>Kilometer *</Label>
                      <Input type="number" value={formData.kilometer} onChange={(e) => handleInputChange('kilometer', e.target.value)} placeholder="Vehicle kilometers" required />
                    </div>
                    <div>
                      <Label>Repair Date *</Label>
                      <Input type="date" value={formData.repairDate} onChange={(e) => handleInputChange('repairDate', e.target.value)} required />
                    </div>
                    <div>
                      <Label>Breakdown *</Label>
                      <Select value={formData.breakdown} onChange={(e) => handleInputChange('breakdown', e.target.value)} required>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </Select>
                    </div>
                    <div>
                      <Label>Repeated Repair *</Label>
                      <Select value={formData.repeatedRepair} onChange={(e) => handleInputChange('repeatedRepair', e.target.value)} required>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </Select>
                    </div>
                    <div>
                      <Label>DISS Ticket No.</Label>
                      <Input value={formData.dissTicketNo} onChange={(e) => handleInputChange('dissTicketNo', e.target.value)} placeholder="Enter DISS ticket number" />
                    </div>
                    <div>
                      <Label>Warranty Claim No.</Label>
                      <Input value={formData.warrantyClaimNo} onChange={(e) => handleInputChange('warrantyClaimNo', e.target.value)} placeholder="Enter warranty claim number" />
                    </div>
                  </div>
                </div>

                {/* Complaint & Initial Assessment */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Complaint & Initial Assessment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Damage Parts Number</Label>
                      <Input value={formData.damagePartsNumber} onChange={(e) => handleInputChange('damagePartsNumber', e.target.value)} placeholder="Enter damaged parts list" />
                    </div>
                    <div>
                      <Label>Damage Part Available?</Label>
                      <Select value={formData.damagePartAvailable} onChange={(e) => handleInputChange('damagePartAvailable', e.target.value)}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Customer Expectation</Label>
                    <Textarea value={formData.customerExpectation} onChange={(e) => handleInputChange('customerExpectation', e.target.value)} placeholder="Describe customer's expectation" rows={3} />
                  </div>
                </div>

                {/* VOC & Findings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">VOC & Dealer Findings</h3>
                  <div>
                    <Label>VOC (Voice of Customer)</Label>
                    <Textarea value={formData.voc} onChange={(e) => handleInputChange('voc', e.target.value)} placeholder="Enter customer's voice/feedback" rows={3} />
                  </div>
                  <div>
                    <Label>Dealer Observations & Findings</Label>
                    <Textarea value={formData.dealerObservations} onChange={(e) => handleInputChange('dealerObservations', e.target.value)} placeholder="Enter dealer's observations" rows={3} />
                  </div>
                  <div>
                    <Label>Action Taken</Label>
                    <Textarea value={formData.actionTaken} onChange={(e) => handleInputChange('actionTaken', e.target.value)} placeholder="Describe actions taken by dealer" rows={3} />
                  </div>
                  <div>
                    <Label>Expectations</Label>
                    <Textarea value={formData.expectations} onChange={(e) => handleInputChange('expectations', e.target.value)} placeholder="Enter dealer's expectations" rows={3} />
                  </div>
                  <div>
                    <Label>TFF Remarks *</Label>
                    <Textarea value={formData.tffRemarks} onChange={(e) => handleInputChange('tffRemarks', e.target.value)} placeholder="Technical Field Force remarks (Required)" rows={3} required />
                  </div>
                </div>

                {/* TSC Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">TSC (Technical Support Center) Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Responsible Name</Label>
                      <Input value={formData.responsibleName} onChange={(e) => handleInputChange('responsibleName', e.target.value)} placeholder="Team agent name" />
                    </div>
                    <div>
                      <Label>Responsible Email</Label>
                      <Input type="email" value={formData.responsibleEmail} onChange={(e) => handleInputChange('responsibleEmail', e.target.value)} placeholder="Team agent email" />
                    </div>
                    <div>
                      <Label>Response Date</Label>
                      <Input type="date" value={formData.responseDate} onChange={(e) => handleInputChange('responseDate', e.target.value)} />
                    </div>
                    <div>
                      <Label>Analysis Completed / PCC Ended</Label>
                      <Select value={formData.analysisCompleted} onChange={(e) => handleInputChange('analysisCompleted', e.target.value)}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="In Progress">In Progress</option>
                      </Select>
                    </div>
                    <div>
                      <Label>Solution Available / Final Status</Label>
                      <Select value={formData.solutionAvailable} onChange={(e) => handleInputChange('solutionAvailable', e.target.value)}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Pending">Pending</option>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Workshop Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Workshop Information</h3>
                  <div>
                    <Label>Repair Measures</Label>
                    <Textarea value={formData.repairMeasures} onChange={(e) => handleInputChange('repairMeasures', e.target.value)} placeholder="Describe repair measures taken by workshop" rows={3} />
                  </div>
                  <div>
                    <Label>Problem Solved After Repair?</Label>
                    <Select value={formData.problemSolved} onChange={(e) => handleInputChange('problemSolved', e.target.value)}>
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Partially">Partially</option>
                    </Select>
                  </div>
                  <div>
                    <Label>Workshop Comment</Label>
                    <Textarea value={formData.workshopComment} onChange={(e) => handleInputChange('workshopComment', e.target.value)} placeholder="Additional workshop comments" rows={3} />
                  </div>
                </div>

                {/* Escalation */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Brand Escalation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Escalated to Brand? *</Label>
                      <Select value={formData.escalatedToBrand} onChange={(e) => handleInputChange('escalatedToBrand', e.target.value)} required>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </Select>
                    </div>
                    {formData.escalatedToBrand === 'Yes' && (
                      <div>
                        <Label>Escalation Details</Label>
                        <Button type="button" variant="outline" onClick={() => setShowEscalationDialog(true)}>
                          {formData.escalationDescription ? 'Edit Escalation' : 'Add Escalation Details'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 justify-end pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Submit PCC
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        ) : (
          <>
            {isDealer ? (
              <div className="space-y-6">
                {/* Dealer View */}
                <Card>
                  <CardHeader>
                    <CardTitle>Register New PCC</CardTitle>
                    <CardDescription>
                      Submit a new Dealer PCC application for technical support
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => setShowForm(true)}>Create New PCC Application</Button>
                  </CardContent>
                </Card>

            <Card>
              <CardHeader>
                <CardTitle>My PCC Submissions</CardTitle>
                <CardDescription>
                  Track your submitted PCC applications and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left">PCC ID</th>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">VIN</th>
                        <th className="p-3 text-left">Topic</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">TSC Agent</th>
                        <th className="p-3 text-left">Response Date</th>
                        <th className="p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-muted-foreground">
                          No PCC submissions yet. Create your first application to get started.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Individual Dashboard</CardTitle>
                <CardDescription>
                  Overview of your PCC performance and statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <p className="text-3xl font-bold text-blue-600">0</p>
                    <p className="text-sm text-muted-foreground mt-1">Total Submitted</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                    <p className="text-3xl font-bold text-yellow-600">0</p>
                    <p className="text-sm text-muted-foreground mt-1">Pending Review</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <p className="text-3xl font-bold text-green-600">0</p>
                    <p className="text-sm text-muted-foreground mt-1">Resolved</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <p className="text-3xl font-bold text-purple-600">0</p>
                    <p className="text-sm text-muted-foreground mt-1">In Progress</p>
                  </div>
                </div>
                
                {/* Charts Section */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3">Status Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pending</span>
                        <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{width: '0%'}}></div>
                        </div>
                        <span className="text-sm font-medium">0%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">In Progress</span>
                        <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{width: '0%'}}></div>
                        </div>
                        <span className="text-sm font-medium">0%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Resolved</span>
                        <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '0%'}}></div>
                        </div>
                        <span className="text-sm font-medium">0%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3">Response Time Tracking</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Avg Response Time</span>
                          <span className="font-medium">N/A</span>
                        </div>
                        <div className="text-xs text-muted-foreground">No data available yet</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Manufacturer/Admin View */}
            <Card>
              <CardHeader>
                <CardTitle>All Dealer PCC Applications</CardTitle>
                <CardDescription>
                  Review, track, and manage dealer PCC submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-2">
                  <Input placeholder="Search by VIN, Dealer Code, or PCC ID..." className="max-w-md" />
                  <Select>
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="escalated">Escalated</option>
                  </Select>
                  <Select>
                    <option value="">All Brands</option>
                    <option value="skoda">Škoda</option>
                    <option value="volkswagen">Volkswagen</option>
                  </Select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left">PCC ID</th>
                        <th className="p-3 text-left">Dealer</th>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">VIN</th>
                        <th className="p-3 text-left">Topic</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Priority</th>
                        <th className="p-3 text-left">Assigned To</th>
                        <th className="p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-muted-foreground">
                          No PCC applications to review
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Overall Dashboard - Admin View</CardTitle>
                <CardDescription>
                  Complete overview of all PCC activities across the dealer network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <p className="text-3xl font-bold text-blue-600">0</p>
                    <p className="text-sm text-muted-foreground mt-1">Total PCCs</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                    <p className="text-3xl font-bold text-yellow-600">0</p>
                    <p className="text-sm text-muted-foreground mt-1">Pending</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <p className="text-3xl font-bold text-purple-600">0</p>
                    <p className="text-sm text-muted-foreground mt-1">In Progress</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <p className="text-3xl font-bold text-green-600">0</p>
                    <p className="text-sm text-muted-foreground mt-1">Resolved</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                    <p className="text-3xl font-bold text-red-600">0</p>
                    <p className="text-sm text-muted-foreground mt-1">Escalated</p>
                  </div>
                </div>

                {/* Charts & Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Brand Distribution */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-4">Brand Distribution</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Škoda</span>
                          <span className="text-sm font-medium">0 (0%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: '0%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Volkswagen</span>
                          <span className="text-sm font-medium">0 (0%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '0%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resolution Status */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-4">Resolution Progress</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Open Cases</span>
                          <span className="text-sm font-medium">0</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{width: '0%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Closed Cases</span>
                          <span className="text-sm font-medium">0</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '0%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Topic Distribution */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-4">Topic Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span className="text-sm">Dealer PCC</span>
                        <span className="text-sm font-medium">0</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span className="text-sm">Long Term PCC</span>
                        <span className="text-sm font-medium">0</span>
                      </div>
                    </div>
                  </div>

                  {/* Response Time Metrics */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-4">Performance Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Avg Response Time</span>
                        <span className="text-lg font-bold">N/A</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Avg Resolution Time</span>
                        <span className="text-lg font-bold">N/A</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Escalation Rate</span>
                        <span className="text-lg font-bold">0%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Dealers by PCC Count */}
                <div className="mt-6 p-4 border rounded-lg">
                  <h4 className="font-semibold mb-4">Top Active Dealers</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-sm text-muted-foreground">
                          <th className="text-left p-2">Dealer Code</th>
                          <th className="text-left p-2">Dealer Name</th>
                          <th className="text-left p-2">Total PCCs</th>
                          <th className="text-left p-2">Pending</th>
                          <th className="text-left p-2">Resolved</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-sm text-muted-foreground">
                            No data available
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Role Management - Admin Only */}
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle>User Role Management</CardTitle>
                  <CardDescription>
                    Manage user credentials and access permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input placeholder="Search users..." className="max-w-md" />
                      <Button>Add New User</Button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="p-3 text-left">User Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-left">Dealer Code</th>
                            <th className="p-3 text-left">Access Level</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-3">{user?.name}</td>
                            <td className="p-3">{user?.email}</td>
                            <td className="p-3">
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                                Admin
                              </span>
                            </td>
                            <td className="p-3">-</td>
                            <td className="p-3">Full Access</td>
                            <td className="p-3">
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                                Active
                              </span>
                            </td>
                            <td className="p-3">
                              <Button variant="outline" size="sm">Edit</Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
