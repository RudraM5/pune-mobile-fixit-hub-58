import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getStatusBadge, getPriorityBadge } from "@/utils/adminHelpers";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
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
          customers!inner(name, phone),
          devices!inner(brand, model),
          technicians(name),
          repair_request_services!inner(
            services!inner(name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

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

      setRequests(formattedRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch repair requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      // Find the full UUID from our requests
      const { data: fullRequest } = await supabase
        .from('repair_requests')
        .select('id')
        .eq('id', requests.find(r => r.id === requestId)?.id || requestId)
        .single();

      if (!fullRequest) throw new Error('Request not found');

      const { error } = await supabase
        .from('repair_requests')
        .update({ status: newStatus })
        .eq('id', fullRequest.id);

      if (error) throw error;

      // Update local state
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: newStatus as any }
            : req
        )
      );

      toast({
        title: "Status Updated",
        description: `Request status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive"
      });
    }
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestsTab;