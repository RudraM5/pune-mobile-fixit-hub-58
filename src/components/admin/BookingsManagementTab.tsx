import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { 
  Search,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Calendar
} from "lucide-react";

interface Booking {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  device: string;
  services: string[];
  area: string;
  shopName: string;
  status: "pending" | "accepted" | "rejected" | "in-progress" | "completed";
  createdAt: string;
  scheduledDate: string;
  totalAmount: number;
  address: string;
  otpCode?: string;
}

const BookingsManagementTab = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Mock bookings data
    const mockBookings: Booking[] = [
      {
        id: "BK001",
        customerName: "Rahul Sharma",
        phone: "+91-9876543210",
        email: "rahul@example.com",
        device: "iPhone 15 Pro",
        services: ["Screen Replacement", "Battery Replacement"],
        area: "Koregaon Park",
        shopName: "TechFix Mobile Center",
        status: "pending",
        createdAt: new Date().toISOString(),
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        totalAmount: 4500,
        address: "Lane 5, Koregaon Park, Pune"
      },
      {
        id: "BK002",
        customerName: "Priya Patel",
        phone: "+91-9876543211",
        email: "priya@example.com",
        device: "Samsung Galaxy S24",
        services: ["Water Damage Repair"],
        area: "Baner",
        shopName: "QuickFix Solutions",
        status: "accepted",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        scheduledDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        totalAmount: 3200,
        address: "Baner Road, Near D-Mart, Pune",
        otpCode: "1234"
      }
    ];

    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { variant: 'outline' as const, color: 'text-yellow-600', bg: 'bg-yellow-50' },
      'accepted': { variant: 'default' as const, color: 'text-green-600', bg: 'bg-green-50' },
      'rejected': { variant: 'destructive' as const, color: 'text-red-600', bg: 'bg-red-50' },
      'in-progress': { variant: 'default' as const, color: 'text-blue-600', bg: 'bg-blue-50' },
      'completed': { variant: 'secondary' as const, color: 'text-gray-600', bg: 'bg-gray-50' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant} className={`${config.color} ${config.bg}`}>{status}</Badge>;
  };

  const handleAcceptBooking = (bookingId: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { 
              ...booking, 
              status: 'accepted' as const,
              otpCode: Math.floor(1000 + Math.random() * 9000).toString()
            }
          : booking
      )
    );
    toast.success("Booking accepted! Customer will be notified and OTP generated.");
  };

  const handleRejectBooking = (bookingId: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'rejected' as const }
          : booking
      )
    );
    toast.error("Booking rejected. Customer will be notified.");
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = searchTerm === "" || 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.area.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Booking Management</h2>
          <p className="text-muted-foreground">Manage customer booking requests and approvals</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'accepted').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-blue-500 rounded-full" />
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'in-progress').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-500 rounded-full" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'completed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer, device, area, or booking ID..."
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
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Device & Services</TableHead>
                <TableHead>Area & Shop</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map(booking => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">#{booking.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.customerName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {booking.phone}
                      </p>
                      <p className="text-xs text-muted-foreground">{booking.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.device}</p>
                      <p className="text-xs text-muted-foreground">{booking.services.join(", ")}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {booking.area}
                      </p>
                      <p className="text-xs text-muted-foreground">{booking.shopName}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(booking.scheduledDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(booking.scheduledDate).toLocaleTimeString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>₹{booking.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleAcceptBooking(booking.id)}
                            className="h-7 px-2"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleRejectBooking(booking.id)}
                            className="h-7 px-2"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {booking.status === 'accepted' && booking.otpCode && (
                        <div className="text-xs">
                          <p className="font-medium">OTP: {booking.otpCode}</p>
                          <p className="text-muted-foreground">For pickup</p>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredBookings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No bookings found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsManagementTab;