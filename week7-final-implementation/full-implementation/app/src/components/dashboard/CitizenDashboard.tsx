import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  useMap,
  Circle
} from 'react-leaflet';
import L from 'leaflet';
import { 
  Plus, 
  X, 
  Camera, 
  Mic, 
  MapPin, 
  AlertTriangle,
  Send,
  ChevronRight,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import type { Incident, IncidentCategory, Route } from '@/types';
import { incidentAPI } from '@/lib/api';

// Fix Leaflet default icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom marker icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background-color: ${color};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 10px ${color};
        animation: pulse 2s infinite;
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Location marker component
function LocationMarker({ onLocationFound }: { onLocationFound: (pos: [number, number]) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on('locationfound', (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
      onLocationFound([e.latlng.lat, e.latlng.lng]);
    });
  }, [map, onLocationFound]);

  return position === null ? null : (
    <Marker 
      position={position}
      icon={createCustomIcon('#00D4FF')}
    >
      <Popup>You are here</Popup>
    </Marker>
  );
}

interface CitizenDashboardProps {
  onNavigate: (route: Route) => void;
}

const incidentCategories: { value: IncidentCategory; label: string; icon: string; color: string }[] = [
  { value: 'theft', label: 'Theft/Robbery', icon: '🦹', color: '#FF3B30' },
  { value: 'harassment', label: 'Harassment', icon: '😰', color: '#FF9500' },
  { value: 'fire', label: 'Fire', icon: '🔥', color: '#FF3B30' },
  { value: 'medical', label: 'Medical Emergency', icon: '🏥', color: '#FF3B30' },
  { value: 'accident', label: 'Accident', icon: '💥', color: '#FF9500' },
  { value: 'violence', label: 'Violence', icon: '⚠️', color: '#FF3B30' },
  { value: 'suspicious', label: 'Suspicious Activity', icon: '👁️', color: '#FF9500' },
  { value: 'other', label: 'Other', icon: '📋', color: '#7B61FF' },
];

export default function CitizenDashboard({ onNavigate: _onNavigate }: CitizenDashboardProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isReporting, setIsReporting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategory | null>(null);
  const [description, setDescription] = useState('');
  const [reportStep, setReportStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // Fetch incidents on mount
  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      setIsLoading(true);
      const response = await incidentAPI.getAll({ limit: 100 });
      
      // Transform API response to match Incident type
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

  const handleLocationFound = (pos: [number, number]) => {
    setUserLocation(pos);
  };

  const handleStartReport = () => {
    setIsReporting(true);
    setReportStep(1);
    setSelectedCategory(null);
    setDescription('');
    setUploadedPhotos([]);
    setAudioBlob(null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert('Photo size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhotos(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      alert('Microphone access denied. Please enable microphone permissions.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReport = async () => {
    if (!selectedCategory || !description || !userLocation) return;

    setIsSubmitting(true);
    
    try {
      // Prepare media URLs (photos + audio)
      const mediaUrls = [...uploadedPhotos];
      
      if (audioBlob) {
        const reader = new FileReader();
        const audioDataUrl = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(audioBlob);
        });
        mediaUrls.push(audioDataUrl);
      }

      // Call real API
      await incidentAPI.create({
        category: selectedCategory,
        description,
        location: {
          lat: userLocation[0],
          lng: userLocation[1]
        },
        mediaUrls
      });
      
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Refresh incidents list
      await fetchIncidents();
      
      setTimeout(() => {
        setShowSuccess(false);
        setIsReporting(false);
        setSelectedCategory(null);
        setDescription('');
        setUploadedPhotos([]);
        setAudioBlob(null);
        setReportStep(1);
      }, 3000);
    } catch (error) {
      console.error('Failed to submit incident:', error);
      setIsSubmitting(false);
      alert('Failed to submit incident. Please try again.');
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 70) return '#FF3B30';
    if (severity >= 40) return '#FF9500';
    return '#34C759';
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="font-orbitron text-3xl font-bold text-white mb-2">
            Citizen Dashboard
          </h1>
          <p className="text-white/60">
            Report incidents and track emergency responses in your area
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass-card-strong overflow-hidden" style={{ height: '600px' }}>
              {/* Map Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-shield-purple" />
                  <span className="text-sm text-white">Live Incident Map</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-shield-red" />
                    <span className="text-white/50">High</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-shield-amber" />
                    <span className="text-white/50">Medium</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-shield-teal" />
                    <span className="text-white/50">Low</span>
                  </div>
                </div>
              </div>

              {/* Leaflet Map */}
              <MapContainer
                center={[40.7128, -74.006]}
                zoom={14}
                style={{ height: 'calc(100% - 50px)', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                
                <LocationMarker onLocationFound={handleLocationFound} />
                
                {/* Incident Markers */}
                {incidents.map((incident) => (
                  <Marker
                    key={incident.id}
                    position={[incident.location.lat, incident.location.lng]}
                    icon={createCustomIcon(getSeverityColor(incident.severity))}
                  >
                    <Popup>
                      <div className="p-2">
                        <p className="font-semibold text-shield-dark">{incident.category}</p>
                        <p className="text-sm text-shield-dark/70">{incident.description}</p>
                        <p className="text-xs text-shield-purple mt-1">
                          Severity: {incident.severity}%
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Heatmap Circles */}
                <Circle
                  center={[40.715, -74.008]}
                  radius={500}
                  pathOptions={{ fillColor: '#FF3B30', fillOpacity: 0.2, color: '#FF3B30', weight: 1 }}
                />
              </MapContainer>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="glass-card-strong p-6">
              <h3 className="font-orbitron text-lg text-white mb-4">Quick Actions</h3>
              <motion.button
                onClick={handleStartReport}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-shield-red to-shield-amber text-white font-semibold flex items-center justify-center gap-3"
              >
                <Plus className="w-6 h-6" />
                <span>Report Incident</span>
              </motion.button>
            </div>

            {/* Nearby Incidents */}
            <div className="glass-card-strong p-6">
              <h3 className="font-orbitron text-lg text-white mb-4">Nearby Incidents</h3>
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="w-8 h-8 border-2 border-shield-purple/30 border-t-shield-purple rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-white/50 mt-2">Loading incidents...</p>
                </div>
              ) : incidents.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-white/50">No incidents reported yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {incidents.map((incident, index) => (
                  <motion.div
                    key={incident.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: getSeverityColor(incident.severity) }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium capitalize">
                          {incident.category}
                        </p>
                        <p className="text-xs text-white/50 truncate">
                          {incident.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ 
                              backgroundColor: `${getSeverityColor(incident.severity)}20`,
                              color: getSeverityColor(incident.severity)
                            }}
                          >
                            {incident.severity}% severity
                          </span>
                          <span className="text-xs text-white/30">
                            {incident.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                </div>
              )}
            </div>

            {/* Safety Tips */}
            <div className="glass-card-strong p-6">
              <h3 className="font-orbitron text-lg text-white mb-4">Safety Tips</h3>
              <div className="space-y-3">
                {[
                  'Stay aware of your surroundings',
                  'Keep emergency numbers handy',
                  'Report suspicious activity immediately',
                ].map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-shield-teal mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/70">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Report Incident Modal */}
      <AnimatePresence>
        {isReporting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="w-full max-w-lg glass-card-strong overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-shield-red/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-shield-red" />
                  </div>
                  <div>
                    <h3 className="font-orbitron text-lg text-white">Report Incident</h3>
                    <p className="text-xs text-white/50">Step {reportStep} of 3</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsReporting(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {showSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 rounded-full bg-shield-teal/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-10 h-10 text-shield-teal" />
                    </div>
                    <h4 className="font-orbitron text-xl text-white mb-2">
                      Report Submitted!
                    </h4>
                    <p className="text-white/60">
                      Your incident has been reported. Emergency responders have been notified.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Step 1: Category Selection */}
                    {reportStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <p className="text-white/70 mb-4">Select incident type:</p>
                        <div className="grid grid-cols-2 gap-3">
                          {incidentCategories.map((cat) => (
                            <motion.button
                              key={cat.value}
                              onClick={() => {
                                setSelectedCategory(cat.value);
                                setReportStep(2);
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-4 rounded-lg border transition-all text-left ${
                                selectedCategory === cat.value
                                  ? 'border-shield-purple bg-shield-purple/20'
                                  : 'border-white/10 bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <span className="text-2xl mb-2 block">{cat.icon}</span>
                              <span className="text-sm text-white">{cat.label}</span>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Description */}
                    {reportStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <p className="text-white/70 mb-4">Describe the incident:</p>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="What happened? Provide details..."
                          className="w-full h-32 p-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-shield-purple resize-none"
                        />
                        
                        {/* Media Attachments */}
                        <div className="space-y-3 mt-4">
                          <div className="flex gap-3">
                            <input
                              type="file"
                              id="photo-upload"
                              accept="image/*"
                              multiple
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                            <motion.label
                              htmlFor="photo-upload"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-colors cursor-pointer"
                            >
                              <Camera className="w-4 h-4" />
                              <span className="text-sm">Add Photo</span>
                            </motion.label>
                            
                            <motion.button
                              type="button"
                              onClick={isRecording ? handleStopRecording : handleStartRecording}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                                isRecording 
                                  ? 'bg-shield-red/20 border-shield-red text-shield-red animate-pulse' 
                                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                              }`}
                            >
                              <Mic className="w-4 h-4" />
                              <span className="text-sm">
                                {isRecording ? 'Stop Recording' : 'Voice Note'}
                              </span>
                            </motion.button>
                          </div>

                          {/* Uploaded Photos Preview */}
                          {uploadedPhotos.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {uploadedPhotos.map((photo, index) => (
                                <div key={index} className="relative group">
                                  <img 
                                    src={photo} 
                                    alt={`Upload ${index + 1}`}
                                    className="w-16 h-16 object-cover rounded-lg border border-white/10"
                                  />
                                  <button
                                    onClick={() => removePhoto(index)}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-shield-red rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-3 h-3 text-white" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Audio Recording Indicator */}
                          {audioBlob && (
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-shield-teal/10 border border-shield-teal/30">
                              <Mic className="w-4 h-4 text-shield-teal" />
                              <span className="text-sm text-shield-teal">Voice note recorded</span>
                              <button
                                onClick={() => setAudioBlob(null)}
                                className="ml-auto text-white/50 hover:text-white"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between mt-6">
                          <button
                            onClick={() => setReportStep(1)}
                            className="px-4 py-2 text-white/60 hover:text-white transition-colors"
                          >
                            Back
                          </button>
                          <motion.button
                            onClick={() => setReportStep(3)}
                            disabled={!description.trim()}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-2 rounded-lg bg-shield-purple text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Review & Submit */}
                    {reportStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <p className="text-white/70 mb-4">Review your report:</p>
                        
                        <div className="space-y-4">
                          <div className="p-4 rounded-lg bg-white/5">
                            <p className="text-xs text-white/50 mb-1">Incident Type</p>
                            <p className="text-white capitalize">
                              {incidentCategories.find(c => c.value === selectedCategory)?.label}
                            </p>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-white/5">
                            <p className="text-xs text-white/50 mb-1">Description</p>
                            <p className="text-white">{description}</p>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-white/5">
                            <p className="text-xs text-white/50 mb-1">Location</p>
                            <div className="flex items-center gap-2">
                              <Navigation className="w-4 h-4 text-shield-cyan" />
                              <p className="text-white text-sm">
                                {userLocation ? 'Current location captured' : 'Locating...'}
                              </p>
                            </div>
                          </div>

                          {/* Media Attachments Summary */}
                          {(uploadedPhotos.length > 0 || audioBlob) && (
                            <div className="p-4 rounded-lg bg-white/5">
                              <p className="text-xs text-white/50 mb-2">Attachments</p>
                              <div className="flex flex-wrap gap-2">
                                {uploadedPhotos.length > 0 && (
                                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-shield-purple/20 text-shield-purple text-xs">
                                    <Camera className="w-3 h-3" />
                                    <span>{uploadedPhotos.length} photo{uploadedPhotos.length > 1 ? 's' : ''}</span>
                                  </div>
                                )}
                                {audioBlob && (
                                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-shield-teal/20 text-shield-teal text-xs">
                                    <Mic className="w-3 h-3" />
                                    <span>Voice note</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between mt-6">
                          <button
                            onClick={() => setReportStep(2)}
                            className="px-4 py-2 text-white/60 hover:text-white transition-colors"
                          >
                            Back
                          </button>
                          <motion.button
                            onClick={handleSubmitReport}
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-2 rounded-lg bg-gradient-to-r from-shield-red to-shield-amber text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Submitting...</span>
                              </>
                            ) : (
                              <>
                                <span>Submit Report</span>
                                <Send className="w-4 h-4" />
                              </>
                            )}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              {/* Progress Indicator */}
              {!showSuccess && (
                <div className="flex gap-2 px-6 pb-6">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        step <= reportStep ? 'bg-shield-purple' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
