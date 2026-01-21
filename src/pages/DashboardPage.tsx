import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MODULE_NAMES, ROLE_NAMES } from '@/types/auth';

export default function DashboardPage() {
  const { user, hasAccess, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const modules = [
    { id: 'dealer_pcc', path: '/dealer-pcc', icon: '📋' },
    { id: 'api_registration', path: '/api-registration', icon: '🔗' },
    { id: 'mt_meet', path: '/mt-meet', icon: '👥' },
    { id: 'workshop_survey', path: '/workshop-survey', icon: '🔧' },
    { id: 'warranty_survey', path: '/warranty-survey', icon: '🛡️' },
    { id: 'technical_survey', path: '/technical-survey', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <div className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">One Aftersales Dashboard</h1>
              <p className="text-sm opacity-90">
                Welcome, {user.name} • {ROLE_NAMES[user.role]}
              </p>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* User Info Card */}
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium">{ROLE_NAMES[user.role]}</p>
              </div>
              {user.dealerCode && (
                <div>
                  <p className="text-sm text-muted-foreground">Dealer Code</p>
                  <p className="font-medium">{user.dealerCode}</p>
                </div>
              )}
              {user.dealerName && (
                <div>
                  <p className="text-sm text-muted-foreground">Dealer Name</p>
                  <p className="font-medium">{user.dealerName}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Module Access Cards */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const hasModuleAccess = hasAccess(module.id as any);
              
              if (!hasModuleAccess) return null;

              return (
                <Card
                  key={module.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(module.path)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{module.icon}</span>
                      <div>
                        <CardTitle className="text-lg">
                          {MODULE_NAMES[module.id as keyof typeof MODULE_NAMES]}
                        </CardTitle>
                        <CardDescription>Click to access</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      Open Module
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
