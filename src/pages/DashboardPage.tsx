import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  FileText,
  Users,
  BarChart3,
  Shield,
  BookOpen,
  Database,
  Lock,
  AlertCircle,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { FEATURE_CONFIG, APPROVAL_STATUS_DISPLAY, APPROVAL_STATUS } from '@/config/rbac.config';

interface UserProfile {
  user: {
    id: string;
    email: string;
    name: string;
    dealerName: string;
    dealerCode: string;
    approvalStatus: string;
  };
  roles: Array<{
    id: string;
    name: string;
    display_name: string;
  }>;
  features: Array<{
    id: string;
    slug: string;
    name: string;
    description: string;
    icon: string;
    routePath: string;
    permissions: {
      canView: boolean;
      canCreate: boolean;
      canEdit: boolean;
    };
  }>;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Users,
  BarChart3,
  Shield,
  BookOpen,
  Database,
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get user profile with features
        const response = await fetch('/api/v1/auth/user/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          if (response.status === 403) {
            const error = await response.json();
            if (error.error.code === 'APPROVAL_PENDING') {
              toast.error('Your account is pending approval');
              logout();
              navigate('/registration-status', { state: { email: user?.email } });
              return;
            } else if (error.error.code === 'APPROVAL_REJECTED') {
              toast.error('Your account has been rejected');
              logout();
              navigate('/');
              return;
            }
          }
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data.data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to load profile'
        );
        logout();
        navigate('/login?type=dealer');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, navigate, logout]);

  const getApprovalStatusDisplay = () => {
    if (!profile) return null;

    const status = profile.user.approvalStatus;
    const config =
      APPROVAL_STATUS_DISPLAY[status as keyof typeof APPROVAL_STATUS_DISPLAY];

    if (!config) return null;

    const StatusIcon = {
      pending: Clock,
      approved: CheckCircle,
      rejected: AlertCircle,
    }[status as 'pending' | 'approved' | 'rejected'] || Clock;

    const bgColors = {
      pending: 'bg-yellow-50 border-yellow-200',
      approved: 'bg-green-50 border-green-200',
      rejected: 'bg-red-50 border-red-200',
    };

    const textColors = {
      pending: 'text-yellow-900',
      approved: 'text-green-900',
      rejected: 'text-red-900',
    };

    return (
      <div className={`p-4 border rounded-lg ${bgColors[status as 'pending' | 'approved' | 'rejected']}`}>
        <div className="flex items-center gap-2">
          <StatusIcon className="h-5 w-5" />
          <p className={`text-sm font-medium ${textColors[status as 'pending' | 'approved' | 'rejected']}`}>
            {config.label}
          </p>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
              <h2 className="text-xl font-semibold">Unable to Load Profile</h2>
              <p className="text-muted-foreground">
                There was an error loading your profile. Please try again.
              </p>
              <Button onClick={() => navigate('/login?type=dealer')} className="w-full">
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const accessibleFeatures = profile.features.sort(
    (a, b) => (a.routePath?.split('/').length || 0) - (b.routePath?.split('/').length || 0)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Welcome back, {profile.user.name}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Logout
            </Button>
          </div>

          {/* User Info Card */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">User Name</p>
                  <p className="font-semibold">{profile.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold text-sm break-all">{profile.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dealer</p>
                  <p className="font-semibold">
                    {profile.user.dealerCode} - {profile.user.dealerName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Roles</p>
                  <p className="font-semibold">
                    {profile.roles.map((r) => r.display_name).join(', ')}
                  </p>
                </div>
              </div>

              {/* Approval Status */}
              <div className="mt-4">
                {getApprovalStatusDisplay()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">Available Features</h2>
            <p className="text-muted-foreground">
              {accessibleFeatures.length} feature
              {accessibleFeatures.length !== 1 ? 's' : ''} available for your role
              {profile.roles.length > 1 ? 's' : ''}
            </p>
          </div>

          {accessibleFeatures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accessibleFeatures.map((feature) => {
                const IconComponent =
                  iconMap[feature.icon as keyof typeof iconMap] || FileText;

                return (
                  <Card
                    key={feature.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(feature.routePath || '#')}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <IconComponent className="h-5 w-5 text-primary" />
                            {feature.name}
                          </CardTitle>
                          <CardDescription>{feature.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Permissions Display */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">
                          YOUR PERMISSIONS
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {feature.permissions.canView && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                              <span>👁️</span> View
                            </span>
                          )}
                          {feature.permissions.canCreate && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                              <span>➕</span> Create
                            </span>
                          )}
                          {feature.permissions.canEdit && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                              <span>✏️</span> Edit
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(feature.routePath || '#');
                        }}
                        className="w-full"
                      >
                        Access Feature
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center space-y-4">
                <Lock className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="font-semibold text-lg">No Features Available</h3>
                  <p className="text-muted-foreground">
                    Your account doesn't have access to any features yet. Please contact
                    the manufacturer administrator.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Total Features</p>
                <p className="text-2xl font-bold">{accessibleFeatures.length}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Assigned Roles</p>
                <p className="text-2xl font-bold">{profile.roles.length}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Account Status</p>
                <p className="text-2xl font-bold capitalize">
                  {profile.user.approvalStatus === 'approved' ? '✓ Active' : 'Pending'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
