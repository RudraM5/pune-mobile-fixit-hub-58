import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import TechnicianDetailsModal from "./TechnicianDetailsModal";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, 
  Plus, 
  Search, 
  Star,
  Clock,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Store
} from "lucide-react";

const TechniciansManagementTab = () => {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('view');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const [techniciansResponse, shopsResponse] = await Promise.all([
          supabase.from('technicians').select('*').order('name'),
          supabase.from('shops').select('id, name')
        ]);
        
        if (techniciansResponse.error) throw techniciansResponse.error;
        
        // Add shop name to each technician
        const techniciansWithShop = (techniciansResponse.data || []).map(tech => ({
          ...tech,
          shop_name: shopsResponse.data?.find(shop => shop.id === tech.shop_id)?.name || 'Unknown Shop'
        }));
        
        setTechnicians(techniciansWithShop);
      } catch (error) {
        console.error('Error fetching technicians:', error);
        toast.error('Failed to fetch technicians');
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, []);

  const filteredTechnicians = technicians.filter(tech =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getExpertiseColor = (level: string) => {
    switch (level) {
      case 'master': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'expert': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewTechnician = (technician: any) => {
    setSelectedTechnician(technician);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditTechnician = (technician: any) => {
    setSelectedTechnician(technician);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleAddTechnician = () => {
    setSelectedTechnician(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleDeleteTechnician = (technicianId: string) => {
    setTechnicians(prev => prev.filter(tech => tech.id !== technicianId));
    toast.success("Technician deleted successfully!");
  };

  const handleSaveTechnician = (technicianData: any) => {
    if (modalMode === 'add') {
      const newTechnician = {
        ...technicianData,
        id: `tech${technicians.length + 1}`,
        rating: 0,
        completed_repairs: 0
      };
      setTechnicians(prev => [...prev, newTechnician]);
    } else {
      setTechnicians(prev => prev.map(tech => 
        tech.id === selectedTechnician.id ? { ...tech, ...technicianData } : tech
      ));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Technicians Management</h2>
          <p className="text-muted-foreground">Manage registered technicians and their profiles</p>
        </div>
        <Button onClick={handleAddTechnician}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Technician
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search technicians..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Technicians</p>
                <p className="text-2xl font-bold">{technicians.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-green-500 rounded-full" />
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold">
                  {technicians.filter(t => t.availability_status === 'available').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">
                  {(technicians.reduce((sum, tech) => sum + tech.rating, 0) / technicians.length).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Repairs</p>
                <p className="text-2xl font-bold">
                  {technicians.reduce((sum, tech) => sum + tech.completed_repairs, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technicians List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTechnicians.map((tech) => (
          <Card key={tech.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{tech.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{tech.email}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getExpertiseColor(tech.expertise_level)}>
                    {tech.expertise_level}
                  </Badge>
                  <Badge className={getAvailabilityColor(tech.availability_status)}>
                    {tech.availability_status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span>{tech.shop_name} - {tech.area}</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{tech.rating} ({tech.completed_repairs} repairs)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{tech.years_experience}+ years</span>
                </div>
              </div>
              
              <div className="text-sm">
                <span className="font-medium">Rate:</span> ₹{tech.hourly_rate}/hour
              </div>
              
              <div className="flex flex-wrap gap-1">
                {tech.specialization.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleViewTechnician(tech)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEditTechnician(tech)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteTechnician(tech.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <TechnicianDetailsModal
        technician={selectedTechnician}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTechnician}
        mode={modalMode}
      />
    </div>
  );
};

export default TechniciansManagementTab;