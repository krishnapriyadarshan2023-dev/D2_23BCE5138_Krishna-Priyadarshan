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
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (email: string, _password: string) => {
    // Simulate login
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'citizen',
      trustScore: 85,
      createdAt: new Date(),
    };
    setUser(mockUser);
    localStorage.setItem('shield_user', JSON.stringify(mockUser));
    handleNavigate(mockUser.role === 'admin' ? 'admin-dashboard' : 'citizen-dashboard');
  };

  const handleRegister = (name: string, email: string, _password: string) => {
    // Simulate registration
    const mockUser: User = {
      id: '2',
      email,
      name,
      role: 'citizen',
      trustScore: 50,
      createdAt: new Date(),
    };
    setUser(mockUser);
    localStorage.setItem('shield_user', JSON.stringify(mockUser));
    handleNavigate('citizen-dashboard');
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
