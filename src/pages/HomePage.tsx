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
      <div className="bg-gradient-to-r from-[#4A9D5F] to-[#1E5631] text-white" style={{ colorScheme: 'dark' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-xl">
                <img 
                  src="/skoda-vw-banner.svg" 
                  alt="Škoda | Volkswagen" 
                  className="h-16 sm:h-20 md:h-24 w-auto"
                  loading="eager"
                />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-4">
              Dealer Portal System
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed px-4">
              Centralized hub for dealer operations, technical training, and system integration.
              <br className="hidden sm:block"/>
              <span className="hidden sm:inline"> </span>
              Emphasizing mobility, safety, and digital excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button 
                size="lg" 
                className="bg-white text-[#4A9D5F] hover:bg-gray-100 font-semibold px-6 sm:px-8 w-full sm:w-auto"
                onClick={() => navigate('/login?type=dealer')}
              >
                Dealer Portal
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-[#4A9D5F] font-semibold px-6 sm:px-8 w-full sm:w-auto"
                onClick={() => navigate('/login?type=manufacturer')}
              >
                Manufacturer Access
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 px-4">Platform Services</h2>
          <p className="text-base sm:text-lg text-gray-600 px-4">Comprehensive tools for dealer network management and technical excellence</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-[#4A9D5F] flex flex-col" style={{ colorScheme: 'light' }}>
            <CardHeader className="flex-grow">
              <div className="flex items-start sm:items-center space-x-3">
                <div className="p-2 sm:p-3 bg-[#4A9D5F]/10 rounded-lg flex-shrink-0">
                  <span className="text-2xl sm:text-3xl">🔗</span>
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-[#4A9D5F] text-base sm:text-lg">API Registration</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    System integration and API management
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Register and manage API access for seamless dealer system integration with manufacturer platforms.
              </p>
              <Button className="w-full bg-[#4A9D5F] hover:bg-[#3A7D4F] text-sm sm:text-base" onClick={() => navigate('/api-registration')}>
                Access API Portal
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-[#4A9D5F] flex flex-col" style={{ colorScheme: 'light' }}>
            <CardHeader className="flex-grow">
              <div className="flex items-start sm:items-center space-x-3">
                <div className="p-2 sm:p-3 bg-[#4A9D5F]/10 rounded-lg flex-shrink-0">
                  <span className="text-2xl sm:text-3xl">👥</span>
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-[#4A9D5F] text-base sm:text-lg">MT Meet Registration</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Master Technician training events
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Schedule and track Master Technician meetings and advanced technical training sessions.
              </p>
              <Button className="w-full bg-[#4A9D5F] hover:bg-[#3A7D4F] text-sm sm:text-base" onClick={() => navigate('/mt-meet')}>
                Register for Events
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-[#4A9D5F] flex flex-col" style={{ colorScheme: 'light' }}>
            <CardHeader className="flex-grow">
              <div className="flex items-start sm:items-center space-x-3">
                <div className="p-2 sm:p-3 bg-[#4A9D5F]/10 rounded-lg flex-shrink-0">
                  <span className="text-2xl sm:text-3xl">🔧</span>
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-[#4A9D5F] text-base sm:text-lg">Workshop Survey</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Workshop systems feedback
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Share feedback on workshop management systems and operational tools for continuous improvement.
              </p>
              <Button className="w-full bg-[#4A9D5F] hover:bg-[#3A7D4F] text-sm sm:text-base" onClick={() => navigate('/workshop-survey')}>
                Complete Survey
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-[#4A9D5F] flex flex-col" style={{ colorScheme: 'light' }}>
            <CardHeader className="flex-grow">
              <div className="flex items-start sm:items-center space-x-3">
                <div className="p-2 sm:p-3 bg-[#4A9D5F]/10 rounded-lg flex-shrink-0">
                  <span className="text-2xl sm:text-3xl">🛡️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-[#4A9D5F] text-base sm:text-lg">Warranty Survey</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Warranty process feedback
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Evaluate warranty claim processes and help us enhance service efficiency and customer satisfaction.
              </p>
              <Button className="w-full bg-[#4A9D5F] hover:bg-[#3A7D4F] text-sm sm:text-base" onClick={() => navigate('/warranty-survey')}>
                Provide Feedback
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-[#4A9D5F] flex flex-col" style={{ colorScheme: 'light' }}>
            <CardHeader className="flex-grow">
              <div className="flex items-start sm:items-center space-x-3">
                <div className="p-2 sm:p-3 bg-[#4A9D5F]/10 rounded-lg flex-shrink-0">
                  <span className="text-2xl sm:text-3xl">📊</span>
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-[#4A9D5F] text-base sm:text-lg">Technical Awareness</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Training session evaluation
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Assess technical training effectiveness and identify areas for skill development improvements.
              </p>
              <Button className="w-full bg-[#4A9D5F] hover:bg-[#3A7D4F] text-sm sm:text-base" onClick={() => navigate('/technical-survey')}>
                Submit Feedback
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-[#4A9D5F] flex flex-col" style={{ colorScheme: 'light' }}>
            <CardHeader className="flex-grow">
              <div className="flex items-start sm:items-center space-x-3">
                <div className="p-2 sm:p-3 bg-[#4A9D5F]/10 rounded-lg flex-shrink-0">
                  <span className="text-2xl sm:text-3xl">📚</span>
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-[#4A9D5F] text-base sm:text-lg">Database</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Technical documentation hub
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Access comprehensive technical manuals, service bulletins, and dealer reference materials.
              </p>
              <Button className="w-full bg-[#4A9D5F] hover:bg-[#3A7D4F] text-sm sm:text-base" onClick={() => navigate('/database')}>
                Browse Database
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 px-4">Important Notice & Disclaimer</h3>
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 space-y-3 sm:space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Authorized Access Only</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  This website is an internal platform exclusively for authorized Škoda and Volkswagen dealer network personnel. 
                  Access is restricted to registered users with valid credentials. The information, tools, and services provided 
                  through this portal are proprietary and confidential.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Usage Terms</h4>
                <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 space-y-1 leading-relaxed">
                  <li>All content is for authorized dealer use only</li>
                  <li>API credentials must be kept secure and confidential</li>
                  <li>Survey responses are used for internal improvement purposes</li>
                  <li>Technical documentation is subject to manufacturer copyright</li>
                  <li>Unauthorized access or data sharing is strictly prohibited</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Data Protection</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  This platform handles sensitive business information in accordance with applicable data protection regulations. 
                  Users are responsible for maintaining the confidentiality of their login credentials and ensuring compliance 
                  with manufacturer policies.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Support</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  For technical issues, policy questions, or general assistance, please use the contact channels provided in 
                  the <a href="/contact" className="text-[#4A9D5F] hover:underline font-medium">Contact</a> section.
                </p>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 italic leading-relaxed">
                  This stripped-down description reflects only the visible content above the footer and is suitable as 
                  high-level contextual documentation for building this internal website structure in Codespaces.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#1E5631] text-white py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs sm:text-sm">&copy; {new Date().getFullYear()} Škoda | Volkswagen Dealer Portal. All rights reserved.</p>
          <p className="text-xs text-white/70 mt-2">Emphasizing mobility, safety, and digital integration.</p>
        </div>
      </div>
    </div>
  )
}
