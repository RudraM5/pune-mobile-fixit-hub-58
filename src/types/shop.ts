
export interface Shop {
  id: string;
  name: string;
  owner_name: string;
  phone: string;
  email?: string;
  address: string;
  area: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  rating: number;
  total_repairs: number;
  created_at: string;
  updated_at: string;
}

export interface EnhancedTechnician {
  id: string;
  user_id?: string;
  name: string;
  phone: string;
  email?: string;
  shop_id: string;
  shop?: Shop;
  specialization: string[];
  expertise_level: 'beginner' | 'intermediate' | 'expert' | 'master';
  years_experience: number;
  rating: number;
  completed_repairs: number;
  availability_status: 'available' | 'busy' | 'offline';
  hourly_rate?: number;
  area: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  expertise?: TechnicianExpertise[];
}

export interface TechnicianExpertise {
  id: string;
  technician_id: string;
  service_category: string;
  expertise_level: 'beginner' | 'intermediate' | 'expert' | 'master';
  certifications?: string[];
  created_at: string;
}

export interface TechnicianSuggestion {
  technician: EnhancedTechnician;
  matchingServices: string[];
  distance?: number;
  estimatedPrice: number;
}
