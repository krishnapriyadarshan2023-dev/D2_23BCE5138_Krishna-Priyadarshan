// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'citizen' | 'admin';
  trustScore: number;
  createdAt: Date;
}

// Incident Types
export interface Incident {
  id: string;
  reporterId: string;
  category: IncidentCategory;
  description: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  severity: number; // 0-100
  status: 'pending' | 'verified' | 'dispatched' | 'resolved';
  mediaUrls?: string[];
  aiClassification?: {
    category: IncidentCategory;
    confidence: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type IncidentCategory = 
  | 'theft'
  | 'harassment'
  | 'fire'
  | 'medical'
  | 'accident'
  | 'violence'
  | 'suspicious'
  | 'other';

// Alert Types
export interface Alert {
  id: string;
  incidentId: string;
  type: 'high' | 'medium' | 'low';
  message: string;
  recipients: string[];
  sentAt: Date;
  read: boolean;
}

// Hotspot Types
export interface Hotspot {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  radius: number; // in meters
  incidentCount: number;
  severity: number;
  category: IncidentCategory;
}

// Dashboard Stats
export interface DashboardStats {
  totalIncidents: number;
  activeIncidents: number;
  resolvedToday: number;
  averageResponseTime: number;
  hotspotsDetected: number;
  aiAccuracy: number;
}

// Feature Types
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
}

// Tech Stack Types
export interface TechItem {
  name: string;
  icon: string;
  color: string;
}

// Process Step Types
export interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  image: string;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  content: string;
  avatar: string;
}

// Navigation Types
export type Route = 
  | 'landing'
  | 'login'
  | 'register'
  | 'citizen-dashboard'
  | 'admin-dashboard'
  | 'report-incident';
