import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-4xl font-bold shadow-lg">
              VW
            </div>
          </div>
          <h1 className="text-5xl font-bold text-primary mb-4">
            One Aftersales
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Dealer Service Management Platform
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/login?type=dealer')}>
              Dealer Login
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login?type=manufacturer')}>
              Manufacturer Login
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-primary">PCC Management</CardTitle>
              <CardDescription>
                Manage dealer participation in Performance Center Program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Access PCC</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-primary">Surveys</CardTitle>
              <CardDescription>
                Technical, Warranty, and Workshop surveys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View Surveys</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-primary">MT Meets</CardTitle>
              <CardDescription>
                Event registration and management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Manage Events</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-primary">API Registration</CardTitle>
              <CardDescription>
                API registration and documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Register API</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-primary">Admin Console</CardTitle>
              <CardDescription>
                Audit logs and module management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Admin Panel</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-primary">Reports</CardTitle>
              <CardDescription>
                Export survey data and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View Reports</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center text-muted-foreground">
          <p>Powered by Volkswagen Group</p>
        </div>
      </div>
    </div>
  )
}
