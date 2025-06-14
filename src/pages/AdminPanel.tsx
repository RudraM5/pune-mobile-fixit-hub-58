import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "@/components/layout/Header";
import { 
  Users, 
  Wrench, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Phone,
  Calendar,
  TrendingUp,
  BarChart3
} from "lucide-react";

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

const AdminPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data - in real app this would come from your backend
  const repairRequests: RepairRequest[] = [
    {
      id: "REP001",
      customerName: "Rahul Sharma",
      phone: "+91 98765 43210",
      device: "iPhone 15 Pro",
      services: ["Screen Replacement", "Battery Replacement"],
      status: "in-progress",
      priority: "high",
      createdAt: "2024-01-15T10:30:00Z",
      estimatedCompletion: "2024-01-15T16:00:00Z",
      totalAmount: 2700,
      technician: "Amit Kumar"
    },
    {
      id: "REP002",
      customerName: "Priya Patel",
      phone: "+91 87654 32109",
      device: "Samsung Galaxy S24",
      services: ["Water Damage Treatment"],
      status: "pending",
      priority: "medium",
      createdAt: "2024-01-15T11:15:00Z",
      estimatedCompletion: "2024-01-16T14:00:00Z",
      totalAmount: 2500,
    },
    {
      id: "REP003",
      customerName: "Arjun Mehta",
      phone: "+91 76543 21098",
      device: "OnePlus 12",
      services: ["Charging Port Repair", "Tempered Glass"],
      status: "completed",
      priority: "low",
      createdAt: "2024-01-14T09:00:00Z",
      estimatedCompletion: "2024-01-14T15:00:00Z",
      totalAmount: 1000,
      technician: "Suresh Reddy"
    },
    {
      id: "REP004",
      customerName: "Sneha Gupta",
      phone: "+91 65432 10987",
      device: "iPhone 14",
      services: ["Camera Repair"],
      status: "delivered",
      priority: "medium",
      createdAt: "2024-01-13T14:20:00Z",
      estimatedCompletion: "2024-01-14T10:00:00Z",
      totalAmount: 1800,
      technician: "Rajesh Singh"
    }
  ];

  const analytics = {
    totalRequests: 156,
    pendingRequests: 12,
    inProgressRequests: 8,
    completedToday: 15,
    revenue: 45000,
    avgRepairTime: "2.5 hours",
    customerSatisfaction: 4.8,
    topTechnician: "Amit Kumar"
  };

  const filteredRequests = repairRequests.filter(request => {
    const matchesSearch = request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "destructive",
      "in-progress": "default",
      completed: "secondary",
      delivered: "default"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || "default"}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "secondary",
      medium: "default", 
      high: "destructive"
    } as const;
    
    return <Badge variant={variants[priority as keyof typeof variants] || "default"}>{priority}</Badge>;
  };

  const updateStatus = (requestId: string, newStatus: string) => {
    // In real app, this would update the backend
    console.log(`Updating request ${requestId} to status: ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage repair requests, track analytics, and monitor service quality
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requests">Repair Requests</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalRequests}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.inProgressRequests}</div>
                  <p className="text-xs text-muted-foreground">Active repairs</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{analytics.revenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+5% from yesterday</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Repair Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.avgRepairTime}</div>
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
                  {repairRequests.slice(0, 5).map(request => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{request.id}</span>
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
                        <p className="font-medium">₹{request.totalAmount}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Repair Requests</CardTitle>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by customer, device, or request ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Services</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map(request => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.customerName}</p>
                            <p className="text-xs text-muted-foreground">{request.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>{request.device}</TableCell>
                        <TableCell>
                          <div className="max-w-[200px]">
                            <p className="text-sm truncate">{request.services.join(", ")}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                        <TableCell>₹{request.totalAmount}</TableCell>
                        <TableCell>
                          <Select
                            value={request.status}
                            onValueChange={(value) => updateStatus(request.id, value)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Performance</CardTitle>
                  <CardDescription>Most requested services this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { service: "Screen Replacement", count: 45, percentage: 35 },
                      { service: "Battery Replacement", count: 32, percentage: 25 },
                      { service: "Water Damage", count: 18, percentage: 14 },
                      { service: "Charging Port", count: 15, percentage: 12 },
                      { service: "Camera Repair", count: 12, percentage: 9 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.service}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue</CardTitle>
                  <CardDescription>Revenue breakdown by month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { month: "January", revenue: 45000, growth: "+12%" },
                      { month: "December", revenue: 40000, growth: "+8%" },
                      { month: "November", revenue: 37000, growth: "+15%" },
                      { month: "October", revenue: 32000, growth: "+5%" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.month}</span>
                        <div className="text-right">
                          <p className="font-medium">₹{item.revenue.toLocaleString()}</p>
                          <p className="text-xs text-green-600">{item.growth}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
                <CardDescription>Important business metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{analytics.customerSatisfaction}</p>
                    <p className="text-sm text-muted-foreground">Customer Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">98%</p>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">1.2hr</p>
                    <p className="text-sm text-muted-foreground">Avg Response</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">85%</p>
                    <p className="text-sm text-muted-foreground">Repeat Customers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system preferences and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Business Hours</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Monday - Friday</span>
                        <span>9:00 AM - 8:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Saturday</span>
                        <span>10:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Sunday</span>
                        <span>11:00 AM - 5:00 PM</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <p>📞 +91 98765 43210</p>
                      <p>📧 info@fixmyphone.com</p>
                      <p>📍 Multiple locations in Pune</p>
                      <p>💬 WhatsApp support available</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <Button>Update Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;