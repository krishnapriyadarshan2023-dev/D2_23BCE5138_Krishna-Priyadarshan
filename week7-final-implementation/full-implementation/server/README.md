# S.H.I.E.L.D Backend API

Backend server for the S.H.I.E.L.D emergency response system.

## Setup

1. **Install MongoDB**
   - Download from https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - Copy `.env` and update `MONGODB_URI` if needed
   - Change `JWT_SECRET` to a secure random string

4. **Start Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Incidents
- `POST /api/incidents` - Create incident (protected)
- `GET /api/incidents` - Get all incidents (protected)
- `GET /api/incidents/nearby?lng=X&lat=Y&radius=5000` - Get nearby incidents
- `GET /api/incidents/hotspots` - Get hotspot areas (admin only)
- `GET /api/incidents/:id` - Get incident by ID
- `PATCH /api/incidents/:id/status` - Update incident status (admin only)

### Health Check
- `GET /api/health` - Server health status

## Database Models

### User
- name, email, password (hashed)
- role: 'citizen' | 'admin'
- trustScore: 0-100

### Incident
- reporterId (ref to User)
- category: theft, harassment, fire, medical, accident, violence, suspicious, other
- description
- location: GeoJSON Point (lng, lat)
- severity: 0-100
- status: pending, verified, dispatched, resolved
- mediaUrls: array of strings
- timestamps

## GeoJSON Support

MongoDB's 2dsphere index enables geospatial queries:
- Find incidents within radius
- Detect hotspots by clustering
- Calculate distances between points
