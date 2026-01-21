import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function TechnicalSurveyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isDealer = user?.dealerCode;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">📊 Technical Awareness Survey</h1>
              <p className="text-sm opacity-90">
                Technical Knowledge & Awareness Assessment
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
                <CardTitle>Submit Technical Survey</CardTitle>
                <CardDescription>
                  Provide feedback on technical awareness and training
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button>Start New Survey</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Survey Submissions</CardTitle>
                <CardDescription>
                  View your previous technical survey responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>No surveys submitted yet</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Technical Surveys</CardTitle>
                <CardDescription>
                  View and analyze dealer technical survey responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>No survey data available</p>
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
                    <p className="text-sm text-muted-foreground">Total Responses</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold text-success">0%</p>
                    <p className="text-sm text-muted-foreground">Response Rate</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold text-info">0</p>
                    <p className="text-sm text-muted-foreground">Active Surveys</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold text-warning">0</p>
                    <p className="text-sm text-muted-foreground">Avg. Score</p>
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
