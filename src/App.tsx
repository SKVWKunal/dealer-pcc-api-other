import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/sonner'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import DealerPCCPage from './pages/modules/DealerPCCPage'
import APIRegistrationPage from './pages/modules/APIRegistrationPage'
import MTMeetPage from './pages/modules/MTMeetPage'
import WorkshopSurveyPage from './pages/modules/WorkshopSurveyPage'
import WarrantySurveyPage from './pages/modules/WarrantySurveyPage'
import TechnicalSurveyPage from './pages/modules/TechnicalSurveyPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vw-ui-theme">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dealer-pcc" 
                element={
                  <ProtectedRoute requiredModule="dealer_pcc">
                    <DealerPCCPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/api-registration" 
                element={
                  <ProtectedRoute requiredModule="api_registration">
                    <APIRegistrationPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/mt-meet" 
                element={
                  <ProtectedRoute requiredModule="mt_meet">
                    <MTMeetPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/workshop-survey" 
                element={
                  <ProtectedRoute requiredModule="workshop_survey">
                    <WorkshopSurveyPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/warranty-survey" 
                element={
                  <ProtectedRoute requiredModule="warranty_survey">
                    <WarrantySurveyPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/technical-survey" 
                element={
                  <ProtectedRoute requiredModule="technical_survey">
                    <TechnicalSurveyPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
