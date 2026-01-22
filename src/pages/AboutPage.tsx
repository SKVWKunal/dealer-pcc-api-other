import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">About Us</h1>
          <p className="text-gray-600">Connecting dealers with excellence through digital innovation</p>
        </div>

        {/* Mission Statement */}
        <div className="mb-8">
          <Card className="border-t-4 border-t-[#4A9D5F]">
            <CardHeader>
              <CardTitle className="text-2xl text-[#4A9D5F]">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                The Škoda | Volkswagen Dealer Portal is an internal platform designed to strengthen the 
                dealer-manufacturer relationship through seamless digital integration. We provide comprehensive 
                tools for dealer operations, technical training, system integration, and quality improvement 
                initiatives. Our platform emphasizes mobility, safety, and digital excellence to ensure the 
                highest standards of service across our dealer network.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-[#4A9D5F]/10 rounded-lg">
                    <span className="text-2xl">🔗</span>
                  </div>
                  <CardTitle className="text-[#4A9D5F]">API Integration</CardTitle>
                </div>
                <CardDescription>
                  Seamless system connectivity enabling real-time data exchange between dealer management 
                  systems and manufacturer platforms.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-[#4A9D5F]/10 rounded-lg">
                    <span className="text-2xl">👨‍🏫</span>
                  </div>
                  <CardTitle className="text-[#4A9D5F]">Technical Training</CardTitle>
                </div>
                <CardDescription>
                  Comprehensive Master Technician programs and technical awareness sessions ensuring 
                  continuous skill development and service excellence.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-[#4A9D5F]/10 rounded-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <CardTitle className="text-[#4A9D5F]">Quality Feedback</CardTitle>
                </div>
                <CardDescription>
                  Structured survey systems collecting valuable insights on workshop operations, 
                  warranty processes, and technical procedures.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-[#4A9D5F]/10 rounded-lg">
                    <span className="text-2xl">📚</span>
                  </div>
                  <CardTitle className="text-[#4A9D5F]">Knowledge Resources</CardTitle>
                </div>
                <CardDescription>
                  Centralized database of technical documentation, service bulletins, manuals, and 
                  diagnostic procedures for authorized dealer personnel.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Core Values</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">🚗</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Mobility Focus</h3>
                  <p className="text-sm text-gray-600">
                    Advancing automotive innovation and service excellence in an evolving mobility landscape.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🛡️</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Safety First</h3>
                  <p className="text-sm text-gray-600">
                    Prioritizing vehicle safety and technical precision in every service interaction.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">💻</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Digital Integration</h3>
                  <p className="text-sm text-gray-600">
                    Leveraging modern technology to streamline operations and enhance dealer capabilities.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Target Audience */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Who We Serve</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 text-[#4A9D5F]">✓</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Dealer Principals & Managers</h3>
                    <p className="text-sm text-gray-600">Strategic oversight and operational management tools</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 text-[#4A9D5F]">✓</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Master Technicians</h3>
                    <p className="text-sm text-gray-600">Advanced technical training and specialized resources</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 text-[#4A9D5F]">✓</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Service Advisors</h3>
                    <p className="text-sm text-gray-600">Customer interaction tools and service coordination support</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 text-[#4A9D5F]">✓</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Workshop Staff</h3>
                    <p className="text-sm text-gray-600">Daily service operation resources and technical documentation</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 text-[#4A9D5F]">✓</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">IT Administrators</h3>
                    <p className="text-sm text-gray-600">System integration support and API management</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 text-[#4A9D5F]">✓</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Regional Managers</h3>
                    <p className="text-sm text-gray-600">Performance monitoring and dealer support coordination</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Stats */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">By The Numbers</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-[#4A9D5F]">500+</div>
                  <div className="text-sm text-gray-600 mt-1">Active Dealers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#4A9D5F]">1,200+</div>
                  <div className="text-sm text-gray-600 mt-1">Technicians Trained</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#4A9D5F]">50+</div>
                  <div className="text-sm text-gray-600 mt-1">API Integrations</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#4A9D5F]">98%</div>
                  <div className="text-sm text-gray-600 mt-1">User Satisfaction</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
