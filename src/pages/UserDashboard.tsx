import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Wrench, 
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plus,
  Bell
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { useCustomerData, CustomerRepairRequest } from '@/hooks/useCustomerData';
import { StatsCards } from '@/components/customer/StatsCards';
import { RepairCard } from '@/components/customer/RepairCard';
import { RepairDetailsModal } from '@/components/customer/RepairDetailsModal';
import { RealtimeNotifications } from '@/components/realtime/RealtimeNotifications';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { repairs, stats, loading, error, refetch } = useCustomerData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRepair, setSelectedRepair] = useState<CustomerRepairRequest | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleViewDetails = (repair: CustomerRepairRequest) => {
    setSelectedRepair(repair);
    setIsDetailsModalOpen(true);
  };

  const filteredRepairs = repairs.filter(repair => {
    const matchesSearch = repair.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repair.device.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repair.device.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || repair.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const activeRepairs = filteredRepairs.filter(r => !['completed', 'cancelled'].includes(r.status));
  const completedRepairs = filteredRepairs.filter(r => r.status === 'completed');
  const pendingRepairs = filteredRepairs.filter(r => r.status === 'pending');

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Unable to Load Dashboard</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={refetch}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <RealtimeNotifications />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Repair Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track your device repairs and service history
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={refetch} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Link to="/book-repair">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Repair
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} loading={loading} />

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 my-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search repairs by device, issue, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('pending')}
              size="sm"
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === 'in-progress' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('in-progress')}
              size="sm"
            >
              In Progress
            </Button>
            <Button
              variant={statusFilter === 'completed' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('completed')}
              size="sm"
            >
              Completed
            </Button>
          </div>
        </div>

        {/* Repair History Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Active Repairs ({activeRepairs.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed ({completedRepairs.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              All Repairs ({filteredRepairs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : activeRepairs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeRepairs.map((repair) => (
                  <RepairCard 
                    key={repair.id} 
                    repair={repair} 
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Repairs</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any repairs in progress at the moment.
                  </p>
                  <Link to="/book-repair">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Book a New Repair
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : completedRepairs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedRepairs.map((repair) => (
                  <RepairCard 
                    key={repair.id} 
                    repair={repair} 
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Completed Repairs</h3>
                  <p className="text-muted-foreground">
                    Your completed repairs will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredRepairs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRepairs.map((repair) => (
                  <RepairCard 
                    key={repair.id} 
                    repair={repair} 
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchTerm || statusFilter !== 'all' ? 'No Matching Repairs' : 'No Repairs Yet'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filters.' 
                      : 'Start by booking your first device repair.'
                    }
                  </p>
                  {!searchTerm && statusFilter === 'all' && (
                    <Link to="/book-repair">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Book Your First Repair
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Repair Details Modal */}
      <RepairDetailsModal
        repair={selectedRepair}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
};

export default UserDashboard;