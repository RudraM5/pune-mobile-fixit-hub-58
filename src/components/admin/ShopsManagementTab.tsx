import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ShopDetailsModal from "./ShopDetailsModal";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Store, 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  Star,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

const ShopsManagementTab = () => {
  const [shops, setShops] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('view');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const [shopsResponse, techniciansResponse] = await Promise.all([
          supabase.from('shops').select('*').order('name'),
          supabase.from('technicians').select('shop_id')
        ]);
        
        if (shopsResponse.error) throw shopsResponse.error;
        
        // Add technician count to each shop
        const shopsWithTechCount = (shopsResponse.data || []).map(shop => ({
          ...shop,
          technicians_count: techniciansResponse.data?.filter(tech => tech.shop_id === shop.id).length || 0
        }));
        
        setShops(shopsWithTechCount);
      } catch (error) {
        console.error('Error fetching shops:', error);
        toast.error('Failed to fetch shops');
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.owner_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewShop = (shop: any) => {
    setSelectedShop(shop);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditShop = (shop: any) => {
    setSelectedShop(shop);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleAddShop = () => {
    setSelectedShop(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleDeleteShop = (shopId: string) => {
    setShops(prev => prev.filter(shop => shop.id !== shopId));
    toast.success("Shop deleted successfully!");
  };

  const handleSaveShop = (shopData: any) => {
    if (modalMode === 'add') {
      const newShop = {
        ...shopData,
        id: `shop${shops.length + 1}`,
        rating: 0,
        total_repairs: 0,
        technicians_count: 0
      };
      setShops(prev => [...prev, newShop]);
    } else {
      setShops(prev => prev.map(shop => 
        shop.id === selectedShop.id ? { ...shop, ...shopData } : shop
      ));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Shops Management</h2>
          <p className="text-muted-foreground">Manage affiliated repair shops and their details</p>
        </div>
        <Button onClick={handleAddShop}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Shop
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search shops..."
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
              <Store className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Shops</p>
                <p className="text-2xl font-bold">{shops.length}</p>
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
                  {(shops.reduce((sum, shop) => sum + shop.rating, 0) / shops.length).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-green-500 rounded-full" />
              <div>
                <p className="text-sm text-muted-foreground">Active Shops</p>
                <p className="text-2xl font-bold">{shops.filter(s => s.is_active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-blue-500 rounded-full" />
              <div>
                <p className="text-sm text-muted-foreground">Total Repairs</p>
                <p className="text-2xl font-bold">
                  {shops.reduce((sum, shop) => sum + shop.total_repairs, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shops List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShops.map((shop) => (
          <Card key={shop.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{shop.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{shop.owner_name}</p>
                </div>
                <Badge variant={shop.is_active ? "default" : "secondary"}>
                  {shop.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{shop.area}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{shop.phone}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{shop.rating} ({shop.total_repairs} repairs)</span>
              </div>
              
              <div className="text-sm">
                <span className="font-medium">{shop.technicians_count}</span> technicians
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleViewShop(shop)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEditShop(shop)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteShop(shop.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ShopDetailsModal
        shop={selectedShop}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveShop}
        mode={modalMode}
      />
    </div>
  );
};

export default ShopsManagementTab;