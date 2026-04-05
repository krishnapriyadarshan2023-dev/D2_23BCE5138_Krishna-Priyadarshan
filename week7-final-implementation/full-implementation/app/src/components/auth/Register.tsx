import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  AlertCircle,
  User,
  CheckCircle2
} from 'lucide-react';
import type { Route } from '@/types';

interface RegisterProps {
  onNavigate: (route: Route) => void;
  onRegister: (name: string, email: string, password: string, role?: string) => void;
}

export default function Register({ onNavigate, onRegister }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'citizen' | 'admin'>('citizen');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (name && email && password) {
        onRegister(name, email, password, role);
      } else {
        setError('Please fill in all fields');
      }
      setIsLoading(false);
    }, 1500);
  };

  const passwordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const strength = passwordStrength(password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-shield-red', 'bg-shield-amber', 'bg-shield-cyan', 'bg-shield-teal'];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-shield-purple/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Card */}
        <div className="glass-card-strong p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 rounded-xl bg-gradient-to-br from-shield-purple to-shield-blue flex items-center justify-center mx-auto mb-4"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="font-orbitron text-2xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-white/60">
              Join the S.H.I.E.L.D emergency response network
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-shield-red/10 border border-shield-red/30 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-shield-red" />
              <span className="text-sm text-shield-red">{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm text-white/70 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-shield-purple focus:ring-1 focus:ring-shield-purple transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm text-white/70 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@shield.gov"
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-shield-purple focus:ring-1 focus:ring-shield-purple transition-all"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm text-white/70 mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('citizen')}
                  className={`p-4 rounded-lg border transition-all ${
                    role === 'citizen'
                      ? 'border-shield-purple bg-shield-purple/20 text-white'
                      : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <div className="text-2xl mb-1">👤</div>
                  <div className="text-sm font-medium">Citizen</div>
                  <div className="text-xs text-white/40 mt-1">Report incidents</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-4 rounded-lg border transition-all ${
                    role === 'admin'
                      ? 'border-shield-purple bg-shield-purple/20 text-white'
                      : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <div className="text-2xl mb-1">👨‍💼</div>
                  <div className="text-sm font-medium">Admin</div>
                  <div className="text-xs text-white/40 mt-1">Manage system</div>
                </button>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm text-white/70 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-shield-purple focus:ring-1 focus:ring-shield-purple transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              {/* Password Strength */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i < strength ? strengthColors[strength - 1] : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${strength > 0 ? `text-${strengthColors[strength - 1].replace('bg-', '')}` : 'text-white/40'}`}>
                    {strength > 0 ? strengthLabels[strength - 1] : 'Enter password'}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm text-white/70 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-shield-purple focus:ring-1 focus:ring-shield-purple transition-all"
                />
                {confirmPassword && password === confirmPassword && (
                  <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-shield-teal" />
                )}
              </div>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-shield-purple focus:ring-shield-purple"
              />
              <span className="text-sm text-white/60">
                I agree to the{' '}
                <button type="button" className="text-shield-cyan hover:underline">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-shield-cyan hover:underline">
                  Privacy Policy
                </button>
              </span>
            </label>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-shield-purple to-shield-blue text-white font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Sign In Link */}
          <p className="text-center mt-8 text-white/60">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-shield-cyan hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </div>

        {/* Back to Home */}
        <motion.button
          onClick={() => onNavigate('landing')}
          whileHover={{ scale: 1.02 }}
          className="mt-6 text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2 mx-auto"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to home
        </motion.button>
      </motion.div>
    </div>
  );
}
