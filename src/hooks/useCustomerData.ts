
import { useState, useEffect } from 'react';
import { getUserRepairRequests } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

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

export const useCustomerData = () => {
  const { user } = useAuth();
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
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const repairRequests = await getUserRepairRequests(user.id);
        
        // Transform Supabase data to match frontend interface
        const transformedRepairs = repairRequests.map(request => ({
          id: request.id,
          device: {
            brand: request.device_brand,
            model: request.device_model,
            category: 'smartphone'
          },
          description: request.issue_description || 'No description provided',
          status: request.status as any,
          priority: request.priority as any,
          created_at: request.created_at,
          estimated_completion: request.estimated_completion,
          actual_completion: request.actual_completion,
          technician: request.assigned_technician ? {
            name: request.assigned_technician.name,
            phone: request.assigned_technician.phone
          } : undefined,
          services: request.repair_request_services?.map(rrs => ({
            name: rrs.service?.name || 'Unknown Service',
            price: rrs.unit_price,
            quantity: rrs.quantity
          })) || [],
          total_amount: request.total_amount,
          invoice: request.payment_status === 'paid' ? undefined : {
            invoice_number: `INV-${request.id.substring(0, 8)}`,
            status: request.payment_status as any,
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          status_updates: [{
            id: '1',
            new_status: request.status,
            message: `Repair request ${request.status}`,
            created_at: request.created_at
          }],
          notes: request.notes
        }));
        
        setRepairs(transformedRepairs);
        
        // Calculate stats
        const totalRepairs = transformedRepairs.length;
        const activeRepairs = transformedRepairs.filter(r => !['completed', 'cancelled'].includes(r.status)).length;
        const completedRepairs = transformedRepairs.filter(r => r.status === 'completed').length;
        const totalSpent = transformedRepairs.reduce((sum, r) => sum + r.total_amount, 0);
        
        setStats({
          totalRepairs,
          activeRepairs,
          completedRepairs,
          totalSpent
        });
        
        setError(null);
      } catch (err) {
        setError('Failed to load repair data');
        console.error('Error fetching customer data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const refetch = () => {
    if (user) {
      setLoading(true);
      // Trigger useEffect to refetch data
      const fetchData = async () => {
        try {
          const repairRequests = await getUserRepairRequests(user.id);
          // ... same transformation logic as above
        } catch (err) {
          setError('Failed to refresh data');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  };

  return {
    repairs,
    stats,
    loading,
    error,
    refetch
  };
};
