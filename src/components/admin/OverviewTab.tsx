
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wrench, Clock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    // Mock data - replace with your database service
    const mockAnalytics: Analytics = {
      totalRequests: 45,
      pendingRequests: 8,
      inProgressRequests: 12,
      completedToday: 5,
      revenue: 25600,
      avgRepairTime: '2.5 hours',
      customerSatisfaction: 4.8,
      topTechnician: 'Raj Kumar'
    };

    const mockRequests: RepairRequest[] = [];

    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setRecentRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { variant: 'outline' as const, color: 'text-yellow-600' },
      'in-progress': { variant: 'default' as const, color: 'text-blue-600' },
      'completed': { variant: 'default' as const, color: 'text-green-600' },
      'delivered': { variant: 'secondary' as const, color: 'text-gray-600' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant} className={config.color}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'low': { variant: 'outline' as const, color: 'text-green-600' },
      'medium': { variant: 'default' as const, color: 'text-yellow-600' },
      'high': { variant: 'destructive' as const, color: 'text-red-600' }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
    return <Badge variant={config.variant} className={config.color}>{priority}</Badge>;
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
