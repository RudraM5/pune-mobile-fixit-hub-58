
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

// Mock data for development
const mockRepairs: CustomerRepairRequest[] = [
  {
    id: '1',
    device: {
      brand: 'iPhone',
      model: '13 Pro',
      category: 'smartphone'
    },
    description: 'Screen replacement needed',
    status: 'in-progress',
    priority: 'high',
    created_at: '2024-12-15T10:00:00Z',
    estimated_completion: '2024-12-20T16:00:00Z',
    technician: {
      name: 'Raj Patel',
      phone: '+91 9876543210'
    },
    services: [
      {
        name: 'Screen Replacement',
        price: 8500,
        quantity: 1
      }
    ],
    total_amount: 8500,
    status_updates: [
      {
        id: '1',
        new_status: 'pending',
        message: 'Repair request received',
        created_at: '2024-12-15T10:00:00Z'
      },
      {
        id: '2',
        old_status: 'pending',
        new_status: 'in-progress',
        message: 'Technician assigned and work started',
        created_at: '2024-12-15T14:00:00Z'
      }
    ]
  },
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

const mockStats: CustomerStats = {
  totalRepairs: 5,
  activeRepairs: 1,
  completedRepairs: 4,
  totalSpent: 25000
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
        
        setRepairs(mockRepairs);
        setStats(mockStats);
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
      setRepairs(mockRepairs);
      setStats(mockStats);
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
