
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Star, Phone, Clock, User } from "lucide-react";
import { Shop, EnhancedTechnician } from "@/types/shop";

// Expanded shops data with technicians across all Pune areas
const dummyShopsWithTechnicians = [
  // FC Road
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
    name: "Mobile Masters FC",
    owner_name: "Suresh Patil",
    phone: "+91-9876543216",
    email: "mobilemasters.fc@gmail.com",
    address: "Shop 42, FC Road, Near Deccan Gymkhana",
    area: "FC Road",
    is_active: true,
    rating: 4.3,
    total_repairs: 120,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    technicians: [
      {
        id: "tech5",
        name: "Rahul Joshi",
        phone: "+91-9876543307",
        email: "rahul.joshi@mobilemasters.com",
        specialization: ["Water Damage", "Charging Port", "Speaker Repair"],
        expertise_level: "intermediate" as const,
        years_experience: 3,
        rating: 4.2,
        completed_repairs: 65,
        availability_status: "available" as const
      }
    ]
  },

  // Viman Nagar
  {
    id: "shop3",
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
    id: "shop4",
    name: "Phoenix Mobile Repair",
    owner_name: "Neha Desai",
    phone: "+91-9876543217",
    email: "phoenix.viman@gmail.com",
    address: "Shop 8, Nagar Road, Viman Nagar",
    area: "Viman Nagar",
    is_active: true,
    rating: 4.4,
    total_repairs: 95,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    technicians: [
      {
        id: "tech6",
        name: "Kiran Patel",
        phone: "+91-9876543308",
        email: "kiran.patel@phoenix.com",
        specialization: ["Screen Replacement", "Battery Replacement"],
        expertise_level: "expert" as const,
        years_experience: 4,
        rating: 4.3,
        completed_repairs: 78,
        availability_status: "available" as const
      }
    ]
  },

  // Wakad
  {
    id: "shop5",
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
  },
  {
    id: "shop6",
    name: "Wakad Mobile Hub",
    owner_name: "Deepak Sharma",
    phone: "+91-9876543218",
    email: "mobilehub.wakad@gmail.com",
    address: "Shop 35, Wakad Main Road",
    area: "Wakad",
    is_active: true,
    rating: 4.2,
    total_repairs: 110,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    technicians: [
      {
        id: "tech7",
        name: "Sneha Kulkarni",
        phone: "+91-9876543309",
        email: "sneha.kulkarni@mobilehub.com",
        specialization: ["Camera Repair", "Software Issues", "Data Recovery"],
        expertise_level: "intermediate" as const,
        years_experience: 3,
        rating: 4.1,
        completed_repairs: 55,
        availability_status: "available" as const
      }
    ]
  },

  // Kothrud
  {
    id: "shop7",
    name: "TechCare Kothrud",
    owner_name: "Manish Agarwal",
    phone: "+91-9876543219",
    email: "techcare.kothrud@gmail.com",
    address: "Shop 12, Karve Road, Kothrud",
    area: "Kothrud",
    is_active: true,
    rating: 4.5,
    total_repairs: 140,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    technicians: [
      {
        id: "tech8",
        name: "Aditya Rao",
        phone: "+91-9876543310",
        email: "aditya.rao@techcare.com",
        specialization: ["Screen Replacement", "Water Damage", "Motherboard Repair"],
        expertise_level: "expert" as const,
        years_experience: 6,
        rating: 4.6,
        completed_repairs: 105,
        availability_status: "available" as const
      }
    ]
  },
  {
    id: "shop8",
    name: "Smart Repair Center",
    owner_name: "Ravi Gupta",
    phone: "+91-9876543220",
    email: "smartrepair.kothrud@gmail.com",
    address: "Shop 25, Paud Road, Kothrud",
    area: "Kothrud",
    is_active: true,
    rating: 4.3,
    total_repairs: 85,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    technicians: [
      {
        id: "tech9",
        name: "Meera Shah",
        phone: "+91-9876543311",
        email: "meera.shah@smartrepair.com",
        specialization: ["Battery Replacement", "Charging Port", "Speaker Repair"],
        expertise_level: "intermediate" as const,
        years_experience: 3,
        rating: 4.2,
        completed_repairs: 48,
        availability_status: "available" as const
      }
    ]
  },

  // Pune Center
  {
    id: "shop9",
    name: "Central Mobile Clinic",
    owner_name: "Ashok Deshmukh",
    phone: "+91-9876543221",
    email: "central.clinic@gmail.com",
    address: "Shop 5, Laxmi Road, Pune Center",
    area: "Pune Center",
    is_active: true,
    rating: 4.4,
    total_repairs: 160,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    technicians: [
      {
        id: "tech10",
        name: "Sachin Bhosale",
        phone: "+91-9876543312",
        email: "sachin.bhosale@central.com",
        specialization: ["Screen Replacement", "Camera Repair", "Software Issues"],
        expertise_level: "expert" as const,
        years_experience: 5,
        rating: 4.5,
        completed_repairs: 92,
        availability_status: "available" as const
      }
    ]
  },

  // Baner
  {
    id: "shop10",
    name: "Baner Tech Solutions",
    owner_name: "Priya Jain",
    phone: "+91-9876543222",
    email: "banertech@gmail.com",
    address: "Shop 16, Baner Road, Near Balewadi",
    area: "Baner",
    is_active: true,
    rating: 4.6,
    total_repairs: 175,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    technicians: [
      {
        id: "tech11",
        name: "Rohit Pawar",
        phone: "+91-9876543313",
        email: "rohit.pawar@banertech.com",
        specialization: ["Water Damage", "Motherboard Repair", "Data Recovery"],
        expertise_level: "master" as const,
        years_experience: 8,
        rating: 4.7,
        completed_repairs: 125,
        availability_status: "available" as const
      }
    ]
  },
  {
    id: "shop11",
    name: "Mobile Pro Baner",
    owner_name: "Anjali Mehta",
    phone: "+91-9876543223",
    email: "mobilepro.baner@gmail.com",
    address: "Shop 28, Sus Road, Baner",
    area: "Baner",
    is_active: true,
    rating: 4.2,
    total_repairs: 90,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    technicians: [
      {
        id: "tech12",
        name: "Amit Soni",
        phone: "+91-9876543314",
        email: "amit.soni@mobilepro.com",
        specialization: ["Battery Replacement", "Charging Port", "Screen Replacement"],
        expertise_level: "intermediate" as const,
        years_experience: 4,
        rating: 4.0,
        completed_repairs: 52,
        availability_status: "available" as const
      }
    ]
  },

  // Hinjewadi
  {
    id: "shop12",
    name: "IT Park Mobile Care",
    owner_name: "Sandeep Kumar",
    phone: "+91-9876543224",
    email: "itpark.mobile@gmail.com",
    address: "Shop 7, Phase 1, Hinjewadi IT Park",
    area: "Hinjewadi",
    is_active: true,
    rating: 4.5,
    total_repairs: 155,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    technicians: [
      {
        id: "tech13",
        name: "Tanvi Reddy",
        phone: "+91-9876543315",
        email: "tanvi.reddy@itpark.com",
        specialization: ["Software Issues", "Data Recovery", "Screen Replacement"],
        expertise_level: "expert" as const,
        years_experience: 5,
        rating: 4.4,
        completed_repairs: 88,
        availability_status: "available" as const
      }
    ]
  },

  // Aundh
  {
    id: "shop13",
    name: "Aundh Mobile Express",
    owner_name: "Vijay Patil",
    phone: "+91-9876543225",
    email: "aundh.express@gmail.com",
    address: "Shop 19, Aundh Main Road",
    area: "Aundh",
    is_active: true,
    rating: 4.3,
    total_repairs: 105,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    technicians: [
      {
        id: "tech14",
        name: "Pooja Marathe",
        phone: "+91-9876543316",
        email: "pooja.marathe@aundh.com",
        specialization: ["Camera Repair", "Water Damage", "Battery Replacement"],
        expertise_level: "intermediate" as const,
        years_experience: 3,
        rating: 4.2,
        completed_repairs: 58,
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
}

const AreaSearch = ({ onShopSelect }: AreaSearchProps) => {
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
                          <Button size="sm" variant="outline">
                            <Phone className="w-3 h-3 mr-1" />
                            Call Technician
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <Button 
                    onClick={() => onShopSelect?.(shop)}
                    className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90"
                  >
                    Select This Shop
                  </Button>
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
