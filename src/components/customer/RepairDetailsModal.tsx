import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Wrench, 
  CreditCard,
  FileText,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Download,
  Star
} from 'lucide-react';
import { CustomerRepairRequest } from '@/hooks/useCustomerData';
import { format } from 'date-fns';

interface RepairDetailsModalProps {
  repair: CustomerRepairRequest | null;
  isOpen: boolean;
  onClose: () => void;
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

export function RepairDetailsModal({ repair, isOpen, onClose }: RepairDetailsModalProps) {
  if (!repair) return null;

  const isCompleted = repair.status === 'completed';
  const totalServicesCost = repair.services.reduce((sum, service) => 
    sum + (service.price * service.quantity), 0
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            Repair Details - {repair.device.brand} {repair.device.model}
          </DialogTitle>
          <DialogDescription>
            Created on {format(new Date(repair.created_at), 'MMMM dd, yyyy at h:mm a')}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Status and Priority */}
            <div className="flex items-center gap-4">
              <Badge 
                variant="outline" 
                className={`${statusColors[repair.status as keyof typeof statusColors]} text-sm py-1 px-3`}
              >
                {repair.status.charAt(0).toUpperCase() + repair.status.slice(1)}
              </Badge>
              <Badge 
                variant="outline" 
                className={`${priorityColors[repair.priority as keyof typeof priorityColors]} text-sm py-1 px-3`}
              >
                {repair.priority.charAt(0).toUpperCase() + repair.priority.slice(1)} Priority
              </Badge>
            </div>

            {/* Device Information */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Device Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Brand:</span>
                  <p className="font-medium">{repair.device.brand}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Model:</span>
                  <p className="font-medium">{repair.device.model}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <p className="font-medium capitalize">{repair.device.category}</p>
                </div>
              </div>
            </div>

            {/* Issue Description */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Issue Description
              </h3>
              <p className="text-sm bg-muted/30 rounded-lg p-3">
                {repair.description || 'No description provided'}
              </p>
            </div>

            {/* Technician Information */}
            {repair.technician && (
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Assigned Technician
                </h3>
                <div className="space-y-2">
                  <p className="font-medium">{repair.technician.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {repair.technician.phone}
                  </div>
                </div>
              </div>
            )}

            {/* Services and Pricing */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Services & Pricing
              </h3>
              <div className="space-y-3">
                {repair.services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {service.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{(service.price * service.quantity).toLocaleString()}</p>
                  </div>
                ))}
                <Separator />
                <div className="flex items-center justify-between font-semibold text-lg">
                  <span>Total Amount:</span>
                  <span className="text-primary">₹{repair.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Timeline & Status Updates */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Repair Timeline
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Created
                    </div>
                    <p className="font-medium">
                      {format(new Date(repair.created_at), 'MMM dd, yyyy h:mm a')}
                    </p>
                  </div>
                  
                  {repair.estimated_completion && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Estimated Completion
                      </div>
                      <p className="font-medium">
                        {format(new Date(repair.estimated_completion), 'MMM dd, yyyy h:mm a')}
                      </p>
                    </div>
                  )}

                  {repair.actual_completion && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Completed
                      </div>
                      <p className="font-medium">
                        {format(new Date(repair.actual_completion), 'MMM dd, yyyy h:mm a')}
                      </p>
                    </div>
                  )}
                </div>

                {repair.status_updates.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2 text-sm text-muted-foreground">Status Updates</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {repair.status_updates.map((update) => (
                        <div key={update.id} className="text-xs p-2 bg-muted/50 rounded border-l-2 border-primary/20">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">
                              {update.old_status && `${update.old_status} → `}
                              {update.new_status}
                            </span>
                            <span className="text-muted-foreground">
                              {format(new Date(update.created_at), 'MMM dd, h:mm a')}
                            </span>
                          </div>
                          {update.message && (
                            <p className="text-muted-foreground">{update.message}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Invoice Information */}
            {repair.invoice && (
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Invoice Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Invoice Number:</span>
                    <p className="font-medium">{repair.invoice.invoice_number}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <Badge 
                      variant={repair.invoice.status === 'paid' ? 'default' : 'secondary'}
                      className="ml-2"
                    >
                      {repair.invoice.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Due Date:</span>
                    <p className="font-medium">
                      {format(new Date(repair.invoice.due_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  {repair.invoice.paid_at && (
                    <div>
                      <span className="text-muted-foreground">Paid On:</span>
                      <p className="font-medium">
                        {format(new Date(repair.invoice.paid_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {repair.notes && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Additional Notes
                </h3>
                <p className="text-sm bg-muted/30 rounded-lg p-3">
                  {repair.notes}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-2">
            {repair.technician && (
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call Technician
              </Button>
            )}
            {repair.invoice && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            {isCompleted && (
              <Button variant="outline" size="sm">
                <Star className="h-4 w-4 mr-2" />
                Leave Review
              </Button>
            )}
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}