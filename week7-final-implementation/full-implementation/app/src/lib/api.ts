const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  const user = localStorage.getItem('shield_user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.token;
  }
  return null;
};

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string, role?: string) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  },

  login: async (email: string, password: string) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getMe: async () => {
    return apiCall('/auth/me');
  },
};

// Incident API
export const incidentAPI = {
  create: async (incidentData: {
    category: string;
    description: string;
    location: { lat: number; lng: number; address?: string };
    mediaUrls?: string[];
  }) => {
    return apiCall('/incidents', {
      method: 'POST',
      body: JSON.stringify(incidentData),
    });
  },

  getAll: async (filters?: { status?: string; category?: string; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiCall(`/incidents${query}`);
  },

  getById: async (id: string) => {
    return apiCall(`/incidents/${id}`);
  },

  getNearby: async (lng: number, lat: number, radius: number = 5000) => {
    return apiCall(`/incidents/nearby?lng=${lng}&lat=${lat}&radius=${radius}`);
  },

  getHotspots: async () => {
    return apiCall('/incidents/hotspots');
  },

  updateStatus: async (id: string, status: string) => {
    return apiCall(`/incidents/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// Health check
export const healthCheck = async () => {
  return apiCall('/health');
};
