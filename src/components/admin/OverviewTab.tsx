import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wrench, Clock, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getStatusBadge, getPriorityBadge } from "@/utils/adminHelpers";

interface Analytics {
  totalRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  completedToday: number;
  revenue: number;
  avgRepairTime: string;
  customerSatisfaction: number;
  topTechnician: string;
}

interface RepairRequest {
  id: string;
  customerName: string;
  phone: string;
  device: string;
  services: string[];
  status: "pending" | "in-progress" | "completed" | "delivered";
  priority: "low" | "medium" | "high";
  createdAt: string;
  estimatedCompletion: string;
  totalAmount: number;
  technician?: string;
}

const OverviewTab = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentRequests, setRecentRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([fetchAnalytics(), fetchRecentRequests()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    const { data: requests } = await supabase
      .from('repair_requests')
      .select('status, created_at, total_amount');

    const today = new Date().toISOString().split('T')[0];
    const totalRequests = requests?.length || 0;
    const pendingRequests = requests?.filter(r => r.status === 'pending').length || 0;
    const inProgressRequests = requests?.filter(r => r.status === 'in-progress').length || 0;
    const completedToday = requests?.filter(r => 
      r.status === 'completed' && r.created_at.startsWith(today)
    ).length || 0;
    const revenue = requests?.reduce((sum, r) => sum + (r.total_amount || 0), 0) || 0;

    setAnalytics({
      totalRequests,
      pendingRequests,
      inProgressRequests,
      completedToday,
      revenue,
      avgRepairTime: '2.5 hours',
      customerSatisfaction: 4.8,
      topTechnician: 'Raj Kumar'
    });
  };

  const fetchRecentRequests = async () => {
    const { data, error } = await supabase
      .from('repair_requests')
      .select(`
        id,
        status,
        priority,
        created_at,
        estimated_completion,
        total_amount,
        customers!inner(name, phone),
        devices!inner(brand, model),
        technicians(name),
        repair_request_services!inner(
          services!inner(name)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching recent requests:', error);
      return;
    }

    const formattedRequests = data?.map(request => ({
      id: request.id.substring(0, 8),
      customerName: request.customers.name,
      phone: request.customers.phone,
      device: `${request.devices.brand} ${request.devices.model}`,
      services: request.repair_request_services.map((rrs: any) => rrs.services.name),
      status: request.status as "pending" | "in-progress" | "completed" | "delivered",
      priority: request.priority as "low" | "medium" | "high",
      createdAt: request.created_at,
      estimatedCompletion: request.estimated_completion,
      totalAmount: request.total_amount,
      technician: request.technicians?.name
    })) || [];

    setRecentRequests(formattedRequests);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalRequests || 0}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.inProgressRequests || 0}</div>
            <p className="text-xs text-muted-foreground">Active repairs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{analytics?.revenue.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">+5% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Repair Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.avgRepairTime || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">-15 mins improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Repair Requests</CardTitle>
          <CardDescription>Latest requests that need attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
              {recentRequests.slice(0, 5).map(request => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">#{request.id}</span>
                      {getStatusBadge(request.status)}
                      {getPriorityBadge(request.priority)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {request.customerName} - {request.device}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {request.services.join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{request.totalAmount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;