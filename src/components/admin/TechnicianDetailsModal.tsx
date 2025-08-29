import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface Technician {
  id: string;
  name: string;
  phone: string;
  email?: string;
  shop_name: string;
  expertise_level: 'beginner' | 'intermediate' | 'expert' | 'master';
  specializations: string[];
  years_experience: number;
  rating: number;
  completed_repairs: number;
  availability_status: 'available' | 'busy' | 'offline';
  hourly_rate?: number;
  area: string;
  is_active: boolean;
}

interface TechnicianDetailsModalProps {
  technician?: Technician;
  isOpen: boolean;
  onClose: () => void;
  onSave: (technician: Partial<Technician>) => void;
  mode: 'view' | 'edit' | 'add';
}

const specializations = [
  "Screen Repair", "Battery Replacement", "Water Damage", "Motherboard Repair",
  "Charging Port", "Speaker/Microphone", "Camera Repair", "Software Issues"
];

const TechnicianDetailsModal = ({ technician, isOpen, onClose, onSave, mode }: TechnicianDetailsModalProps) => {
  const [formData, setFormData] = useState<Partial<Technician>>(
    technician || {
      name: "",
      phone: "",
      email: "",
      shop_name: "",
      expertise_level: "intermediate",
      specializations: [],
      years_experience: 1,
      hourly_rate: 500,
      area: "",
      availability_status: "available",
      is_active: true
    }
  );

  const handleSave = () => {
    if (!formData.name || !formData.phone || !formData.shop_name || !formData.area) {
      toast.error("Please fill in all required fields");
      return;
    }

    onSave(formData);
    toast.success(mode === 'add' ? "Technician added successfully!" : "Technician updated successfully!");
    onClose();
  };

  const handleSpecializationChange = (specialization: string, checked: boolean) => {
    const current = formData.specializations || [];
    if (checked) {
      setFormData({ ...formData, specializations: [...current, specialization] });
    } else {
      setFormData({ ...formData, specializations: current.filter(s => s !== specialization) });
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New Technician' : mode === 'edit' ? 'Edit Technician' : 'Technician Details'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <Label htmlFor="shop_name">Shop Name *</Label>
            <Input
              id="shop_name"
              value={formData.shop_name || ""}
              onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
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
          
          <div className="space-y-2">
            <Label htmlFor="expertise_level">Expertise Level</Label>
            <Select
              value={formData.expertise_level}
              onValueChange={(value: any) => setFormData({ ...formData, expertise_level: value })}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
                <SelectItem value="master">Master</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="years_experience">Years of Experience</Label>
            <Input
              id="years_experience"
              type="number"
              min="0"
              value={formData.years_experience || 1}
              onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) })}
              readOnly={isReadOnly}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hourly_rate">Hourly Rate (₹)</Label>
            <Input
              id="hourly_rate"
              type="number"
              min="0"
              value={formData.hourly_rate || 500}
              onChange={(e) => setFormData({ ...formData, hourly_rate: parseInt(e.target.value) })}
              readOnly={isReadOnly}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="availability_status">Availability Status</Label>
            <Select
              value={formData.availability_status}
              onValueChange={(value: any) => setFormData({ ...formData, availability_status: value })}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label>Specializations</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {specializations.map((spec) => (
                <div key={spec} className="flex items-center space-x-2">
                  <Checkbox
                    id={spec}
                    checked={(formData.specializations || []).includes(spec)}
                    onCheckedChange={(checked) => handleSpecializationChange(spec, checked as boolean)}
                    disabled={isReadOnly}
                  />
                  <Label htmlFor={spec} className="text-sm">{spec}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {mode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {mode !== 'view' && (
            <Button onClick={handleSave}>
              {mode === 'add' ? 'Add Technician' : 'Save Changes'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TechnicianDetailsModal;