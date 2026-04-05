import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Radio, 
  Brain, 
  MapPin, 
  LayoutDashboard,
  Zap,
  Shield,
  Clock,
  Bell
} from 'lucide-react';

const features = [
  {
    id: '01',
    title: 'Real-time Incident Reporting',
    description: 'Instantly report emergencies with AI-assisted classification. Citizens can quickly submit incidents with location, description, and media evidence.',
    icon: Radio,
    color: 'from-shield-purple to-shield-blue',
    stats: { value: '< 60s', label: 'Report Time' },
  },
  {
    id: '02',
    title: 'AI Severity Analysis',
    description: 'Machine learning algorithms assess threat levels automatically. NLP processes descriptions to classify incidents and calculate severity scores.',
    icon: Brain,
    color: 'from-shield-cyan to-shield-purple',
    stats: { value: '95%', label: 'Accuracy' },
  },
  {
    id: '03',
    title: 'Live Geo-Tracking',
    description: 'Precise location mapping with hotspot detection. Visualize incidents on interactive maps with clustering and heatmap overlays.',
    icon: MapPin,
    color: 'from-shield-blue to-shield-cyan',
    stats: { value: '±5m', label: 'Precision' },
  },
  {
    id: '04',
    title: 'Unified Command Dashboard',
    description: 'Centralized monitoring for emergency responders. Real-time analytics, alert management, and dispatch coordination in one interface.',
    icon: LayoutDashboard,
    color: 'from-shield-purple to-shield-red',
    stats: { value: 'Real-time', label: 'Updates' },
  },
];

const additionalFeatures = [
  { icon: Zap, title: 'Instant Alerts', desc: 'Push notifications to responders' },
  { icon: Shield, title: 'Trust Score', desc: 'User verification system' },
  { icon: Clock, title: '24/7 Monitoring', desc: 'Always-on surveillance' },
  { icon: Bell, title: 'Smart Dispatch', desc: 'Automated resource allocation' },
];

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={containerRef}
      className="relative py-32 overflow-hidden"
      id="features"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-shield-purple/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
          >
            <Zap className="w-4 h-4 text-shield-cyan" />
            <span className="text-sm text-white/80">System Capabilities</span>
          </motion.div>

          <h2 className="font-orbitron text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Powered by <span className="text-gradient">Advanced AI</span>
          </h2>
          
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            S.H.I.E.L.D combines cutting-edge technologies to deliver 
            unprecedented speed and accuracy in emergency response.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 50, rotateX: 15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ 
                delay: 0.3 + index * 0.15,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative"
            >
              {/* Connection Lines (Visual Only) */}
              {index < features.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-shield-purple/50 to-transparent" />
              )}

              <div className="relative h-full glass-card-strong p-8 overflow-hidden">
                {/* Scan Line Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="scan-line" />
                </div>

                {/* Background Gradient */}
                <div 
                  className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${feature.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-0.5`}>
                      <div className="w-full h-full rounded-xl bg-shield-dark flex items-center justify-center">
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <span className="font-orbitron text-4xl font-bold text-white/10">
                      {feature.id}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-orbitron text-xl font-bold text-white mb-4 group-hover:text-shield-cyan transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/60 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="font-orbitron text-2xl text-shield-cyan">
                        {feature.stats.value}
                      </p>
                      <p className="text-xs text-white/40">{feature.stats.label}</p>
                    </div>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.color} opacity-20`} />
                  <div className="absolute inset-[1px] rounded-xl bg-shield-dark" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {additionalFeatures.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.9 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="glass-card p-6 text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-shield-purple/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-shield-purple/30 transition-colors">
                <item.icon className="w-6 h-6 text-shield-purple" />
              </div>
              <h4 className="font-orbitron text-sm font-semibold text-white mb-1">
                {item.title}
              </h4>
              <p className="text-xs text-white/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-shield-purple/30 to-transparent" />
    </section>
  );
}
