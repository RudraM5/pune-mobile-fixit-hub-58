
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

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

const RequestsTab = () => {
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Mock data - replace with your database service
    const mockRequests: RepairRequest[] = [];

    setTimeout(() => {
      setRequests(mockRequests);
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

  const updateRequestStatus = (requestId: string, newStatus: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: newStatus as any }
          : req
      )
    );
    console.log(`Request ${requestId} status changed to ${newStatus}`);
  };

  const filterRequests = (requests: RepairRequest[], searchTerm: string, statusFilter: string) => {
    return requests.filter(request => {
      const matchesSearch = searchTerm === "" || 
        request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const filteredRequests = filterRequests(requests, searchTerm, statusFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading repair requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                  <TableCell className="font-medium">#{request.id}</TableCell>
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
                  <TableCell>₹{request.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Select
                        value={request.status}
                        onValueChange={(value) => updateRequestStatus(request.id, value)}
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredRequests.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No repair requests found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestsTab;
