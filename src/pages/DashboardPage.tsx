import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MODULE_NAMES, ROLE_NAMES } from '@/types/auth';
import Navigation from '@/components/Navigation';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4A9D5F] to-[#1E5631] text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Škoda | Volkswagen Dashboard</h1>
              <p className="text-sm opacity-90 mt-1">
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

        {/* Dashboard Statistics - Conditional based on role */}
        {user.dealerCode ? (
          // Dealer-specific Dashboard
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>My Activity Overview</CardTitle>
              <CardDescription>Your submissions and activity across all modules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">0</p>
                  <p className="text-xs text-muted-foreground mt-1">PCCs Submitted</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <p className="text-2xl font-bold text-purple-600">0</p>
                  <p className="text-xs text-muted-foreground mt-1">MT Registrations</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <p className="text-2xl font-bold text-green-600">0</p>
                  <p className="text-xs text-muted-foreground mt-1">Surveys Completed</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <p className="text-2xl font-bold text-orange-600">0</p>
                  <p className="text-xs text-muted-foreground mt-1">API Registrations</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-muted/50 rounded text-sm text-muted-foreground">
                    No recent activity
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Admin Dashboard with Complete Overview
          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System-Wide Overview</CardTitle>
                <CardDescription>Complete statistics across all dealers and modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <p className="text-3xl font-bold text-blue-600">0</p>
                    <p className="text-xs text-muted-foreground mt-1">Total Dealers</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <p className="text-3xl font-bold text-purple-600">0</p>
                    <p className="text-xs text-muted-foreground mt-1">Active PCCs</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <p className="text-3xl font-bold text-green-600">0</p>
                    <p className="text-xs text-muted-foreground mt-1">Total Surveys</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                    <p className="text-3xl font-bold text-orange-600">0</p>
                    <p className="text-xs text-muted-foreground mt-1">API Integrations</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                    <p className="text-3xl font-bold text-red-600">0</p>
                    <p className="text-xs text-muted-foreground mt-1">Pending Reviews</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Module Activity Chart */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-4">Module Activity</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Dealer PCC</span>
                          <span className="font-medium">0</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '0%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>MT Meet</span>
                          <span className="font-medium">0</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{width: '0%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Surveys</span>
                          <span className="font-medium">0</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '0%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>API Registrations</span>
                          <span className="font-medium">0</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{width: '0%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dealer Participation */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-4">Dealer Engagement</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Active Dealers</span>
                        <span className="text-2xl font-bold text-green-600">0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Inactive Dealers</span>
                        <span className="text-2xl font-bold text-gray-400">0</span>
                      </div>
                      <div className="mt-4 p-3 bg-muted rounded">
                        <div className="text-sm text-muted-foreground">Engagement Rate</div>
                        <div className="text-2xl font-bold mt-1">0%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent System Activity</CardTitle>
                <CardDescription>Latest submissions and updates across all modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="p-4 bg-muted/50 rounded text-sm text-center text-muted-foreground">
                    No recent activity to display
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
