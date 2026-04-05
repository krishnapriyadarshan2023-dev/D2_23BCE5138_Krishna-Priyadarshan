import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  BarChart3, 
  MapPin, 
  AlertTriangle, 
  Users,
  TrendingUp,
  Activity,
  Clock,
  Shield
} from 'lucide-react';

const stats = [
  { label: 'Active Incidents', value: '24', icon: AlertTriangle, color: 'text-shield-red', change: '+3' },
  { label: 'Response Time', value: '2.4m', icon: Clock, color: 'text-shield-cyan', change: '-12%' },
  { label: 'Hotspots', value: '7', icon: MapPin, color: 'text-shield-amber', change: '+2' },
  { label: 'AI Accuracy', value: '96%', icon: Activity, color: 'text-shield-teal', change: '+4%' },
];

const recentIncidents = [
  { id: 'INC-2024-001', type: 'Theft', location: 'Downtown', severity: 'High', time: '2 min ago' },
  { id: 'INC-2024-002', type: 'Medical', location: 'Central Park', severity: 'Critical', time: '5 min ago' },
  { id: 'INC-2024-003', type: 'Fire', location: 'Industrial Zone', severity: 'High', time: '8 min ago' },
  { id: 'INC-2024-004', type: 'Suspicious', location: 'Residential', severity: 'Low', time: '12 min ago' },
];

export default function DashboardPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [45, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      ref={containerRef}
      className="relative py-32 overflow-hidden"
      id="dashboard"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-shield-dark via-shield-navy/30 to-shield-dark" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <BarChart3 className="w-4 h-4 text-shield-cyan" />
            <span className="text-sm text-white/80">Command Center</span>
          </motion.div>

          <h2 className="font-orbitron text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Unified <span className="text-gradient">Dashboard</span>
          </h2>
          
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Real-time monitoring, analytics, and dispatch management 
            in one powerful interface.
          </p>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative perspective-1000"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            style={{ rotateX, scale, opacity }}
            className="relative"
          >
            {/* Dashboard Frame */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-shield-navy/80 backdrop-blur-xl">
              {/* Scan Line Effect */}
              {isHovered && <div className="scan-line" />}

              {/* Dashboard Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-shield-dark/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-shield-purple to-shield-blue flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-orbitron text-lg font-bold text-white">S.H.I.E.L.D</h3>
                    <p className="text-xs text-white/50">Command Center v2.0</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-shield-teal/20 border border-shield-teal/30">
                    <div className="w-2 h-2 rounded-full bg-shield-teal animate-pulse" />
                    <span className="text-xs text-shield-teal">System Online</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-shield-purple/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-shield-purple" />
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="glass-card p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        <span className={`text-xs ${stat.change.startsWith('+') ? 'text-shield-teal' : 'text-shield-red'}`}>
                          {stat.change}
                        </span>
                      </div>
                      <p className="font-orbitron text-2xl text-white">{stat.value}</p>
                      <p className="text-xs text-white/50">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Chart Area */}
                  <div className="md:col-span-2 glass-card p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-orbitron text-sm text-white">Incident Trends</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/50">Last 24h</span>
                        <TrendingUp className="w-4 h-4 text-shield-teal" />
                      </div>
                    </div>
                    
                    {/* Simulated Chart */}
                    <div className="h-40 flex items-end gap-2">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((height, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={isInView ? { height: `${height}%` } : {}}
                          transition={{ delay: 0.8 + i * 0.05, duration: 0.5 }}
                          className="flex-1 rounded-t-sm bg-gradient-to-t from-shield-purple/50 to-shield-cyan/50"
                        />
                      ))}
                    </div>
                    
                    {/* X Axis Labels */}
                    <div className="flex justify-between mt-2 text-xs text-white/30">
                      <span>00:00</span>
                      <span>06:00</span>
                      <span>12:00</span>
                      <span>18:00</span>
                      <span>23:59</span>
                    </div>
                  </div>

                  {/* Recent Incidents */}
                  <div className="glass-card p-4">
                    <h4 className="font-orbitron text-sm text-white mb-4">Recent Incidents</h4>
                    <div className="space-y-3">
                      {recentIncidents.map((incident, index) => (
                        <motion.div
                          key={incident.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 1 + index * 0.1 }}
                          className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <div className={`w-2 h-2 rounded-full ${
                            incident.severity === 'Critical' ? 'bg-shield-red animate-pulse' :
                            incident.severity === 'High' ? 'bg-shield-amber' :
                            'bg-shield-teal'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white font-medium truncate">{incident.id}</p>
                            <p className="text-xs text-white/50">{incident.type} • {incident.location}</p>
                          </div>
                          <span className="text-xs text-white/30">{incident.time}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Map Preview */}
                <div className="mt-6 glass-card p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-orbitron text-sm text-white">Live Map</h4>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-shield-red" />
                      <span className="text-xs text-white/50">24 Active Markers</span>
                    </div>
                  </div>
                  
                  {/* Simulated Map */}
                  <div className="h-32 rounded-lg bg-shield-dark relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
                    
                    {/* Map Markers */}
                    {[
                      { x: 20, y: 30, color: 'bg-shield-red' },
                      { x: 45, y: 50, color: 'bg-shield-amber' },
                      { x: 70, y: 25, color: 'bg-shield-red' },
                      { x: 35, y: 70, color: 'bg-shield-teal' },
                      { x: 80, y: 60, color: 'bg-shield-amber' },
                      { x: 55, y: 40, color: 'bg-shield-red' },
                    ].map((marker, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-3 h-3 rounded-full ${marker.color}`}
                        style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      >
                        <div className={`absolute inset-0 rounded-full ${marker.color} animate-ping opacity-50`} />
                      </motion.div>
                    ))}
                    
                    {/* Heatmap Overlay */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-shield-red/20 rounded-full blur-2xl" />
                    <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-shield-amber/20 rounded-full blur-2xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Reflection Effect */}
            <div className="absolute -bottom-20 left-0 right-0 h-20 bg-gradient-to-b from-shield-navy/20 to-transparent transform scale-y-[-1] blur-sm opacity-50" />
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-shield-purple to-shield-blue text-white font-semibold inline-flex items-center gap-3"
          >
            <span>Explore Dashboard</span>
            <TrendingUp className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-shield-purple/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-shield-cyan/5 rounded-full blur-3xl -translate-y-1/2" />
    </section>
  );
}
