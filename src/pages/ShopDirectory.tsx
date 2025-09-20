import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  MapPin, 
  Phone, 
  Star,
  Clock,
  User,
  Store
} from "lucide-react";
import Header from "@/components/layout/Header";

import { supabase } from "@/integrations/supabase/client";

const ShopDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [expandedShop, setExpandedShop] = useState<string | null>(null);
  const [shops, setShops] = useState<any[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopsAndTechnicians = async () => {
      try {
        const [shopsResponse, techniciansResponse] = await Promise.all([
          supabase.from('shops').select('*').eq('is_active', true).order('name'),
          supabase.from('technicians').select('*').eq('is_active', true)
        ]);

        if (shopsResponse.data && techniciansResponse.data) {
          const shopsWithTechnicians = shopsResponse.data.map(shop => ({
            ...shop,
            technicians: techniciansResponse.data.filter(tech => tech.shop_id === shop.id).map(tech => ({
              name: tech.name,
              specialization: tech.specialization || [],
              rating: tech.rating,
              experience: tech.years_experience
            }))
          }));
          
          setShops(shopsWithTechnicians);
          setAreas(Array.from(new Set(shopsResponse.data.map(shop => shop.area))).sort());
        }
      } catch (error) {
        console.error('Error fetching shops and technicians:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopsAndTechnicians();
  }, []);

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.owner_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesArea = selectedArea === "all" || shop.area === selectedArea;
    
    return matchesSearch && matchesArea;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Loading Shops...</h1>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Affiliated Repair Shops</h1>
          <p className="text-muted-foreground">
            Find verified mobile repair shops and expert technicians in your area
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shops, areas, or owners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {areas.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Shops</p>
                  <p className="text-2xl font-bold">{filteredShops.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Expert Technicians</p>
                  <p className="text-2xl font-bold">
                    {filteredShops.reduce((sum, shop) => sum + shop.technicians.length, 0)}
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
                    {(filteredShops.reduce((sum, shop) => sum + shop.rating, 0) / filteredShops.length).toFixed(1)}
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
                  <p className="text-sm text-muted-foreground">Total Repairs</p>
                  <p className="text-2xl font-bold">
                    {filteredShops.reduce((sum, shop) => sum + shop.total_repairs, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shops List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredShops.map((shop) => (
            <Card key={shop.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{shop.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{shop.owner_name}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{shop.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{shop.address}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{shop.phone}</span>
                </div>
                
                <div className="text-sm">
                  <span className="font-medium">{shop.technicians.length}</span> expert technicians
                  <span className="mx-2">•</span>
                  <span className="font-medium">{shop.total_repairs}</span> repairs completed
                </div>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setExpandedShop(expandedShop === shop.id ? null : shop.id)}
                >
                  {expandedShop === shop.id ? 'Hide' : 'View'} Technicians
                </Button>
                
                {expandedShop === shop.id && (
                  <div className="space-y-3 pt-3 border-t">
                    <h4 className="font-medium text-sm">Available Technicians:</h4>
                    {shop.technicians.map((tech, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">{tech.name}</h5>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">{tech.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{tech.experience}+ years experience</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {tech.specialization.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredShops.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Shops Found</h3>
              <p className="text-muted-foreground">
                No shops match your search criteria. Try adjusting your filters.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ShopDirectory;