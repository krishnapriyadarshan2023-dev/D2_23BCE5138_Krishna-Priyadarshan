require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const incidentRoutes = require('./routes/incidentRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'S.H.I.E.L.D API is running',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint to view incidents with media
app.get('/api/debug/incidents', async (req, res) => {
  try {
    const Incident = require('./models/Incident');
    const incidents = await Incident.find()
      .populate('reporterId', 'name email')
      .sort('-createdAt')
      .limit(10);
    
    const summary = incidents.map(inc => ({
      id: inc._id,
      category: inc.category,
      description: inc.description.substring(0, 50) + '...',
      severity: inc.severity,
      status: inc.status,
      mediaCount: inc.mediaUrls?.length || 0,
      hasPhotos: inc.mediaUrls?.some(url => url.startsWith('data:image')) || false,
      hasAudio: inc.mediaUrls?.some(url => url.startsWith('data:audio')) || false,
      createdAt: inc.createdAt
    }));
    
    res.status(200).json({ 
      status: 'success',
      count: incidents.length,
      incidents: summary,
      fullData: incidents
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error',
    message: err.message || 'Something went wrong!' 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 S.H.I.E.L.D Server running on port ${PORT}`);
  console.log(`📊 Debug endpoint: http://localhost:${PORT}/api/debug/incidents`);
});
