import { useState } from "react";
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

const shops = [
  {
    id: "shop1",
    name: "TechFix Mobile Center",
    owner_name: "Rajesh Sharma",
    phone: "+91-9876543210",
    email: "techfix.pune@gmail.com",
    address: "Shop 15, FC Road, Near Sambhaji Bridge",
    area: "FC Road",
    rating: 4.5,
    total_repairs: 150,
    technicians: [
      {
        name: "Arjun Mehta",
        specialization: ["Screen Replacement", "Battery Replacement", "Camera Repair"],
        rating: 4.6,
        experience: 5
      },
      {
        name: "Priyanka Das",
        specialization: ["Screen Replacement", "Data Recovery", "Software Issues"],
        rating: 4.9,
        experience: 8
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
    rating: 4.7,
    total_repairs: 200,
    technicians: [
      {
        name: "Pooja Gupta",
        specialization: ["Water Damage", "Motherboard Repair", "Software Issues"],
        rating: 4.8,
        experience: 7
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
    rating: 4.6,
    total_repairs: 180,
    technicians: [
      {
        name: "Vikram Singh",
        specialization: ["Charging Port", "Speaker Repair", "Battery Replacement"],
        rating: 4.4,
        experience: 4
      }
    ]
  },
  {
    id: "shop4",
    name: "Mobile Care Hub",
    owner_name: "Suresh Patel",
    phone: "+91-9876543220",
    email: "mobilecare.kothrud@gmail.com",
    address: "Shop 8, Kothrud Main Road",
    area: "Kothrud",
    rating: 4.3,
    total_repairs: 120,
    technicians: [
      {
        name: "Rohit Kumar",
        specialization: ["Battery Replacement", "Charging Port", "Water Damage"],
        rating: 4.2,
        experience: 3
      }
    ]
  },
  {
    id: "shop5",
    name: "Gadget Fix Center",
    owner_name: "Priya Reddy",
    phone: "+91-9876543225",
    email: "gadgetfix.baner@gmail.com",
    address: "Shop 12, Baner Main Street",
    area: "Baner",
    rating: 4.4,
    total_repairs: 95,
    technicians: [
      {
        name: "Anil Sharma",
        specialization: ["Screen Replacement", "Camera Repair", "Software Issues"],
        rating: 4.5,
        experience: 6
      }
    ]
  },
  {
    id: "shop6",
    name: "Smart Repair Solutions",
    owner_name: "Neha Joshi",
    phone: "+91-9876543230",
    email: "smart.hinjewadi@gmail.com",
    address: "Shop 25, Hinjewadi Phase 1",
    area: "Hinjewadi",
    rating: 4.2,
    total_repairs: 85,
    technicians: [
      {
        name: "Kiran Patil",
        specialization: ["Motherboard Repair", "Water Damage", "Data Recovery"],
        rating: 4.7,
        experience: 9
      }
    ]
  },
  {
    id: "shop7",
    name: "ProFix Mobile Care",
    owner_name: "Deepak Gupta",
    phone: "+91-9876543235",
    email: "profix.shivajinagar@gmail.com",
    address: "Shop 9, Shivajinagar Main Road",
    area: "Shivajinagar",
    rating: 4.1,
    total_repairs: 75,
    technicians: [
      {
        name: "Ravi Joshi",
        specialization: ["Screen Replacement", "Battery Replacement", "Speaker Repair"],
        rating: 4.1,
        experience: 4
      }
    ]
  },
  {
    id: "shop8",
    name: "TechCare Solutions",
    owner_name: "Sneha Pawar",
    phone: "+91-9876543240",
    email: "techcare.aundh@gmail.com",
    address: "Shop 18, Aundh IT Park",
    area: "Aundh",
    rating: 4.5,
    total_repairs: 110,
    technicians: [
      {
        name: "Kavita Desai",
        specialization: ["Water Damage", "Charging Port", "Software Issues"],
        rating: 4.6,
        experience: 7
      }
    ]
  }
];

const areas = Array.from(new Set(shops.map(shop => shop.area))).sort();

const ShopDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [expandedShop, setExpandedShop] = useState<string | null>(null);

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.owner_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesArea = selectedArea === "all" || shop.area === selectedArea;
    
    return matchesSearch && matchesArea;
  });

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