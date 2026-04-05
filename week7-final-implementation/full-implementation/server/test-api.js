const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

let authToken = '';

const testAPI = async () => {
  console.log('🧪 Testing S.H.I.E.L.D API...\n');

  try {
    // 1. Health Check
    console.log('1️⃣ Health Check...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅', health.data.message);
    console.log('');

    // 2. Register User
    console.log('2️⃣ Registering new user...');
    const registerData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'citizen'
    };
    const registerRes = await axios.post(`${API_URL}/auth/register`, registerData);
    authToken = registerRes.data.token;
    console.log('✅ User registered:', registerRes.data.user.name);
    console.log('🔑 Token received');
    console.log('');

    // 3. Login
    console.log('3️⃣ Testing login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: registerData.email,
      password: registerData.password
    });
    console.log('✅ Login successful:', loginRes.data.user.email);
    console.log('');

    // 4. Get Current User
    console.log('4️⃣ Getting current user...');
    const meRes = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Current user:', meRes.data.user.name);
    console.log('   Trust Score:', meRes.data.user.trustScore);
    console.log('');

    // 5. Create Incident
    console.log('5️⃣ Creating incident...');
    const incidentData = {
      category: 'fire',
      description: 'Small fire in dumpster behind building',
      location: {
        lat: 40.7128,
        lng: -74.006,
        address: '123 Main St, New York, NY'
      }
    };
    const incidentRes = await axios.post(`${API_URL}/incidents`, incidentData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Incident created:', incidentRes.data.incident._id);
    console.log('   Category:', incidentRes.data.incident.category);
    console.log('   Severity:', incidentRes.data.incident.severity);
    console.log('   Status:', incidentRes.data.incident.status);
    console.log('');

    // 6. Get All Incidents
    console.log('6️⃣ Fetching all incidents...');
    const allIncidents = await axios.get(`${API_URL}/incidents`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Total incidents:', allIncidents.data.results);
    console.log('');

    // 7. Get Nearby Incidents
    console.log('7️⃣ Finding nearby incidents...');
    const nearbyRes = await axios.get(
      `${API_URL}/incidents/nearby?lng=-74.006&lat=40.7128&radius=10000`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('✅ Nearby incidents:', nearbyRes.data.results);
    console.log('');

    console.log('🎉 All tests passed! Backend is working perfectly!\n');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    console.error('');
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running: npm run dev');
    }
  }
};

testAPI();
