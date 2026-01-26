import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { APPROVAL_STATUS, APPROVAL_STATUS_DISPLAY } from '@/config/rbac.config';

interface RegistrationStatus {
  stage: 'registration' | 'user';
  status?: string;
  approvalStatus?: string;
  canLogin: boolean;
  rejectionReason?: string;
}

export default function RegistrationStatusPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(initialEmail ? true : false);
  const [status, setStatus] = useState<RegistrationStatus | null>(null);
  const [checked, setChecked] = useState(initialEmail ? true : false);

  const checkStatus = async (emailToCheck: string) => {
    if (!emailToCheck) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/v1/auth/dealer/registration-status/${emailToCheck}`
      );

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 404) {
          setStatus(null);
          toast.error('No registration found for this email');
        } else {
          throw new Error(error.error.message);
        }
      } else {
        const data = await response.json();
        setStatus(data.data);
        setChecked(true);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to check status'
      );
      setStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    checkStatus(email);
  };

  // Auto-check if email is in URL params
  useState(() => {
    if (initialEmail) {
      checkStatus(initialEmail);
    }
  }, []);

  const getStatusDisplay = () => {
    if (!status) return null;

    const statusValue = status.status || status.approvalStatus;
    const displayConfig =
      APPROVAL_STATUS_DISPLAY[
        statusValue as keyof typeof APPROVAL_STATUS_DISPLAY
      ];

    if (!displayConfig) return null;

    const StatusIcon = {
      pending: Clock,
      approved: CheckCircle,
      rejected: AlertCircle,
    }[statusValue as 'pending' | 'approved' | 'rejected'] || Clock;

    const colors = {
      yellow: 'text-yellow-600',
      green: 'text-green-600',
      red: 'text-red-600',
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <StatusIcon
            className={`h-8 w-8 ${colors[displayConfig.color as keyof typeof colors]}`}
          />
          <div>
            <p className="text-sm text-muted-foreground">Current Status</p>
            <p className="text-xl font-semibold">{displayConfig.label}</p>
          </div>
        </div>

        {statusValue === APPROVAL_STATUS.REJECTED && status.rejectionReason && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-900">
              <strong>Rejection Reason:</strong>
            </p>
            <p className="text-sm text-red-800 mt-1">
              {status.rejectionReason}
            </p>
          </div>
        )}
      </div>
    );
  };

  const getActionButtons = () => {
    if (!status) return null;

    const statusValue = status.status || status.approvalStatus;

    if (statusValue === APPROVAL_STATUS.APPROVED && status.canLogin) {
      return (
        <Button
          onClick={() => navigate(`/login?type=dealer&email=${email}`)}
          className="w-full"
        >
          Proceed to Login
        </Button>
      );
    }

    if (statusValue === APPROVAL_STATUS.REJECTED) {
      return (
        <Button
          onClick={() => navigate('/dealer-register')}
          className="w-full"
        >
          Submit New Registration
        </Button>
      );
    }

    return (
      <div className="space-y-2">
        <Button onClick={() => checkStatus(email)} variant="outline" className="w-full">
          Refresh Status
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Check back in a few moments or refresh this page.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold">
                VW
              </div>
            </div>
            <CardTitle className="text-2xl">Check Registration Status</CardTitle>
            <CardDescription>
              Enter your email to check your registration and approval status
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Search Form */}
            <form onSubmit={handleCheckStatus} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Checking...' : 'Check Status'}
              </Button>
            </form>

            {/* Status Display */}
            {checked && (
              <div className="space-y-4 border-t pt-6">
                {status ? (
                  <>
                    {getStatusDisplay()}

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-900">
                        <strong>Stage:</strong> {status.stage === 'registration' ? 'Registration Pending' : 'Awaiting Final Approval'}
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      {getActionButtons()}
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-900">
                      No registration found for this email. Please check and try again, or
                      {' '}
                      <button
                        onClick={() => navigate('/dealer-register')}
                        className="text-primary hover:underline font-medium"
                      >
                        register here
                      </button>
                      .
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Info Section */}
            <div className="space-y-3 text-sm text-muted-foreground border-t pt-6">
              <div>
                <p className="font-semibold text-foreground mb-1">
                  Pending: Under Review
                </p>
                <p>
                  Your registration is being reviewed by the manufacturer. This typically takes 1-2 business days.
                </p>
              </div>

              <div>
                <p className="font-semibold text-green-600 mb-1">
                  Approved: Ready to Login
                </p>
                <p>
                  Your registration has been approved! You can now log in to the portal.
                </p>
              </div>

              <div>
                <p className="font-semibold text-red-600 mb-1">
                  Rejected: Action Required
                </p>
                <p>
                  Your registration was not approved. Please review the reason and submit a new registration.
                </p>
              </div>
            </div>

            {/* Footer Links */}
            <div className="border-t pt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
