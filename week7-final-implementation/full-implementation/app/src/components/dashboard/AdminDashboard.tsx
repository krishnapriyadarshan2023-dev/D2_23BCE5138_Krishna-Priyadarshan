import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup,
  Circle
} from 'react-leaflet';
import L from 'leaflet';
import { 
  AlertTriangle, 
  MapPin, 
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  Filter,
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Send,
  BarChart3,
  Shield,
  Bell
} from 'lucide-react';
import type { Incident, Route } from '@/types';
import { incidentAPI } from '@/lib/api';

// Custom marker icon
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background-color: ${color};
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 8px ${color};
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

interface AdminDashboardProps {
  onNavigate: (route: Route) => void;
}

const getSeverityColor = (severity: number) => {
  if (severity >= 70) return '#FF3B30';
  if (severity >= 40) return '#FF9500';
  return '#34C759';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-shield-amber';
    case 'verified': return 'bg-shield-cyan';
    case 'dispatched': return 'bg-shield-purple';
    case 'resolved': return 'bg-shield-teal';
    default: return 'bg-white/20';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'Pending';
    case 'verified': return 'Verified';
    case 'dispatched': return 'Dispatched';
    case 'resolved': return 'Resolved';
    default: return status;
  }
};

export default function AdminDashboard({ onNavigate: _onNavigate }: AdminDashboardProps) {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      setIsLoading(true);
      const response = await incidentAPI.getAll({ limit: 100 });
      
      const transformedIncidents = response.incidents.map((inc: any) => ({
        id: inc._id,
        reporterId: inc.reporterId._id || inc.reporterId,
        category: inc.category,
        description: inc.description,
        location: {
          lat: inc.location.coordinates[1],
          lng: inc.location.coordinates[0],
          address: inc.location.address
        },
        severity: inc.severity,
        status: inc.status,
        mediaUrls: inc.mediaUrls,
        aiClassification: inc.aiClassification,
        createdAt: new Date(inc.createdAt),
        updatedAt: new Date(inc.updatedAt)
      }));
      
      setIncidents(transformedIncidents);
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (incidentId: string, newStatus: string) => {
    try {
      await incidentAPI.updateStatus(incidentId, newStatus);
      await fetchIncidents();
      setSelectedIncident(null);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update incident status');
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus;
    const matchesSearch = incident.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         incident.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate stats from real data
  const activeIncidents = incidents.filter(i => i.status !== 'resolved').length;
  const stats = [
    { 
      label: 'Active Incidents', 
      value: activeIncidents.toString(), 
      change: '+' + Math.floor(activeIncidents * 0.1), 
      trend: 'up' as const,
      icon: AlertTriangle, 
      color: 'text-shield-red',
      bgColor: 'bg-shield-red/10'
    },
    { 
      label: 'Total Incidents', 
      value: incidents.length.toString(), 
      change: '+' + Math.floor(incidents.length * 0.05), 
      trend: 'up' as const,
      icon: Clock, 
      color: 'text-shield-cyan',
      bgColor: 'bg-shield-cyan/10'
    },
    { 
      label: 'Pending', 
      value: incidents.filter(i => i.status === 'pending').length.toString(), 
      change: '+2', 
      trend: 'up' as const,
      icon: MapPin, 
      color: 'text-shield-amber',
      bgColor: 'bg-shield-amber/10'
    },
    { 
      label: 'Resolved', 
      value: incidents.filter(i => i.status === 'resolved').length.toString(), 
      change: '+4%', 
      trend: 'up' as const,
      icon: Activity, 
      color: 'text-shield-teal',
      bgColor: 'bg-shield-teal/10'
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="font-orbitron text-3xl font-bold text-white mb-1">
              Command Center
            </h1>
            <p className="text-white/60">
              Real-time monitoring and emergency dispatch management
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass-card px-4 py-2 flex items-center gap-3">
              <Clock className="w-5 h-5 text-shield-cyan" />
              <span className="font-orbitron text-white">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-3 rounded-lg glass-card"
            >
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-shield-red text-white text-xs flex items-center justify-center">
                3
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="glass-card-strong p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs ${
                  stat.trend === 'up' ? 'text-shield-teal' : 'text-shield-red'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="font-orbitron text-2xl text-white mb-1">{stat.value}</p>
              <p className="text-xs text-white/50">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="glass-card-strong overflow-hidden" style={{ height: '500px' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-shield-purple" />
                  <span className="text-sm text-white">Live Incident Map</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/50">Heatmap</span>
                  <div className="w-8 h-4 rounded-full bg-shield-purple/30 relative">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-shield-purple" />
                  </div>
                </div>
              </div>

              <MapContainer
                center={[40.7128, -74.006]}
                zoom={14}
                style={{ height: 'calc(100% - 50px)', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                
                {/* Incident Markers */}
                {incidents.map((incident) => (
                  <Marker
                    key={incident.id}
                    position={[incident.location.lat, incident.location.lng]}
                    icon={createCustomIcon(getSeverityColor(incident.severity))}
                    eventHandlers={{
                      click: () => setSelectedIncident(incident),
                    }}
                  >
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-shield-dark">{incident.id}</span>
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: getSeverityColor(incident.severity) }}
                          >
                            {incident.severity}%
                          </span>
                        </div>
                        <p className="text-sm text-shield-dark/70 capitalize mb-1">
                          {incident.category}
                        </p>
                        <p className="text-xs text-shield-dark/50">{incident.description}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Heatmap Circles */}
                <Circle
                  center={[40.715, -74.008]}
                  radius={400}
                  pathOptions={{ fillColor: '#FF3B30', fillOpacity: 0.3, color: '#FF3B30', weight: 1 }}
                />
                <Circle
                  center={[40.7128, -74.006]}
                  radius={300}
                  pathOptions={{ fillColor: '#FF9500', fillOpacity: 0.2, color: '#FF9500', weight: 1 }}
                />
              </MapContainer>
            </div>
          </motion.div>

          {/* Incident List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {/* Filters */}
            <div className="glass-card-strong p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search incidents..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-shield-purple"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-white/5 border border-white/10"
                >
                  <Filter className="w-4 h-4 text-white/60" />
                </motion.button>
              </div>

              {/* Status Filters */}
              <div className="flex gap-2 flex-wrap">
                {['all', 'pending', 'verified', 'dispatched', 'resolved'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-full text-xs capitalize transition-colors ${
                      filterStatus === status
                        ? 'bg-shield-purple text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Incident Items */}
            <div className="space-y-3 max-h-[350px] overflow-y-auto">
              {filteredIncidents.map((incident, index) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  onClick={() => setSelectedIncident(incident)}
                  className={`glass-card p-4 cursor-pointer transition-all hover:bg-white/10 ${
                    selectedIncident?.id === incident.id ? 'border-shield-purple' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: getSeverityColor(incident.severity) }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white font-medium">
                            {incident.id}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full text-white ${getStatusColor(incident.status)}`}>
                            {getStatusText(incident.status)}
                          </span>
                        </div>
                        <p className="text-xs text-white/50 capitalize mt-1">
                          {incident.category}
                        </p>
                        <p className="text-xs text-white/40 truncate max-w-[150px]">
                          {incident.description}
                        </p>
                      </div>
                    </div>
                    <button className="p-1 rounded hover:bg-white/10">
                      <MoreVertical className="w-4 h-4 text-white/40" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
        >
          {/* Incident Trends */}
          <div className="glass-card-strong p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-shield-cyan" />
                <h3 className="font-orbitron text-lg text-white">Incident Trends</h3>
              </div>
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-white/70">
                <option>Last 24h</option>
                <option>Last 7d</option>
                <option>Last 30d</option>
              </select>
            </div>
            
            <div className="h-48 flex items-end gap-2">
              {[35, 55, 40, 70, 45, 85, 60, 75, 50, 65, 45, 90].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 0.8 + i * 0.05, duration: 0.5 }}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-shield-purple/50 to-shield-cyan/50 hover:from-shield-purple hover:to-shield-cyan transition-colors cursor-pointer"
                />
              ))}
            </div>
            
            <div className="flex justify-between mt-4 text-xs text-white/30">
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
              <span>23:59</span>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="glass-card-strong p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-shield-purple" />
                <h3 className="font-orbitron text-lg text-white">Category Distribution</h3>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { category: 'Theft', count: 45, color: 'bg-shield-red' },
                { category: 'Medical', count: 32, color: 'bg-shield-amber' },
                { category: 'Fire', count: 18, color: 'bg-shield-orange' },
                { category: 'Suspicious', count: 28, color: 'bg-shield-cyan' },
                { category: 'Harassment', count: 15, color: 'bg-shield-purple' },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white/70">{item.category}</span>
                    <span className="text-sm text-white">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / 45) * 100}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                      className={`h-full rounded-full ${item.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Selected Incident Detail Panel */}
        {selectedIncident && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 glass-card-strong p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-orbitron text-xl text-white">{selectedIncident.id}</h3>
                  <span 
                    className={`text-xs px-3 py-1 rounded-full text-white ${getStatusColor(selectedIncident.status)}`}
                  >
                    {getStatusText(selectedIncident.status)}
                  </span>
                </div>
                <p className="text-white/60 capitalize text-lg">{selectedIncident.category}</p>
              </div>
              <div 
                className="px-4 py-2 rounded-lg text-white font-orbitron"
                style={{ backgroundColor: `${getSeverityColor(selectedIncident.severity)}30`, color: getSeverityColor(selectedIncident.severity) }}
              >
                Severity: {selectedIncident.severity}%
              </div>
            </div>
            
            <p className="text-white/70 mt-4">{selectedIncident.description}</p>
            
            <div className="flex items-center gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleUpdateStatus(selectedIncident.id, 'resolved')}
                className="px-6 py-3 rounded-lg bg-shield-teal text-white flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Mark Resolved</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleUpdateStatus(selectedIncident.id, 'dispatched')}
                className="px-6 py-3 rounded-lg bg-shield-purple text-white flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span>Dispatch Unit</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedIncident(null)}
                className="px-6 py-3 rounded-lg bg-white/10 text-white flex items-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                <span>Close</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
