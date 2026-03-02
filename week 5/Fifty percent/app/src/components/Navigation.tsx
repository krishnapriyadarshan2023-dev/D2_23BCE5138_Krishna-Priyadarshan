import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, User, LogOut } from 'lucide-react';
import type { User as UserType, Route } from '@/types';

interface NavigationProps {
  currentRoute: Route;
  onNavigate: (route: Route) => void;
  user: UserType | null;
  onLogout: () => void;
}

const navItems: { label: string; route: Route }[] = [
  { label: 'Home', route: 'landing' },
  { label: 'Features', route: 'landing' },
  { label: 'Technology', route: 'landing' },
  { label: 'Dashboard', route: 'admin-dashboard' },
];

export default function Navigation({ currentRoute: _currentRoute, onNavigate, user, onLogout }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (route: Route) => {
    onNavigate(route);
    setIsMobileMenuOpen(false);
    if (route === 'landing') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-shield-dark/90 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleNavClick('landing')}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <Shield className="w-10 h-10 text-shield-purple" />
              <div className="absolute inset-0 bg-shield-purple/30 blur-xl rounded-full" />
            </div>
            <div>
              <h1 className="font-orbitron text-xl font-bold text-white tracking-wider">
                S.H.I.E.L.D
              </h1>
              <p className="text-[10px] text-white/50 tracking-widest -mt-1">
                SMART HAZARD IDENTIFICATION
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.button
                key={index}
                onClick={() => handleNavClick(item.route)}
                className="relative text-sm text-white/70 hover:text-white transition-colors"
                whileHover={{ y: -2 }}
              >
                {item.label}
                <motion.div
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-shield-purple"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Trust Score Badge */}
                <div className="glass-card px-3 py-1.5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-shield-teal animate-pulse" />
                  <span className="text-xs text-white/70">Trust Score:</span>
                  <span className="text-xs font-orbitron text-shield-cyan">
                    {user.trustScore}
                  </span>
                </div>
                
                {/* User Menu */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-shield-purple to-shield-blue flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-white font-medium">{user.name}</p>
                    <p className="text-xs text-white/50 capitalize">{user.role}</p>
                  </div>
                </div>
                
                <motion.button
                  onClick={onLogout}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-5 h-5 text-white/70" />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => handleNavClick('login')}
                  className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  Sign In
                </motion.button>
                <motion.button
                  onClick={() => handleNavClick('register')}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-shield-purple to-shield-blue text-white text-sm font-medium"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 0 20px rgba(123, 97, 255, 0.4)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-shield-dark/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleNavClick(item.route)}
                  className="block w-full text-left py-3 text-white/70 hover:text-white border-b border-white/10"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.label}
                </motion.button>
              ))}
              
              {!user && (
                <div className="pt-4 space-y-3">
                  <motion.button
                    onClick={() => handleNavClick('login')}
                    className="w-full py-3 rounded-lg border border-white/20 text-white"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    onClick={() => handleNavClick('register')}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-shield-purple to-shield-blue text-white font-medium"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Get Started
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
