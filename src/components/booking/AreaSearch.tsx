
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Star, Phone, Clock, User } from "lucide-react";
import { Shop, EnhancedTechnician } from "@/types/shop";

// Dummy shops data with technicians
const dummyShopsWithTechnicians = [
  {
    id: "shop1",
    name: "TechFix Mobile Center",
    owner_name: "Rajesh Sharma",
    phone: "+91-9876543210",
    email: "techfix.pune@gmail.com",
    address: "Shop 15, FC Road, Near Sambhaji Bridge",
    area: "FC Road",
    is_active: true,
    rating: 4.5,
    total_repairs: 150,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    technicians: [
      {
        id: "tech1",
        name: "Arjun Mehta",
        phone: "+91-9876543301",
        email: "arjun.mehta@techfix.com",
        specialization: ["Screen Replacement", "Battery Replacement", "Camera Repair"],
        expertise_level: "expert" as const,
        years_experience: 5,
        rating: 4.6,
        completed_repairs: 85,
        availability_status: "available" as const
      },
      {
        id: "tech2",
        name: "Priyanka Das",
        phone: "+91-9876543306",
        email: "priyanka.das@expert.com",
        specialization: ["Screen Replacement", "Data Recovery", "Software Issues"],
        expertise_level: "master" as const,
        years_experience: 8,
        rating: 4.9,
        completed_repairs: 150,
        availability_status: "available" as const
      }
    ]
  },
  {
    id: "shop2",
    name: "QuickFix Solutions",
    owner_name: "Amit Kumar",
    phone: "+91-9876543212",
    email: "quickfix.vimaan@gmail.com",
    address: "Shop 22, Airport Road, Viman Nagar",
    area: "Viman Nagar",
    is_active: true,
    rating: 4.7,
    total_repairs: 200,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    technicians: [
      {
        id: "tech3",
        name: "Pooja Gupta",
        phone: "+91-9876543302",
        email: "pooja.gupta@quickfix.com",
        specialization: ["Water Damage", "Motherboard Repair", "Software Issues"],
        expertise_level: "master" as const,
        years_experience: 7,
        rating: 4.8,
        completed_repairs: 120,
        availability_status: "available" as const
      }
    ]
  },
  {
    id: "shop3",
    name: "Expert Mobile Solutions",
    owner_name: "Kavita Singh",
    phone: "+91-9876543215",
    email: "expert.wakad@gmail.com",
    address: "Shop 18, Wakad IT Park Road",
    area: "Wakad",
    is_active: true,
    rating: 4.6,
    total_repairs: 180,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    technicians: [
      {
        id: "tech4",
        name: "Vikram Singh",
        phone: "+91-9876543303",
        email: "vikram.singh@expert.com",
        specialization: ["Charging Port", "Speaker Repair", "Battery Replacement"],
        expertise_level: "expert" as const,
        years_experience: 4,
        rating: 4.4,
        completed_repairs: 95,
        availability_status: "available" as const
      }
    ]
  }
];

const puneAreas = [
  "FC Road", "Viman Nagar", "Wakad", "Kothrud", "Pune Center", "Baner", 
  "Hinjewadi", "Karve Nagar", "Aundh", "Pimpri", "Chinchwad", "Hadapsar"
];

interface AreaSearchProps {
  onShopSelect?: (shop: Shop & { technicians: any[] }) => void;
  onTechnicianSelect?: (technician: EnhancedTechnician, shop: Shop) => void;
}

const AreaSearch = ({ onShopSelect, onTechnicianSelect }: AreaSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [filteredShops, setFilteredShops] = useState(dummyShopsWithTechnicians);

  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
    const filtered = dummyShopsWithTechnicians.filter(shop => 
      shop.area.toLowerCase().includes(area.toLowerCase())
    );
    setFilteredShops(filtered);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredShops(dummyShopsWithTechnicians);
      return;
    }

    const filtered = dummyShopsWithTechnicians.filter(shop => 
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
            <p className="text-sm font-medium mb-2">Popular Areas in Pune:</p>
            <div className="flex flex-wrap gap-2">
              {puneAreas.map(area => (
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
        {filteredShops.map(shop => (
          <Card key={shop.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {shop.name}
                    <Badge variant="outline">{shop.area}</Badge>
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{shop.rating}</span>
                    </div>
                    <span>{shop.total_repairs} repairs completed</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{shop.address}</p>
                </div>
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Available Technicians:</h4>
                  <div className="space-y-2">
                    {shop.technicians.map(technician => (
                      <div key={technician.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-medium">{technician.name}</h5>
                              <Badge variant="secondary" className="text-xs">
                                {technician.expertise_level}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{technician.rating}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{technician.years_experience}+ years</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{technician.completed_repairs} repairs</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {technician.specialization.map((spec, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => onTechnicianSelect?.(technician as any, shop)}
                          >
                            Select Technician
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredShops.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No shops found in the selected area</p>
              <p className="text-sm text-muted-foreground">Try searching in a different area</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AreaSearch;
