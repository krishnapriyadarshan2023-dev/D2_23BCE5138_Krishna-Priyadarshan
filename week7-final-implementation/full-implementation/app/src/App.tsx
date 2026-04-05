import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';
import Navigation from '@/components/Navigation';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import TechStack from '@/components/sections/TechStack';
import Process from '@/components/sections/Process';
import DashboardPreview from '@/components/sections/DashboardPreview';
import Testimonials from '@/components/sections/Testimonials';
import Footer from '@/components/Footer';
import Login from '@/components/auth/Login';
import Register from '@/components/auth/Register';
import CitizenDashboard from '@/components/dashboard/CitizenDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import type { User, Route } from '@/types';
import { authAPI } from '@/lib/api';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentRoute, setCurrentRoute] = useState<Route>('landing');
  const [user, setUser] = useState<User | null>(null);

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('shield_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleNavigate = (route: Route) => {
    // Protect dashboard routes
    if ((route === 'admin-dashboard' || route === 'citizen-dashboard') && !user) {
      setCurrentRoute('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Prevent citizens from accessing admin dashboard
    if (route === 'admin-dashboard' && user && user.role !== 'admin') {
      setCurrentRoute('citizen-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Prevent admins from accessing citizen dashboard (optional)
    if (route === 'citizen-dashboard' && user && user.role === 'admin') {
      setCurrentRoute('admin-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      // Call real API
      const response = await authAPI.login(email, password);
      
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        trustScore: response.user.trustScore,
        createdAt: new Date(response.user.createdAt),
      };
      
      // Save user with token
      setUser(userData);
      localStorage.setItem('shield_user', JSON.stringify({
        ...userData,
        token: response.token
      }));
      
      handleNavigate(userData.role === 'admin' ? 'admin-dashboard' : 'citizen-dashboard');
    } catch (error: any) {
      console.error('Login failed:', error.message);
      alert('Login failed: ' + error.message);
    }
  };

  const handleRegister = async (name: string, email: string, password: string, role?: string) => {
    try {
      // Call real API
      const response = await authAPI.register(name, email, password, role);
      
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        trustScore: response.user.trustScore,
        createdAt: new Date(response.user.createdAt),
      };
      
      // Save user with token
      setUser(userData);
      localStorage.setItem('shield_user', JSON.stringify({
        ...userData,
        token: response.token
      }));
      
      handleNavigate(userData.role === 'admin' ? 'admin-dashboard' : 'citizen-dashboard');
    } catch (error: any) {
      console.error('Registration failed:', error.message);
      alert('Registration failed: ' + error.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('shield_user');
    handleNavigate('landing');
  };

  // Render current page based on route
  const renderPage = () => {
    switch (currentRoute) {
      case 'landing':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Hero onNavigate={handleNavigate} />
            <Features />
            <TechStack />
            <Process />
            <DashboardPreview />
            <Testimonials />
            <Footer onNavigate={handleNavigate} />
          </motion.div>
        );
      
      case 'login':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Login onNavigate={handleNavigate} onLogin={handleLogin} />
          </motion.div>
        );
      
      case 'register':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Register onNavigate={handleNavigate} onRegister={handleRegister} />
          </motion.div>
        );
      
      case 'citizen-dashboard':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CitizenDashboard onNavigate={handleNavigate} />
          </motion.div>
        );
      
      case 'admin-dashboard':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AdminDashboard onNavigate={handleNavigate} />
          </motion.div>
        );
      
      default:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero onNavigate={handleNavigate} />
            <Features />
            <TechStack />
            <Process />
            <DashboardPreview />
            <Testimonials />
            <Footer onNavigate={handleNavigate} />
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-shield-dark text-white">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Navigation - Hidden on landing page for immersive experience */}
            {currentRoute !== 'landing' && (
              <Navigation
                currentRoute={currentRoute}
                onNavigate={handleNavigate}
                user={user}
                onLogout={handleLogout}
              />
            )}
            
            {/* Navigation for landing page (appears after scroll) */}
            {currentRoute === 'landing' && (
              <Navigation
                currentRoute={currentRoute}
                onNavigate={handleNavigate}
                user={user}
                onLogout={handleLogout}
              />
            )}

            {/* Main Content */}
            <main>
              <AnimatePresence mode="wait">
                {renderPage()}
              </AnimatePresence>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
