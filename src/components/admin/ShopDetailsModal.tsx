import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Shop {
  id: string;
  name: string;
  owner_name: string;
  phone: string;
  email?: string;
  address: string;
  area: string;
  rating: number;
  total_repairs: number;
  technicians_count: number;
  is_active: boolean;
}

interface ShopDetailsModalProps {
  shop?: Shop;
  isOpen: boolean;
  onClose: () => void;
  onSave: (shop: Partial<Shop>) => void;
  mode: 'view' | 'edit' | 'add';
}

const ShopDetailsModal = ({ shop, isOpen, onClose, onSave, mode }: ShopDetailsModalProps) => {
  const [formData, setFormData] = useState<Partial<Shop>>(
    shop || {
      name: "",
      owner_name: "",
      phone: "",
      email: "",
      address: "",
      area: "",
      is_active: true
    }
  );

  const handleSave = () => {
    if (!formData.name || !formData.owner_name || !formData.phone || !formData.address || !formData.area) {
      toast.error("Please fill in all required fields");
      return;
    }

    onSave(formData);
    toast.success(mode === 'add' ? "Shop added successfully!" : "Shop updated successfully!");
    onClose();
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New Shop' : mode === 'edit' ? 'Edit Shop' : 'Shop Details'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Shop Name *</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              readOnly={isReadOnly}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="owner_name">Owner Name *</Label>
            <Input
              id="owner_name"
              value={formData.owner_name || ""}
              onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
              readOnly={isReadOnly}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone || ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              readOnly={isReadOnly}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              readOnly={isReadOnly}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="area">Area *</Label>
            <Input
              id="area"
              value={formData.area || ""}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              readOnly={isReadOnly}
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              readOnly={isReadOnly}
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {mode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {mode !== 'view' && (
            <Button onClick={handleSave}>
              {mode === 'add' ? 'Add Shop' : 'Save Changes'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopDetailsModal;