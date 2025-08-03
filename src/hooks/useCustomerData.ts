
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

// Mock data for development - different data for admin and customer
const customerMockRepairs: CustomerRepairRequest[] = [
  {
    id: '2',
    device: {
      brand: 'Samsung',
      model: 'Galaxy S21',
      category: 'smartphone'
    },
    description: 'Battery replacement',
    status: 'completed',
    priority: 'medium',
    created_at: '2024-12-10T09:00:00Z',
    actual_completion: '2024-12-12T15:30:00Z',
    technician: {
      name: 'Amit Kumar',
      phone: '+91 9876543211'
    },
    services: [
      {
        name: 'Battery Replacement',
        price: 3500,
        quantity: 1
      }
    ],
    total_amount: 3500,
    invoice: {
      invoice_number: 'INV-2024-001',
      status: 'paid',
      due_date: '2024-12-15T00:00:00Z',
      paid_at: '2024-12-12T16:00:00Z'
    },
    status_updates: [
      {
        id: '3',
        new_status: 'pending',
        message: 'Repair request received',
        created_at: '2024-12-10T09:00:00Z'
      },
      {
        id: '4',
        old_status: 'pending',
        new_status: 'completed',
        message: 'Battery replaced successfully',
        created_at: '2024-12-12T15:30:00Z'
      }
    ]
  }
];

const customerMockStats: CustomerStats = {
  totalRepairs: 1,
  activeRepairs: 0,
  completedRepairs: 1,
  totalSpent: 3500
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
