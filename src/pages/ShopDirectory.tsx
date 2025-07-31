import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Store, 
  MapPin, 
  Phone, 
  Star, 
  User, 
  Search,
  Filter,
  Clock,
  CheckCircle
} from 'lucide-react';
import Header from '@/components/layout/Header';

const shopData = [
  {
    id: "shop1",
    name: "TechFix Mobile Center",
    owner_name: "Rajesh Sharma",
    phone: "+91-9876543210",
    address: "Shop 15, FC Road, Near Sambhaji Bridge",
    area: "FC Road",
    rating: 4.5,
    total_repairs: 150,
    technicians: [
      {
        id: "tech1",
        name: "Arjun Mehta",
        specialization: ["Screen Replacement", "Battery Replacement", "Camera Repair"],
        expertise_level: "expert",
        rating: 4.6,
        years_experience: 5
      },
      {
        id: "tech4",
        name: "Priyanka Das",
        specialization: ["Screen Replacement", "Data Recovery", "Software Issues"],
        expertise_level: "master",
        rating: 4.9,
        years_experience: 8
      }
    ]
  },
  {
    id: "shop2",
    name: "QuickFix Solutions",
    owner_name: "Amit Kumar",
    phone: "+91-9876543212",
    address: "Shop 22, Airport Road, Viman Nagar",
    area: "Viman Nagar",
    rating: 4.7,
    total_repairs: 200,
    technicians: [
      {
        id: "tech2",
        name: "Pooja Gupta",
        specialization: ["Water Damage", "Motherboard Repair", "Software Issues"],
        expertise_level: "master",
        rating: 4.8,
        years_experience: 7
      }
    ]
  },
  {
    id: "shop3",
    name: "Expert Mobile Solutions",
    owner_name: "Kavita Singh",
    phone: "+91-9876543215",
    address: "Shop 18, Wakad IT Park Road",
    area: "Wakad",
    rating: 4.6,
    total_repairs: 180,
    technicians: [
      {
        id: "tech3",
        name: "Vikram Singh",
        specialization: ["Charging Port", "Speaker Repair", "Battery Replacement"],
        expertise_level: "expert",
        rating: 4.4,
        years_experience: 4
      }
    ]
  },
  {
    id: "shop4",
    name: "Mobile Care Hub",
    owner_name: "Suresh Patel",
    phone: "+91-9876543220",
    address: "Shop 8, Kothrud Main Road",
    area: "Kothrud",
    rating: 4.3,
    total_repairs: 120,
    technicians: [
      {
        id: "tech5",
        name: "Rohit Kumar",
        specialization: ["Battery Replacement", "Charging Port", "Water Damage"],
        expertise_level: "intermediate",
        rating: 4.2,
        years_experience: 3
      }
    ]
  },
  {
    id: "shop5",
    name: "Gadget Fix Center",
    owner_name: "Priya Reddy",
    phone: "+91-9876543225",
    address: "Shop 12, Baner Main Street",
    area: "Baner",
    rating: 4.4,
    total_repairs: 95,
    technicians: [
      {
        id: "tech6",
        name: "Anil Sharma",
        specialization: ["Screen Replacement", "Camera Repair", "Software Issues"],
        expertise_level: "expert",
        rating: 4.5,
        years_experience: 6
      }
    ]
  },
  {
    id: "shop6",
    name: "Smart Repair Solutions",
    owner_name: "Neha Joshi",
    phone: "+91-9876543230",
    address: "Shop 25, Hinjewadi Phase 1",
    area: "Hinjewadi",
    rating: 4.2,
    total_repairs: 85,
    technicians: [
      {
        id: "tech7",
        name: "Kiran Patil",
        specialization: ["Motherboard Repair", "Water Damage", "Data Recovery"],
        expertise_level: "master",
        rating: 4.7,
        years_experience: 9
      }
    ]
  }
];

const ShopDirectory = () => {
  const [shops] = useState(shopData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedShop, setSelectedShop] = useState<string | null>(null);

  const areas = ["all", ...Array.from(new Set(shops.map(shop => shop.area)))];

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea === "all" || shop.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  const getExpertiseColor = (level: string) => {
    switch (level) {
      case 'master': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'expert': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shop Directory</h1>
          <p className="text-muted-foreground">
            Browse our network of verified repair shops and expert technicians
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shops or areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select Area" />
            </SelectTrigger>
            <SelectContent>
              {areas.map(area => (
                <SelectItem key={area} value={area}>
                  {area === "all" ? "All Areas" : area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                <User className="h-5 w-5 text-primary" />
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
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed Repairs</p>
                  <p className="text-2xl font-bold">
                    {filteredShops.reduce((sum, shop) => sum + shop.total_repairs, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shops Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredShops.map((shop) => (
            <Card key={shop.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{shop.name}</CardTitle>
                    <p className="text-muted-foreground">{shop.owner_name}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{shop.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{shop.address}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{shop.phone}</span>
                </div>
                
                <div className="text-sm">
                  <span className="font-medium">{shop.total_repairs}</span> repairs completed
                </div>

                {/* Technicians */}
                <div>
                  <h4 className="font-medium mb-2">Available Technicians ({shop.technicians.length})</h4>
                  <div className="space-y-3">
                    {shop.technicians.map((tech) => (
                      <div key={tech.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">{tech.name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{tech.rating}</span>
                              <Clock className="h-3 w-3 ml-2" />
                              <span>{tech.years_experience}+ years</span>
                            </div>
                          </div>
                          <Badge className={getExpertiseColor(tech.expertise_level)}>
                            {tech.expertise_level}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {tech.specialization.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Shop
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredShops.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No shops found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or selecting a different area.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ShopDirectory;