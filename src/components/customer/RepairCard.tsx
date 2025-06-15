import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Calendar, 
  User, 
  Phone, 
  Wrench, 
  CreditCard,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Timer,
  XCircle
} from 'lucide-react';
import { CustomerRepairRequest } from '@/hooks/useCustomerData';
import { format } from 'date-fns';

interface RepairCardProps {
  repair: CustomerRepairRequest;
  onViewDetails: (repair: CustomerRepairRequest) => void;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  'on-hold': 'bg-gray-100 text-gray-800 border-gray-200',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
  urgent: 'bg-purple-100 text-purple-800',
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4" />;
    case 'in-progress':
      return <Timer className="h-4 w-4" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

export function RepairCard({ repair, onViewDetails }: RepairCardProps) {
  const isActive = !['completed', 'cancelled'].includes(repair.status);
  
  return (
    <Card className={`transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer ${
      isActive ? 'border-primary/20 bg-gradient-to-r from-primary/5 to-background' : ''
    }`} onClick={() => onViewDetails(repair)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            {repair.device.brand} {repair.device.model}
          </CardTitle>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={`${statusColors[repair.status as keyof typeof statusColors]} flex items-center gap-1`}
          >
            {getStatusIcon(repair.status)}
            {repair.status.charAt(0).toUpperCase() + repair.status.slice(1)}
          </Badge>
          <Badge 
            variant="outline" 
            className={priorityColors[repair.priority as keyof typeof priorityColors]}
          >
            {repair.priority.charAt(0).toUpperCase() + repair.priority.slice(1)} Priority
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {repair.description || 'No description provided'}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created:</span>
            </div>
            <p className="font-medium">
              {format(new Date(repair.created_at), 'MMM dd, yyyy')}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {repair.estimated_completion ? 'Est. Completion:' : 'Status:'}
              </span>
            </div>
            <p className="font-medium">
              {repair.estimated_completion 
                ? format(new Date(repair.estimated_completion), 'MMM dd, yyyy')
                : 'In Progress'
              }
            </p>
          </div>
        </div>

        {repair.technician && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Assigned Technician:</span>
            </div>
            <p className="font-medium">{repair.technician.name}</p>
          </div>
        )}

        {repair.services.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Services:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {repair.services.slice(0, 3).map((service, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {service.name}
                </Badge>
              ))}
              {repair.services.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{repair.services.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            <span className="font-semibold text-lg">₹{repair.total_amount.toLocaleString()}</span>
          </div>
          
          <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
            View Details
          </Button>
        </div>

        {repair.invoice && repair.invoice.status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Payment Pending</span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              Invoice #{repair.invoice.invoice_number} - Due {format(new Date(repair.invoice.due_date), 'MMM dd')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}