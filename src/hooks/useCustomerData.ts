
import { useState, useEffect } from 'react';

export interface CustomerStats {
  totalRepairs: number;
  activeRepairs: number;
  completedRepairs: number;
  totalSpent: number;
}

export interface CustomerRepairRequest {
  id: string;
  device: {
    brand: string;
    model: string;
    category: string;
  };
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  estimated_completion?: string;
  actual_completion?: string;
  technician?: {
    name: string;
    phone: string;
  };
  services: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  total_amount: number;
  invoice?: {
    invoice_number: string;
    status: 'pending' | 'paid';
    due_date: string;
    paid_at?: string;
  };
  status_updates: Array<{
    id: string;
    old_status?: string;
    new_status: string;
    message?: string;
    created_at: string;
  }>;
  notes?: string;
}

// Mock data for development - no data initially for clean dashboard
const customerMockRepairs: CustomerRepairRequest[] = [];

const customerMockStats: CustomerStats = {
  totalRepairs: 0,
  activeRepairs: 0,
  completedRepairs: 0,
  totalSpent: 0
};

export const useCustomerData = () => {
  const [repairs, setRepairs] = useState<CustomerRepairRequest[]>([]);
  const [stats, setStats] = useState<CustomerStats>({
    totalRepairs: 0,
    activeRepairs: 0,
    completedRepairs: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Only return customer repairs (no iPhone 13 Pro for regular users)
        setRepairs(customerMockRepairs);
        setStats(customerMockStats);
        setError(null);
      } catch (err) {
        setError('Failed to load customer data');
        console.error('Error fetching customer data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refetch = () => {
    setLoading(true);
    // Simulate refetch
    setTimeout(() => {
      setRepairs(customerMockRepairs);
      setStats(customerMockStats);
      setLoading(false);
    }, 500);
  };

  return {
    repairs,
    stats,
    loading,
    error,
    refetch
  };
};
