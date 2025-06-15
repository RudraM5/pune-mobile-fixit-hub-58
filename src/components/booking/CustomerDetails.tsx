import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomerInfo } from "@/types/booking";

interface CustomerDetailsProps {
  customerInfo: CustomerInfo;
  onUpdate: (updates: Partial<CustomerInfo>) => void;
}

const CustomerDetails = ({ customerInfo, onUpdate }: CustomerDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>
          We'll use this information to contact you about your repair
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={customerInfo.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={customerInfo.phone}
              onChange={(e) => onUpdate({ phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={customerInfo.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <Label htmlFor="address">Pickup Address</Label>
          <Textarea
            id="address"
            value={customerInfo.address}
            onChange={(e) => onUpdate({ address: e.target.value })}
            placeholder="Enter your complete address for pickup service"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="description">Issue Description</Label>
          <Textarea
            id="description"
            value={customerInfo.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Describe the issues you're facing with your device"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerDetails;