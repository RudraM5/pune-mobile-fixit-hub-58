import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Star, Phone, Clock, User } from "lucide-react";
import { Shop, EnhancedTechnician } from "@/types/shop";
import { supabase } from "@/integrations/supabase/client";

interface AreaSearchProps {
  onShopSelect?: (shop: Shop & { technicians: any[] }) => void;
}

const AreaSearch = ({ onShopSelect }: AreaSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [shops, setShops] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [filteredShops, setFilteredShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [areas, setAreas] = useState<string[]>([]);

  useEffect(() => {
    const fetchShopsAndTechnicians = async () => {
      try {
        const [shopsResponse, techniciansResponse] = await Promise.all([
          supabase.from('shops').select('*').eq('is_active', true),
          supabase.from('technicians').select('*').eq('is_active', true)
        ]);

        if (shopsResponse.data && techniciansResponse.data) {
          const shopsWithTechnicians = shopsResponse.data.map(shop => ({
            ...shop,
            technicians: techniciansResponse.data.filter(tech => tech.shop_id === shop.id)
          }));
          setShops(shopsWithTechnicians);
          setTechnicians(techniciansResponse.data);
          setFilteredShops(shopsWithTechnicians);
          
          // Extract unique areas
          const uniqueAreas = [...new Set(shopsResponse.data.map(shop => shop.area))];
          setAreas(uniqueAreas);
        }
      } catch (error) {
        console.error('Error fetching shops and technicians:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopsAndTechnicians();
  }, []);

  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
    const filtered = shops.filter(shop => 
      shop.area.toLowerCase().includes(area.toLowerCase())
    );
    setFilteredShops(filtered);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredShops(shops);
      return;
    }

    const filtered = shops.filter(shop => 
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.technicians.some(tech => 
        tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.specialization.some(spec => 
          spec.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
    setFilteredShops(filtered);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Shops...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Shops & Technicians by Area
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by shop name, area, or technician..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {/* Area Selection */}
          <div>
            <p className="text-sm font-medium mb-2">Available Areas:</p>
            <div className="flex flex-wrap gap-2">
              {areas.map(area => (
                <Badge
                  key={area}
                  variant={selectedArea === area ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => handleAreaSelect(area)}
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {filteredShops.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No shops found matching your criteria</p>
            </CardContent>
          </Card>
        ) : (
          filteredShops.map(shop => (
            <Card key={shop.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {shop.name}
                      <Badge variant="outline">{shop.area}</Badge>
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{shop.owner_name}</span>
                      <span>•</span>
                      <span>{shop.phone}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {shop.rating}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{shop.address}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 text-primary" />
                      <span>{shop.technicians.length} technicians</span>
                    </div>
                    <span>•</span>
                    <span>{shop.total_repairs} repairs completed</span>
                  </div>
                  {onShopSelect && (
                    <Button size="sm" onClick={() => onShopSelect(shop)}>
                      Select Shop
                    </Button>
                  )}
                </div>
                
                {/* Technicians */}
                {shop.technicians.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sm mb-2">Available Technicians:</h4>
                    <div className="space-y-2">
                      {shop.technicians.map((tech, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div>
                            <p className="font-medium text-sm">{tech.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Star className="w-3 h-3" />
                              <span>{tech.rating}</span>
                              <span>•</span>
                              <Clock className="w-3 h-3" />
                              <span>{tech.years_experience}+ years</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {tech.expertise_level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AreaSearch;