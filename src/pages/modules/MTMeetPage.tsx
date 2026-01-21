import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function MTMeetPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isDealer = user?.dealerCode;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">👥 MT Meet</h1>
              <p className="text-sm opacity-90">
                Master Technician Meet Registration
              </p>
            </div>
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {isDealer ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Register for MT Meet</CardTitle>
                <CardDescription>
                  Register employees for Master Technician meetings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button>New MT Meet Registration</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My MT Meet Registrations</CardTitle>
                <CardDescription>
                  View all your MT Meet registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>No registrations yet</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All MT Meet Registrations</CardTitle>
                <CardDescription>
                  View and manage all MT Meet registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>No registrations to display</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Overall Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold text-primary">0</p>
                    <p className="text-sm text-muted-foreground">Total Registrations</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold text-info">0</p>
                    <p className="text-sm text-muted-foreground">Upcoming Meets</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold text-success">0</p>
                    <p className="text-sm text-muted-foreground">Dealers Registered</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold text-accent">0</p>
                    <p className="text-sm text-muted-foreground">Technicians</p>
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
