import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  Smartphone, 
  Brain, 
  Send, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Report',
    description: 'Citizen reports incident via mobile or web interface. GPS location is automatically captured and media evidence can be attached.',
    icon: Smartphone,
    color: 'shield-purple',
    time: '< 1 min',
  },
  {
    id: 2,
    title: 'Analyze',
    description: 'AI processes the report using NLP for classification and severity assessment. Machine learning models evaluate threat levels.',
    icon: Brain,
    color: 'shield-cyan',
    time: '< 3 sec',
  },
  {
    id: 3,
    title: 'Dispatch',
    description: 'Emergency responders receive real-time alerts with all relevant information. Smart routing ensures fastest response.',
    icon: Send,
    color: 'shield-amber',
    time: 'Instant',
  },
  {
    id: 4,
    title: 'Resolve',
    description: 'Incident is tracked through to resolution. Data feeds back into the system to improve future responses.',
    icon: CheckCircle2,
    color: 'shield-teal',
    time: 'Tracked',
  },
];

export default function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      ref={containerRef}
      className="relative py-32 overflow-hidden"
      id="how-it-works"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <ArrowRight className="w-4 h-4 text-shield-cyan" />
            <span className="text-sm text-white/80">How It Works</span>
          </motion.div>

          <h2 className="font-orbitron text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            The <span className="text-gradient">Response Pipeline</span>
          </h2>
          
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            From incident report to resolution, our AI-powered pipeline 
            ensures rapid, accurate emergency response.
          </p>
        </motion.div>

        {/* Process Timeline */}
        <div className="relative">
          {/* Central Circuit Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 hidden md:block">
            {/* Background Line */}
            <div className="absolute inset-0 bg-shield-navy rounded-full" />
            
            {/* Animated Progress Line */}
            <motion.div
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-shield-purple via-shield-cyan to-shield-teal rounded-full"
              style={{ height: lineHeight }}
            />
            
            {/* Glow Effect */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-shield-cyan blur-md"
              style={{
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.8)',
              }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ 
                    delay: 0.3 + index * 0.2,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content Card */}
                  <div className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="glass-card-strong p-8 inline-block max-w-lg"
                    >
                      {/* Step Number */}
                      <div className={`flex items-center gap-4 mb-4 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                        <div className={`w-12 h-12 rounded-xl bg-${step.color}/20 flex items-center justify-center`}>
                          <step.icon className={`w-6 h-6 text-${step.color}`} />
                        </div>
                        <span className="font-orbitron text-4xl font-bold text-white/20">
                          0{step.id}
                        </span>
                      </div>

                      <h3 className="font-orbitron text-2xl font-bold text-white mb-3">
                        {step.title}
                      </h3>
                      
                      <p className="text-white/60 mb-4 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Time Badge */}
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-${step.color}/10 border border-${step.color}/30`}>
                        <div className={`w-1.5 h-1.5 rounded-full bg-${step.color} animate-pulse`} />
                        <span className={`text-xs text-${step.color} font-orbitron`}>
                          {step.time}
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Center Node */}
                  <div className="relative hidden md:flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ delay: 0.5 + index * 0.2, type: 'spring' }}
                      className="relative"
                    >
                      {/* Outer Ring */}
                      <div className={`absolute inset-0 w-16 h-16 rounded-full border-2 border-${step.color}/30 animate-ping`} />
                      
                      {/* Main Node */}
                      <div className={`w-16 h-16 rounded-full bg-${step.color} flex items-center justify-center relative z-10`}
                        style={{
                          boxShadow: `0 0 30px rgba(var(--${step.color}-rgb), 0.5)`,
                        }}
                      >
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      {/* Inner Glow */}
                      <div className={`absolute inset-2 rounded-full bg-${step.color}/50 blur-md`} />
                    </motion.div>
                  </div>

                  {/* Empty Space for Layout */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '4', label: 'Process Steps' },
            { value: '< 5 min', label: 'Avg. Response' },
            { value: '100%', label: 'Tracked' },
            { value: '24/7', label: 'Available' },
          ].map((stat, index) => (
            <div key={index} className="glass-card p-6 text-center">
              <p className="font-orbitron text-3xl text-shield-cyan mb-1">{stat.value}</p>
              <p className="text-sm text-white/50">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-shield-purple/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-shield-cyan/5 rounded-full blur-3xl" />
    </section>
  );
}
