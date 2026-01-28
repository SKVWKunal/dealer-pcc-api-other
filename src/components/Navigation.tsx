import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: '/api-registration', label: 'API Registration' },
    { path: '/mt-meet', label: 'MT Meet Registration' },
    { path: '/workshop-survey', label: 'Workshop System Survey' },
    { path: '/warranty-survey', label: 'Warranty Survey' },
    { path: '/technical-survey', label: 'Technical Awareness Survey' },
    { path: '/database', label: 'Database' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/about', label: 'About Us' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200" style={{ colorScheme: 'light' }}>
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img 
              src="/skoda-vw-banner.svg" 
              alt="Škoda | Volkswagen" 
              className="h-8 sm:h-10 md:h-12 w-auto"
              loading="eager"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden pb-4 px-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium text-center transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-700 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
