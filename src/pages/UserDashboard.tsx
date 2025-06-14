import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
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
  status: "received" | "diagnosed" | "repairing" | "testing" | "completed" | "ready-for-pickup" | "delivered";
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
  // Mock user data - in real app this would come from authentication
  const [userRepairs] = useState<RepairStatus[]>([
    {
      id: "REP001",
      deviceName: "iPhone 15 Pro",
      services: ["Screen Replacement", "Battery Replacement"],
      status: "repairing",
      progress: 60,
      createdAt: "2024-01-15T10:30:00Z",
      estimatedCompletion: "2024-01-15T16:00:00Z",
      technician: "Amit Kumar",
      totalAmount: 2700,
      trackingUpdates: [
        {
          status: "received",
          message: "Device received at our service center",
          timestamp: "2024-01-15T10:30:00Z"
        },
        {
          status: "diagnosed",
          message: "Initial diagnosis completed. Issues confirmed: Cracked screen, battery degradation",
          timestamp: "2024-01-15T11:15:00Z"
        },
        {
          status: "repairing",
          message: "Screen replacement in progress. Technician: Amit Kumar",
          timestamp: "2024-01-15T12:00:00Z"
        }
      ]
    },
    {
      id: "REP002",
      deviceName: "Samsung Galaxy S23",
      services: ["Water Damage Treatment"],
      status: "completed",
      progress: 100,
      createdAt: "2024-01-12T09:00:00Z",
      estimatedCompletion: "2024-01-13T15:00:00Z",
      technician: "Suresh Reddy",
      totalAmount: 2500,
      trackingUpdates: [
        {
          status: "received",
          message: "Device received - water damage reported",
          timestamp: "2024-01-12T09:00:00Z"
        },
        {
          status: "diagnosed",
          message: "Extensive water damage found. Motherboard and components affected",
          timestamp: "2024-01-12T10:30:00Z"
        },
        {
          status: "repairing",
          message: "Water damage treatment started. Cleaning and drying process initiated",
          timestamp: "2024-01-12T14:00:00Z"
        },
        {
          status: "testing",
          message: "Repair completed. Device testing in progress",
          timestamp: "2024-01-13T11:00:00Z"
        },
        {
          status: "completed",
          message: "All tests passed! Device is working perfectly. Ready for pickup",
          timestamp: "2024-01-13T14:30:00Z"
        }
      ]
    }
  ]);

  const getStatusInfo = (status: string) => {
    const statusMap = {
      "received": { label: "Received", color: "bg-blue-500", icon: Package },
      "diagnosed": { label: "Diagnosed", color: "bg-yellow-500", icon: Clock },
      "repairing": { label: "Repairing", color: "bg-orange-500", icon: Wrench },
      "testing": { label: "Testing", color: "bg-purple-500", icon: CheckCircle },
      "completed": { label: "Completed", color: "bg-green-500", icon: CheckCircle },
      "ready-for-pickup": { label: "Ready for Pickup", color: "bg-green-600", icon: Package },
      "delivered": { label: "Delivered", color: "bg-gray-500", icon: CheckCircle }
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap.received;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      "received": "secondary",
      "diagnosed": "default",
      "repairing": "default", 
      "testing": "secondary",
      "completed": "default",
      "ready-for-pickup": "default",
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
                        <CardDescription>Request ID: {repair.id}</CardDescription>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(repair.status)}
                        <p className="text-sm text-muted-foreground mt-1">
                          ₹{repair.totalAmount}
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
                        <CardDescription>Request ID: {repair.id}</CardDescription>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(repair.status)}
                        <p className="text-sm text-muted-foreground mt-1">
                          ₹{repair.totalAmount}
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