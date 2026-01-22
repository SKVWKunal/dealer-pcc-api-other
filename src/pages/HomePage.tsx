import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import Navigation from '@/components/Navigation'

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#4A9D5F] to-[#1E5631] text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-4">
                <svg viewBox="0 0 60 60" className="h-20 w-20" fill="none">
                  <circle cx="30" cy="30" r="28" fill="white" opacity="0.2"/>
                  <circle cx="30" cy="30" r="24" fill="white"/>
                  <text x="30" y="42" fontSize="28" fontWeight="bold" fill="#4A9D5F" textAnchor="middle">Š</text>
                </svg>
                <div className="text-2xl font-light text-white/80">|</div>
                <svg viewBox="0 0 60 60" className="h-20 w-20" fill="none">
                  <circle cx="30" cy="30" r="28" fill="white" opacity="0.2"/>
                  <circle cx="30" cy="30" r="24" fill="white"/>
                  <text x="30" y="42" fontSize="28" fontWeight="bold" fill="#1E5631" textAnchor="middle">V</text>
                </svg>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Škoda | Volkswagen
            </h1>
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              Dealer Portal System
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Centralized hub for dealer operations, technical training, and system integration.<br/>
              Emphasizing mobility, safety, and digital excellence.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-[#4A9D5F] hover:bg-gray-100 font-semibold px-8"
                onClick={() => navigate('/login?type=dealer')}
              >
                Dealer Portal
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 font-semibold px-8"
                onClick={() => navigate('/login?type=manufacturer')}
              >
                Manufacturer Access
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Platform Services</h2>
          <p className="text-lg text-gray-600">Comprehensive tools for dealer network management and technical excellence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-[#4A9D5F]">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[#4A9D5F]/10 rounded-lg">
                  <span className="text-3xl">🔗</span>
                </div>
                <div>
                  <CardTitle className="text-[#4A9D5F]">API Registration</CardTitle>
                  <CardDescription className="text-sm">
                    System integration and API management
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Register and manage API access for seamless dealer system integration with manufacturer platforms.
              </p>
              <Button className="w-full bg-[#4A9D5F] hover:bg-[#3A7D4F]" onClick={() => navigate('/api-registration')}>
                Access API Portal
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-[#4A9D5F]">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[#4A9D5F]/10 rounded-lg">
                  <span className="text-3xl">👥</span>
                </div>
                <div>
                  <CardTitle className="text-[#4A9D5F]">MT Meet Registration</CardTitle>
                  <CardDescription className="text-sm">
                    Master Technician training events
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Schedule and track Master Technician meetings and advanced technical training sessions.
              </p>
              <Button className="w-full bg-[#4A9D5F] hover:bg-[#3A7D4F]" onClick={() => navigate('/mt-meet')}>
                Register for Events
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-[#4A9D5F]">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[#4A9D5F]/10 rounded-lg">
                  <span className="text-3xl">🔧</span>
                </div>
                <div>
                  <CardTitle className="text-[#4A9D5F]">Workshop Survey</CardTitle>
                  <CardDescription className="text-sm">
                    Workshop systems feedback
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Share feedback on workshop management systems and operational tools for continuous improvement.
              </p>
              <Button className="w-full bg-[#4A9D5F] hover:bg-[#3A7D4F]" onClick={() => navigate('/workshop-survey')}>
                Complete Survey
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-[#4A9D5F]">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[#4A9D5F]/10 rounded-lg">
                  <span className="text-3xl">🛡️</span>
                </div>
                <div>
                  <CardTitle className="text-[#4A9D5F]">Warranty Survey</CardTitle>
                  <CardDescription className="text-sm">
                    Warranty process feedback
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Evaluate warranty claim processes and help us enhance service efficiency and customer satisfaction.
              </p>
              <Button className="w-full bg-[#4A9D5F] hover:bg-[#3A7D4F]" onClick={() => navigate('/warranty-survey')}>
                Provide Feedback
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-[#4A9D5F]">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[#4A9D5F]/10 rounded-lg">
                  <span className="text-3xl">📊</span>
                </div>
                <div>
                  <CardTitle className="text-[#4A9D5F]">Technical Awareness</CardTitle>
                  <CardDescription className="text-sm">
                    Training session evaluation
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Assess technical training effectiveness and identify areas for skill development improvements.
              </p>
              <Button className="w-full bg-[#4A9D5F] hover:bg-[#3A7D4F]" onClick={() => navigate('/technical-survey')}>
                Submit Feedback
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-[#4A9D5F]">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[#4A9D5F]/10 rounded-lg">
                  <span className="text-3xl">📚</span>
                </div>
                <div>
                  <CardTitle className="text-[#4A9D5F]">Database</CardTitle>
                  <CardDescription className="text-sm">
                    Technical documentation hub
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Access comprehensive technical manuals, service bulletins, and dealer reference materials.
              </p>
              <Button className="w-full bg-[#4A9D5F] hover:bg-[#3A7D4F]" onClick={() => navigate('/database')}>
                Browse Database
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Important Notice & Disclaimer</h3>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Authorized Access Only</h4>
                <p className="text-sm text-gray-600">
                  This website is an internal platform exclusively for authorized Škoda and Volkswagen dealer network personnel. 
                  Access is restricted to registered users with valid credentials. The information, tools, and services provided 
                  through this portal are proprietary and confidential.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Usage Terms</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>All content is for authorized dealer use only</li>
                  <li>API credentials must be kept secure and confidential</li>
                  <li>Survey responses are used for internal improvement purposes</li>
                  <li>Technical documentation is subject to manufacturer copyright</li>
                  <li>Unauthorized access or data sharing is strictly prohibited</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Data Protection</h4>
                <p className="text-sm text-gray-600">
                  This platform handles sensitive business information in accordance with applicable data protection regulations. 
                  Users are responsible for maintaining the confidentiality of their login credentials and ensuring compliance 
                  with manufacturer policies.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Support</h4>
                <p className="text-sm text-gray-600">
                  For technical issues, policy questions, or general assistance, please use the contact channels provided in 
                  the <a href="/contact" className="text-[#4A9D5F] hover:underline font-medium">Contact</a> section.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 italic">
                  This stripped-down description reflects only the visible content above the footer and is suitable as 
                  high-level contextual documentation for building this internal website structure in Codespaces.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#1E5631] text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Škoda | Volkswagen Dealer Portal. All rights reserved.</p>
          <p className="text-xs text-white/70 mt-2">Emphasizing mobility, safety, and digital integration.</p>
        </div>
      </div>
    </div>
  )
}
