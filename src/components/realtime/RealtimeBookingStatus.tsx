import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, Wrench, Package, Truck, AlertCircle } from "lucide-react";
import { useRealtimeBookings } from "@/hooks/useRealtimeBookings";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig = {
  'pending': { 
    icon: Clock, 
    color: 'bg-yellow-500', 
    progress: 10,
    label: 'Pending Review',
    description: 'Your request is being reviewed by our team'
  },
  'confirmed': { 
    icon: CheckCircle, 
    color: 'bg-blue-500', 
    progress: 25,
    label: 'Confirmed',
    description: 'Request confirmed, assigning technician'
  },
  'in-progress': { 
    icon: Wrench, 
    color: 'bg-orange-500', 
    progress: 50,
    label: 'In Progress',
    description: 'Our technician is working on your device'
  },
  'testing': { 
    icon: Package, 
    color: 'bg-purple-500', 
    progress: 75,
    label: 'Testing',
    description: 'Quality testing in progress'
  },
  'completed': { 
    icon: CheckCircle, 
    color: 'bg-green-500', 
    progress: 90,
    label: 'Completed',
    description: 'Repair completed, ready for pickup'
  },
  'delivered': { 
    icon: Truck, 
    color: 'bg-green-600', 
    progress: 100,
    label: 'Delivered',
    description: 'Device delivered successfully'
  },
  'cancelled': { 
    icon: AlertCircle, 
    color: 'bg-red-500', 
    progress: 0,
    label: 'Cancelled',
    description: 'Request has been cancelled'
  }
};

export function RealtimeBookingStatus() {
  const { repairRequests, statusUpdates, getLatestStatus, isLoading } = useRealtimeBookings();

  if (isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (repairRequests.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Clock className="w-5 h-5 text-primary" />
            Live Booking Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No active repair requests</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live Booking Status
          <Badge variant="secondary" className="ml-auto">
            {repairRequests.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {repairRequests.slice(0, 3).map((request) => {
          const latestUpdate = getLatestStatus(request.id);
          const currentStatus = latestUpdate?.new_status || request.status;
          const config = statusConfig[currentStatus as keyof typeof statusConfig] || statusConfig.pending;
          const StatusIcon = config.icon;

          return (
            <div 
              key={request.id} 
              className="p-4 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${config.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <StatusIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      Request #{request.id.substring(0, 8)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ₹{request.total_amount}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className="animate-pulse-slow bg-primary/10 text-primary"
                >
                  {config.label}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{config.description}</span>
                  <span className="font-medium">{config.progress}%</span>
                </div>
                <Progress 
                  value={config.progress} 
                  className="h-2 animate-pulse-slow"
                />
              </div>

              {latestUpdate && (
                <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
                  <p className="text-muted-foreground">
                    <span className="font-medium">Latest Update:</span> {latestUpdate.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(latestUpdate.created_at).toLocaleString()}
                  </p>
                </div>
              )}

              {request.estimated_completion && (
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>
                    Est. completion: {new Date(request.estimated_completion).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {repairRequests.length > 3 && (
          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              + {repairRequests.length - 3} more requests
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}