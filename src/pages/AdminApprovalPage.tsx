import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { ROLE_DISPLAY_NAMES, ROLES, APPROVAL_STATUS } from '@/config/rbac.config';

interface RegistrationRequest {
  id: string;
  dealer_code: string;
  dealer_name: string;
  user_name: string;
  email: string;
  mobile_number: string;
  requested_role: string;
  additional_info: Record<string, any>;
  submission_date: string;
  status: string;
}

export default function AdminApprovalPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalPassword, setApprovalPassword] = useState('');
  const [additionalRoles, setAdditionalRoles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Check if user is admin
  useEffect(() => {
    if (user && user.userType !== 'manufacturer') {
      toast.error('Access denied. This page is for manufacturer administrators only.');
      navigate('/');
    }
  }, [user, navigate]);

  const fetchRequests = async (pageNum: number = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/v1/auth/admin/registrations?status=pending&page=${pageNum}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch registration requests');
      }

      const data = await response.json();
      setRequests(data.data.registrations);
      setTotalRecords(data.data.total);
      setPage(pageNum);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to fetch requests'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(1);
  }, []);

  const handleApprove = async () => {
    if (!selectedRequest) return;

    if (!approvalPassword) {
      toast.error('Please set a temporary password for the user');
      return;
    }

    if (approvalPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/v1/auth/admin/registrations/${selectedRequest.id}/approve`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({
            password: approvalPassword,
            additionalRoles:
              additionalRoles.length > 0 ? additionalRoles : undefined,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error.message || 'Failed to approve registration');
      }

      toast.success(
        `Registration approved! User ${selectedRequest.email} can now log in.`
      );

      setIsApprovalModalOpen(false);
      setApprovalPassword('');
      setAdditionalRoles([]);
      setSelectedRequest(null);

      // Refresh the list
      fetchRequests(page);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to approve registration'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    if (!rejectionReason.trim() || rejectionReason.length < 10) {
      toast.error('Please provide a reason for rejection (at least 10 characters)');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/v1/auth/admin/registrations/${selectedRequest.id}/reject`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({
            reason: rejectionReason,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error.message || 'Failed to reject registration');
      }

      toast.success(
        `Registration rejected. ${selectedRequest.email} has been notified.`
      );

      setIsRejectionModalOpen(false);
      setRejectionReason('');
      setSelectedRequest(null);

      // Refresh the list
      fetchRequests(page);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to reject registration'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = (request: RegistrationRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const roleOptions = Object.entries(ROLES).map(([key, value]) => ({
    value,
    label: ROLE_DISPLAY_NAMES[value as keyof typeof ROLE_DISPLAY_NAMES],
  }));

  if (!user || user.userType !== 'manufacturer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Dealer Registration Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve pending dealer registration requests
          </p>
        </div>

        {/* Stats */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <p className="text-sm text-yellow-600 font-semibold">Pending Reviews</p>
                <p className="text-3xl font-bold text-yellow-700 mt-2">
                  {totalRecords}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-600 font-semibold">Current Page</p>
                <p className="text-3xl font-bold text-blue-700 mt-2">{page}</p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm text-green-600 font-semibold">Total Records</p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {totalRecords}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Registrations</CardTitle>
            <CardDescription>
              {requests.length > 0
                ? `Showing ${requests.length} request${requests.length !== 1 ? 's' : ''}`
                : 'No pending registrations'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((request) => (
                  <Card key={request.id} className="p-4 border">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <div>
                            <p className="font-semibold">{request.user_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {request.email}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Dealer Code
                            </p>
                            <p className="font-semibold text-sm">
                              {request.dealer_code}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Dealer Name</p>
                            <p className="font-semibold text-sm">
                              {request.dealer_name}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Requested Role
                            </p>
                            <p className="font-semibold text-sm">
                              {ROLE_DISPLAY_NAMES[
                                request.requested_role as keyof typeof ROLE_DISPLAY_NAMES
                              ] || request.requested_role}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Submitted On
                            </p>
                            <p className="font-semibold text-sm">
                              {new Date(request.submission_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(request)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsApprovalModalOpen(true);
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsRejectionModalOpen(true);
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No pending registration requests at the moment.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalRecords > 10 && (
              <div className="flex justify-between items-center mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => fetchRequests(page - 1)}
                  disabled={page === 1 || isLoading}
                >
                  Previous
                </Button>
                <p className="text-sm text-muted-foreground">
                  Page {page} of {Math.ceil(totalRecords / 10)}
                </p>
                <Button
                  variant="outline"
                  onClick={() => fetchRequests(page + 1)}
                  disabled={page >= Math.ceil(totalRecords / 10) || isLoading}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registration Details</DialogTitle>
              <DialogDescription>
                Complete information for {selectedRequest.user_name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">User Name</p>
                  <p className="font-semibold">{selectedRequest.user_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold break-all">{selectedRequest.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mobile Number</p>
                  <p className="font-semibold">{selectedRequest.mobile_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dealer Code</p>
                  <p className="font-semibold">{selectedRequest.dealer_code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dealer Name</p>
                  <p className="font-semibold">{selectedRequest.dealer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Requested Role</p>
                  <p className="font-semibold">
                    {ROLE_DISPLAY_NAMES[
                      selectedRequest.requested_role as keyof typeof ROLE_DISPLAY_NAMES
                    ] || selectedRequest.requested_role}
                  </p>
                </div>
              </div>

              {Object.keys(selectedRequest.additional_info || {}).length > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-semibold mb-3">Additional Information</p>
                  <div className="space-y-2">
                    {Object.entries(selectedRequest.additional_info).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="font-semibold">{String(value)}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Approval Modal */}
      {selectedRequest && (
        <Dialog open={isApprovalModalOpen} onOpenChange={setIsApprovalModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Registration</DialogTitle>
              <DialogDescription>
                Approve registration for {selectedRequest.user_name} (
                {selectedRequest.email})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-900">
                  <strong>Action:</strong> This user will be able to log in after
                  approval with the password you set below.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Set Temporary Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={approvalPassword}
                  onChange={(e) => setApprovalPassword(e.target.value)}
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">
                  The user should change this password on first login
                </p>
              </div>

              <div className="space-y-2">
                <Label>Assign Additional Roles (Optional)</Label>
                <Select
                  value={additionalRoles[0] || ''}
                  onValueChange={(value) => {
                    if (!additionalRoles.includes(value)) {
                      setAdditionalRoles([...additionalRoles, value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select additional role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions
                      .filter(
                        (role) =>
                          role.value !== selectedRequest.requested_role &&
                          !additionalRoles.includes(role.value)
                      )
                      .map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {additionalRoles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {additionalRoles.map((role) => (
                      <div
                        key={role}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                      >
                        {ROLE_DISPLAY_NAMES[role as keyof typeof ROLE_DISPLAY_NAMES]}
                        <button
                          onClick={() =>
                            setAdditionalRoles(
                              additionalRoles.filter((r) => r !== role)
                            )
                          }
                          className="ml-1 hover:opacity-70"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsApprovalModalOpen(false);
                  setApprovalPassword('');
                  setAdditionalRoles([]);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApprove}
                disabled={!approvalPassword || isSubmitting}
              >
                {isSubmitting ? 'Approving...' : 'Approve Registration'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Rejection Modal */}
      {selectedRequest && (
        <Dialog open={isRejectionModalOpen} onOpenChange={setIsRejectionModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Registration</DialogTitle>
              <DialogDescription>
                Reject registration for {selectedRequest.user_name} (
                {selectedRequest.email})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-900">
                  <strong>Warning:</strong> The user will not be able to log in.
                  They will see the rejection reason on their status page.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Rejection Reason *</Label>
                <Textarea
                  id="reason"
                  placeholder="Explain why this registration is being rejected (minimum 10 characters)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  minLength={10}
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsRejectionModalOpen(false);
                  setRejectionReason('');
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectionReason || rejectionReason.length < 10 || isSubmitting}
              >
                {isSubmitting ? 'Rejecting...' : 'Reject Registration'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
