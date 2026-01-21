import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function DealerPCCPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isDealer = user?.dealerCode;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">📋 Dealer PCC Management</h1>
              <p className="text-sm opacity-90">
                Performance Center Program Registration
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
            {/* Dealer View */}
            <Card>
              <CardHeader>
                <CardTitle>Register New PCC</CardTitle>
                <CardDescription>
                  Submit a new Dealer PCC application based on eligibility criteria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button>Create New PCC Application</Button>
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
                <div className="text-center py-8 text-muted-foreground">
                  <p>No PCC submissions yet</p>
                  <p className="text-sm mt-2">Create your first application to get started</p>
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
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold text-primary">0</p>
                    <p className="text-sm text-muted-foreground">Total Submitted</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold text-warning">0</p>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold text-success">0</p>
                    <p className="text-sm text-muted-foreground">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Manufacturer View */}
            <Card>
              <CardHeader>
                <CardTitle>All Dealer PCC Applications</CardTitle>
                <CardDescription>
                  Review, edit, and approve dealer PCC submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>No PCC applications to review</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Overall Dashboard</CardTitle>
                <CardDescription>
                  Summary of all PCC activities across dealers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold text-primary">0</p>
                    <p className="text-sm text-muted-foreground">Total Applications</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold text-warning">0</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold text-success">0</p>
                    <p className="text-sm text-muted-foreground">Approved</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold text-destructive">0</p>
                    <p className="text-sm text-muted-foreground">Rejected</p>
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
