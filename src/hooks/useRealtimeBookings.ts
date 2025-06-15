import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface RepairRequest {
  id: string;
  status: string;
  priority: string;
  created_at: string;
  estimated_completion: string;
  total_amount: number;
  customer_id: string;
  device_id: string;
  technician_id?: string;
  description?: string;
  notes?: string;
}

interface StatusUpdate {
  id: string;
  repair_request_id: string;
  old_status: string;
  new_status: string;
  message: string;
  created_at: string;
}

interface RealtimeNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  status: string;
  repair_request_id?: string;
  created_at: string;
}

export function useRealtimeBookings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user) return;

      try {
        // Fetch user's repair requests
        const { data: requests } = await supabase
          .from('repair_requests')
          .select(`
            *,
            customers!inner(user_id)
          `)
          .eq('customers.user_id', user.id)
          .order('created_at', { ascending: false });

        if (requests) {
          setRepairRequests(requests);
        }

        // Fetch recent status updates for user's requests
        if (requests && requests.length > 0) {
          const requestIds = requests.map(r => r.id);
          const { data: updates } = await supabase
            .from('status_updates')
            .select('*')
            .in('repair_request_id', requestIds)
            .order('created_at', { ascending: false })
            .limit(20);

          if (updates) {
            setStatusUpdates(updates);
          }
        }

        // Fetch user notifications
        const { data: userNotifications } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (userNotifications) {
          setNotifications(userNotifications);
        }

      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time subscriptions for user:', user.id);

    // Subscribe to repair request changes
    const repairRequestsChannel = supabase
      .channel('repair-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'repair_requests'
        },
        async (payload) => {
          console.log('Repair request change:', payload);
          
          // Check if this request belongs to the current user
          if (payload.new && typeof payload.new === 'object' && 'customer_id' in payload.new) {
            const newRecord = payload.new as { customer_id: string; id: string; status: string };
            const { data: customer } = await supabase
              .from('customers')
              .select('user_id')
              .eq('id', newRecord.customer_id)
              .maybeSingle();

            if (customer?.user_id === user.id) {
              if (payload.eventType === 'INSERT') {
                setRepairRequests(prev => [newRecord as RepairRequest, ...prev]);
                toast({
                  title: "New Repair Request",
                  description: `Request #${newRecord.id.substring(0, 8)} has been created`,
                });
              } else if (payload.eventType === 'UPDATE') {
                setRepairRequests(prev => 
                  prev.map(req => 
                    req.id === newRecord.id ? { ...req, ...newRecord } : req
                  )
                );
                
                // Show toast for status changes
                if (payload.old && typeof payload.old === 'object' && 'status' in payload.old) {
                  const oldRecord = payload.old as { status: string };
                  if (oldRecord.status !== newRecord.status) {
                    toast({
                      title: "Status Updated",
                      description: `Request #${newRecord.id.substring(0, 8)} is now ${newRecord.status}`,
                    });
                  }
                }
              }
            }
          }
        }
      )
      .subscribe();

    // Subscribe to status updates
    const statusUpdatesChannel = supabase
      .channel('status-updates-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'status_updates'
        },
        async (payload) => {
          console.log('Status update change:', payload);
          
          // Check if this update is for user's repair request
          if (payload.new && typeof payload.new === 'object' && 'repair_request_id' in payload.new) {
            const newUpdate = payload.new as { repair_request_id: string; message: string; new_status: string };
            const requestExists = repairRequests.some(req => req.id === newUpdate.repair_request_id);
          
            if (requestExists) {
              setStatusUpdates(prev => [newUpdate as StatusUpdate, ...prev.slice(0, 19)]);
              
              toast({
                title: "Progress Update",
                description: newUpdate.message || `Status changed to ${newUpdate.new_status}`,
              });
            }
          }
        }
      )
      .subscribe();

    // Subscribe to notifications
    const notificationsChannel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          console.log('Notification change:', payload);
          
          if (payload.new && typeof payload.new === 'object' && 'user_id' in payload.new) {
            const newNotification = payload.new as RealtimeNotification;
            
            if (newNotification.user_id === user.id) {
              setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
              
              // Show real-time notification
              toast({
                title: newNotification.title,
                description: newNotification.message,
                duration: 5000,
              });

              // Mark notification as seen after a delay
              setTimeout(() => {
                supabase
                  .from('notifications')
                  .update({ status: 'read' })
                  .eq('id', newNotification.id)
                  .then(() => {
                    setNotifications(prev => 
                      prev.map(notif => 
                        notif.id === newNotification.id 
                          ? { ...notif, status: 'read' } 
                          : notif
                      )
                    );
                  });
              }, 3000);
            }
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscriptions');
      supabase.removeChannel(repairRequestsChannel);
      supabase.removeChannel(statusUpdatesChannel);
      supabase.removeChannel(notificationsChannel);
    };
  }, [user, repairRequests, toast]);

  // Helper function to get latest status for a repair request
  const getLatestStatus = (requestId: string) => {
    return statusUpdates
      .filter(update => update.repair_request_id === requestId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
  };

  // Helper function to get unread notifications count
  const getUnreadNotificationsCount = () => {
    return notifications.filter(notif => notif.status === 'pending').length;
  };

  return {
    repairRequests,
    statusUpdates,
    notifications,
    isLoading,
    getLatestStatus,
    getUnreadNotificationsCount
  };
}