import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Clock, 
  CheckCircle, 
  Phone, 
  MapPin, 
  Calendar,
  Wrench,
  Package,
  Star,
  MessageCircle
} from "lucide-react";

interface RepairStatus {
  id: string;
  deviceName: string;
  services: string[];
  status: "pending" | "in-progress" | "completed" | "delivered";
  progress: number;
  createdAt: string;
  estimatedCompletion: string;
  technician: string;
  totalAmount: number;
  trackingUpdates: {
    status: string;
    message: string;
    timestamp: string;
  }[];
}

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [userRepairs, setUserRepairs] = useState<RepairStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserRepairs();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchUserRepairs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('repair_requests')
        .select(`
          id,
          status,
          priority,
          created_at,
          estimated_completion,
          total_amount,
          description,
          customers!inner(name, phone, user_id),
          devices!inner(brand, model),
          technicians(name),
          repair_request_services!inner(
            services!inner(name)
          ),
          status_updates(
            old_status,
            new_status,
            message,
            created_at
          )
        `)
        .eq('customers.user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedRepairs = data?.map(request => {
        const progress = getProgressFromStatus(request.status);
        return {
          id: request.id.substring(0, 8),
          deviceName: `${request.devices.brand} ${request.devices.model}`,
          services: request.repair_request_services.map((rrs: any) => rrs.services.name),
          status: request.status as "pending" | "in-progress" | "completed" | "delivered",
          progress,
          createdAt: request.created_at,
          estimatedCompletion: request.estimated_completion,
          technician: request.technicians?.name || 'To be assigned',
          totalAmount: request.total_amount,
          trackingUpdates: request.status_updates.map((update: any) => ({
            status: update.new_status,
            message: update.message,
            timestamp: update.created_at
          })).sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        };
      }) || [];

      setUserRepairs(formattedRepairs);
    } catch (error) {
      console.error('Error fetching user repairs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressFromStatus = (status: string) => {
    const statusMap = {
      "pending": 20,
      "in-progress": 60,
      "completed": 100,
      "delivered": 100
    };
    return statusMap[status as keyof typeof statusMap] || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading your repairs...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Please Login</h3>
              <p className="text-muted-foreground mb-4">
                You need to be logged in to view your repair requests.
              </p>
              <Button>
                Login to View Repairs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusInfo = (status: string) => {
    const statusMap = {
      "pending": { label: "Pending", color: "bg-blue-500", icon: Package },
      "in-progress": { label: "In Progress", color: "bg-orange-500", icon: Wrench },
      "completed": { label: "Completed", color: "bg-green-500", icon: CheckCircle },
      "delivered": { label: "Delivered", color: "bg-gray-500", icon: CheckCircle }
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      "pending": "secondary",
      "in-progress": "default", 
      "completed": "default",
      "delivered": "secondary"
    } as const;
    
    const statusInfo = getStatusInfo(status);
    return <Badge variant={variants[status as keyof typeof variants] || "default"}>{statusInfo.label}</Badge>;
  };

  const activeRepairs = userRepairs.filter(repair => 
    !["completed", "delivered"].includes(repair.status)
  );
  
  const completedRepairs = userRepairs.filter(repair => 
    ["completed", "delivered"].includes(repair.status)
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Repairs</h1>
          <p className="text-muted-foreground">
            Track your device repairs and view repair history
          </p>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Active Repairs ({activeRepairs.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              Repair History ({completedRepairs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activeRepairs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Repairs</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any devices currently being repaired.
                  </p>
                  <Button>
                    Book a Repair
                  </Button>
                </CardContent>
              </Card>
            ) : (
              activeRepairs.map(repair => (
                <Card key={repair.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{repair.deviceName}</CardTitle>
                        <CardDescription>Request ID: #{repair.id}</CardDescription>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(repair.status)}
                        <p className="text-sm text-muted-foreground mt-1">
                          ₹{repair.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Repair Progress</span>
                        <span>{repair.progress}%</span>
                      </div>
                      <Progress value={repair.progress} className="h-2" />
                    </div>

                    {/* Service Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Services</h4>
                        <ul className="space-y-1">
                          {repair.services.map((service, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-center">
                              <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                              {service}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Details</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-2" />
                            Started: {new Date(repair.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-2" />
                            Est. Completion: {new Date(repair.estimatedCompletion).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Wrench className="h-3 w-3 mr-2" />
                            Technician: {repair.technician}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Timeline */}
                    <div>
                      <h4 className="font-semibold mb-4">Repair Timeline</h4>
                      <div className="space-y-4">
                        {repair.trackingUpdates.map((update, index) => {
                          const statusInfo = getStatusInfo(update.status);
                          const Icon = statusInfo.icon;
                          return (
                            <div key={index} className="flex items-start space-x-3">
                              <div className={`p-2 rounded-full ${statusInfo.color} text-white`}>
                                <Icon className="h-3 w-3" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">{statusInfo.label}</p>
                                <p className="text-sm text-muted-foreground">{update.message}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(update.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Support
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp Updates
                      </Button>
                      {repair.status === "completed" && (
                        <Button className="flex-1">
                          <MapPin className="h-4 w-4 mr-2" />
                          Schedule Pickup
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {completedRepairs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Repair History</h3>
                  <p className="text-muted-foreground">
                    Your completed repairs will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              completedRepairs.map(repair => (
                <Card key={repair.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{repair.deviceName}</CardTitle>
                        <CardDescription>Request ID: #{repair.id}</CardDescription>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(repair.status)}
                        <p className="text-sm text-muted-foreground mt-1">
                          ₹{repair.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Service Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Services Completed</h4>
                        <ul className="space-y-1">
                          {repair.services.map((service, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-center">
                              <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                              {service}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Repair Details</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-2" />
                            Completed: {new Date(repair.estimatedCompletion).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Wrench className="h-3 w-3 mr-2" />
                            Technician: {repair.technician}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" className="flex-1">
                        <Star className="h-4 w-4 mr-2" />
                        Rate Service
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Download Invoice
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Support
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Contact our support team for any questions about your repairs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Phone className="h-6 w-6 mb-2" />
                <span>Call Support</span>
                <span className="text-xs text-muted-foreground">+91 98765 43210</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <MessageCircle className="h-6 w-6 mb-2" />
                <span>WhatsApp</span>
                <span className="text-xs text-muted-foreground">Quick responses</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <MapPin className="h-6 w-6 mb-2" />
                <span>Visit Store</span>
                <span className="text-xs text-muted-foreground">30+ locations</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;