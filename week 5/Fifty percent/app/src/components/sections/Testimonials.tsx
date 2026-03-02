import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Chief Michael Rodriguez',
    role: 'Police Chief',
    organization: 'Metropolitan Police Department',
    content: 'S.H.I.E.L.D has revolutionized how we respond to incidents. The AI classification saves us critical minutes in emergency situations, and the real-time tracking has improved our response efficiency by 40%.',
    avatar: 'MR',
    rating: 5,
  },
  {
    id: 2,
    name: 'Captain Sarah Chen',
    role: 'Fire Chief',
    organization: 'City Fire Department',
    content: 'The severity analysis engine is incredibly accurate. It helps us prioritize resources effectively during multi-incident scenarios. This system has become an essential part of our emergency response protocol.',
    avatar: 'SC',
    rating: 5,
  },
  {
    id: 3,
    name: 'Dr. James Wilson',
    role: 'EMS Director',
    organization: 'Emergency Medical Services',
    content: 'Real-time tracking and hotspot detection are game-changers for medical emergencies. We can now pre-position ambulances based on predicted incident patterns, saving countless lives.',
    avatar: 'JW',
    rating: 5,
  },
  {
    id: 4,
    name: 'Lt. Emily Thompson',
    role: 'Dispatch Supervisor',
    organization: '911 Emergency Center',
    content: 'The unified dashboard gives us complete situational awareness. We can monitor multiple incidents simultaneously and coordinate responses across different agencies seamlessly.',
    avatar: 'ET',
    rating: 5,
  },
];

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section
      ref={containerRef}
      className="relative py-32 overflow-hidden"
      id="testimonials"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-shield-purple/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
          >
            <Star className="w-4 h-4 text-shield-amber" />
            <span className="text-sm text-white/80">Testimonials</span>
          </motion.div>

          <h2 className="font-orbitron text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Trusted by{' '}
            <span className="text-gradient">Emergency Responders</span>
          </h2>
          
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            See how S.H.I.E.L.D is transforming emergency response 
            operations worldwide.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative"
        >
          {/* Main Testimonial Card */}
          <div className="relative h-[400px] perspective-1000">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, rotateY: -30, x: -100 }}
                animate={{ opacity: 1, rotateY: 0, x: 0 }}
                exit={{ opacity: 0, rotateY: 30, x: 100 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <div className="h-full glass-card-strong p-8 md:p-12 flex flex-col justify-between">
                  {/* Quote Icon */}
                  <Quote className="w-12 h-12 text-shield-purple/30" />

                  {/* Content */}
                  <div className="flex-1 flex items-center">
                    <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                      "{testimonials[currentIndex].content}"
                    </p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-shield-purple to-shield-blue flex items-center justify-center">
                        <span className="font-orbitron text-lg text-white">
                          {testimonials[currentIndex].avatar}
                        </span>
                      </div>
                      
                      {/* Info */}
                      <div>
                        <h4 className="font-orbitron text-lg text-white">
                          {testimonials[currentIndex].name}
                        </h4>
                        <p className="text-sm text-white/50">
                          {testimonials[currentIndex].role}
                        </p>
                        <p className="text-xs text-white/30">
                          {testimonials[currentIndex].organization}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-shield-amber fill-shield-amber" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              onClick={prevTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </motion.button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-shield-purple w-8'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <motion.button
              onClick={nextTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '500+', label: 'Agencies' },
            { value: '50K+', label: 'Responders' },
            { value: '1M+', label: 'Incidents' },
            { value: '99%', label: 'Satisfaction' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="font-orbitron text-3xl md:text-4xl text-shield-cyan mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-white/50">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-shield-purple/30 to-transparent" />
    </section>
  );
}
