import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

const mockShops = [
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
    technicians_count: 3,
    is_active: true
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
    technicians_count: 2,
    is_active: true
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
    technicians_count: 4,
    is_active: true
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
    technicians_count: 2,
    is_active: true
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
    technicians_count: 3,
    is_active: true
  }
];

const ShopsManagementTab = () => {
  const [shops] = useState(mockShops);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.owner_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Shops Management</h2>
          <p className="text-muted-foreground">Manage affiliated repair shops and their details</p>
        </div>
        <Button>
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
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShopsManagementTab;