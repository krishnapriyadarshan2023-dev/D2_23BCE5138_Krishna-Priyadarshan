import { motion } from 'framer-motion';
import { 
  Shield, 
  Twitter, 
  Linkedin, 
  Github, 
  Mail,
  MapPin,
  Phone
} from 'lucide-react';
import type { Route } from '@/types';

interface FooterProps {
  onNavigate: (route: Route) => void;
}

const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Technology', href: '#technology' },
    { label: 'Dashboard', href: '#dashboard' },
    { label: 'Pricing', href: '#' },
  ],
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Press', href: '#' },
  ],
  resources: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Support', href: '#' },
    { label: 'Status', href: '#' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Security', href: '#' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
];

export default function Footer({ onNavigate: _onNavigate }: FooterProps) {
  return (
    <footer className="relative bg-shield-dark border-t border-white/10">
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-shield-purple/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="relative">
                <Shield className="w-10 h-10 text-shield-purple" />
                <div className="absolute inset-0 bg-shield-purple/30 blur-xl rounded-full" />
              </div>
              <div>
                <h3 className="font-orbitron text-xl font-bold text-white">S.H.I.E.L.D</h3>
                <p className="text-[10px] text-white/50 tracking-widest -mt-1">
                  SMART HAZARD IDENTIFICATION
                </p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-white/60 mb-6 max-w-sm"
            >
              AI-powered public safety incident reporting and real-time emergency 
              response system. Protecting communities through technology.
            </motion.p>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-3 text-sm text-white/50">
                <Mail className="w-4 h-4 text-shield-purple" />
                <span>kpbehara10@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/50">
                <Phone className="w-4 h-4 text-shield-purple" />
                <span>7005697446 SHIELD</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/50">
                <MapPin className="w-4 h-4 text-shield-purple" />
                <span>Chennai Tamil Nadu</span>
              </div>
            </motion.div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (categoryIndex + 1), duration: 0.6 }}
            >
              <h4 className="font-orbitron text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-sm text-white/50 hover:text-shield-cyan transition-colors inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-shield-cyan group-hover:w-2 transition-all" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-sm text-white/40"
          >
            © 2024 S.H.I.E.L.D. All rights reserved.
          </motion.p>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:bg-shield-purple/20 transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5 text-white/60 hover:text-shield-cyan" />
              </motion.a>
            ))}
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-shield-teal animate-pulse" />
            <span className="text-sm text-white/40">All Systems Operational</span>
          </motion.div>
        </div>
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-5 pointer-events-none" />
    </footer>
  );
}
