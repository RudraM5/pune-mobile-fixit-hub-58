import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CustomerRepairRequest {
  id: string;
  status: string;
  priority: string;
  description: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  estimated_completion: string | null;
  actual_completion: string | null;
  notes: string | null;
  device: {
    brand: string;
    model: string;
    category: string;
  };
  technician: {
    name: string;
    phone: string;
  } | null;
  services: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  status_updates: Array<{
    id: string;
    old_status: string | null;
    new_status: string;
    message: string | null;
    created_at: string;
  }>;
  invoice: {
    id: string;
    invoice_number: string;
    status: string;
    total_amount: number;
    due_date: string;
    paid_at: string | null;
  } | null;
}

export interface CustomerStats {
  totalRepairs: number;
  activeRepairs: number;
  completedRepairs: number;
  totalSpent: number;
  avgRating: number;
}

export function useCustomerData() {
  const { user } = useAuth();
  const [repairs, setRepairs] = useState<CustomerRepairRequest[]>([]);
  const [stats, setStats] = useState<CustomerStats>({
    totalRepairs: 0,
    activeRepairs: 0,
    completedRepairs: 0,
    totalSpent: 0,
    avgRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomerData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First get the customer record for this user
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (customerError) {
        console.error('Error fetching customer:', customerError);
        setError('Unable to load customer data');
        return;
      }

      if (!customer) {
        setError('Customer profile not found');
        return;
      }

      // Fetch repair requests with all related data
      const { data: repairData, error: repairError } = await supabase
        .from('repair_requests')
        .select(`
          *,
          devices (brand, model, category),
          technicians (name, phone),
          repair_request_services (
            quantity,
            price,
            services (name)
          ),
          status_updates (id, old_status, new_status, message, created_at),
          invoices (id, invoice_number, status, total_amount, due_date, paid_at)
        `)
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false });

      if (repairError) {
        console.error('Error fetching repairs:', repairError);
        setError('Unable to load repair history');
        return;
      }

      // Transform the data
      const transformedRepairs: CustomerRepairRequest[] = (repairData || []).map(repair => ({
        id: repair.id,
        status: repair.status,
        priority: repair.priority,
        description: repair.description || '',
        total_amount: Number(repair.total_amount) || 0,
        created_at: repair.created_at,
        updated_at: repair.updated_at,
        estimated_completion: repair.estimated_completion,
        actual_completion: repair.actual_completion,
        notes: repair.notes,
        device: {
          brand: repair.devices?.brand || 'Unknown',
          model: repair.devices?.model || 'Unknown',
          category: repair.devices?.category || 'smartphone',
        },
        technician: repair.technicians ? {
          name: repair.technicians.name,
          phone: repair.technicians.phone,
        } : null,
        services: (repair.repair_request_services || []).map((rrs: any) => ({
          name: rrs.services?.name || 'Unknown Service',
          price: Number(rrs.price) || 0,
          quantity: rrs.quantity || 1,
        })),
        status_updates: (repair.status_updates || []).sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ),
        invoice: repair.invoices && repair.invoices.length > 0 ? {
          id: repair.invoices[0].id,
          invoice_number: repair.invoices[0].invoice_number,
          status: repair.invoices[0].status,
          total_amount: Number(repair.invoices[0].total_amount) || 0,
          due_date: repair.invoices[0].due_date,
          paid_at: repair.invoices[0].paid_at,
        } : null,
      }));

      setRepairs(transformedRepairs);

      // Calculate stats
      const totalRepairs = transformedRepairs.length;
      const activeRepairs = transformedRepairs.filter(r => 
        !['completed', 'cancelled'].includes(r.status)
      ).length;
      const completedRepairs = transformedRepairs.filter(r => 
        r.status === 'completed'
      ).length;
      const totalSpent = transformedRepairs.reduce((sum, r) => sum + r.total_amount, 0);

      setStats({
        totalRepairs,
        activeRepairs,
        completedRepairs,
        totalSpent,
        avgRating: 0, // Will implement when reviews are connected
      });

    } catch (err) {
      console.error('Error in fetchCustomerData:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const repairChannel = supabase
      .channel('customer-repairs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'repair_requests',
        },
        () => {
          fetchCustomerData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'status_updates',
        },
        () => {
          fetchCustomerData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(repairChannel);
    };
  }, [user]);

  return {
    repairs,
    stats,
    loading,
    error,
    refetch: fetchCustomerData,
  };
}