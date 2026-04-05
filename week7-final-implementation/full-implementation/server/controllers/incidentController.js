const Incident = require('../models/Incident');
const { analyzeIncidentText } = require('../services/aiService');

exports.createIncident = async (req, res) => {
  try {
    const { category, description, location, mediaUrls } = req.body;

    // Use AI to analyze the description if no category provided
    let finalCategory = category;
    let finalSeverity = 50;
    let aiClassification = null;

    if (!category || category === 'other') {
      // Let AI determine category and severity
      const aiAnalysis = await analyzeIncidentText(description);
      finalCategory = aiAnalysis.category;
      finalSeverity = aiAnalysis.severity;
      aiClassification = {
        category: aiAnalysis.category,
        confidence: aiAnalysis.confidence
      };
      console.log('🤖 AI Classification:', aiAnalysis);
    } else {
      // Use manual category with predefined severity
      const severityMap = {
        fire: 85,
        medical: 90,
        violence: 80,
        theft: 65,
        accident: 70,
        harassment: 60,
        suspicious: 45,
        other: 50
      };
      finalSeverity = severityMap[category] || 50;
    }

    const incident = await Incident.create({
      reporterId: req.user.id,
      category: finalCategory,
      description,
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat],
        address: location.address
      },
      severity: finalSeverity,
      mediaUrls: mediaUrls || [],
      aiClassification
    });

    // Populate reporter info
    await incident.populate('reporterId', 'name email trustScore');

    res.status(201).json({
      status: 'success',
      incident
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllIncidents = async (req, res) => {
  try {
    const { status, category, limit = 100 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const incidents = await Incident.find(filter)
      .populate('reporterId', 'name email trustScore')
      .sort('-createdAt')
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      results: incidents.length,
      incidents
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getIncidentById = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reporterId', 'name email trustScore');

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.status(200).json({
      status: 'success',
      incident
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateIncidentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('reporterId', 'name email trustScore');

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.status(200).json({
      status: 'success',
      incident
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getNearbyIncidents = async (req, res) => {
  try {
    const { lng, lat, radius = 5000 } = req.query; // radius in meters

    const incidents = await Incident.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    }).populate('reporterId', 'name email trustScore');

    res.status(200).json({
      status: 'success',
      results: incidents.length,
      incidents
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getHotspots = async (req, res) => {
  try {
    const hotspots = await Incident.aggregate([
      {
        $match: {
          status: { $in: ['pending', 'verified', 'dispatched'] },
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
        }
      },
      {
        $group: {
          _id: {
            $concat: [
              { $toString: { $round: [{ $arrayElemAt: ['$location.coordinates', 0] }, 2] } },
              ',',
              { $toString: { $round: [{ $arrayElemAt: ['$location.coordinates', 1] }, 2] } }
            ]
          },
          count: { $sum: 1 },
          avgSeverity: { $avg: '$severity' },
          location: { $first: '$location' },
          category: { $first: '$category' }
        }
      },
      {
        $match: { count: { $gte: 3 } } // At least 3 incidents to be a hotspot
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.status(200).json({
      status: 'success',
      results: hotspots.length,
      hotspots
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
