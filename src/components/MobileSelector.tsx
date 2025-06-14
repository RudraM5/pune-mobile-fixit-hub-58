import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface MobileDevice {
  id: string;
  brand: string;
  model: string;
  image?: string;
  popular?: boolean;
}

interface MobileSelectorProps {
  onSelect: (device: MobileDevice) => void;
}

const mobileDatabase: MobileDevice[] = [
  { id: "1", brand: "Apple", model: "iPhone 15 Pro", popular: true },
  { id: "2", brand: "Apple", model: "iPhone 15", popular: true },
  { id: "3", brand: "Apple", model: "iPhone 14 Pro", popular: true },
  { id: "4", brand: "Apple", model: "iPhone 14" },
  { id: "5", brand: "Apple", model: "iPhone 13" },
  { id: "6", brand: "Samsung", model: "Galaxy S24 Ultra", popular: true },
  { id: "7", brand: "Samsung", model: "Galaxy S24" },
  { id: "8", brand: "Samsung", model: "Galaxy S23" },
  { id: "9", brand: "Samsung", model: "Galaxy A54" },
  { id: "10", brand: "OnePlus", model: "OnePlus 12", popular: true },
  { id: "11", brand: "OnePlus", model: "OnePlus 11" },
  { id: "12", brand: "Xiaomi", model: "Xiaomi 14" },
  { id: "13", brand: "Xiaomi", model: "Redmi Note 13 Pro" },
  { id: "14", brand: "Google", model: "Pixel 8 Pro" },
  { id: "15", brand: "Google", model: "Pixel 8" },
  { id: "16", brand: "Vivo", model: "V30 Pro" },
  { id: "17", brand: "Oppo", model: "Reno 11 Pro" },
  { id: "18", brand: "Realme", model: "GT 5 Pro" },
];

const MobileSelector = ({ onSelect }: MobileSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const brands = Array.from(new Set(mobileDatabase.map(device => device.brand)));
  
  const filteredDevices = mobileDatabase.filter(device => {
    const matchesSearch = device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === "" || device.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  const popularDevices = filteredDevices.filter(device => device.popular);
  const otherDevices = filteredDevices.filter(device => !device.popular);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Mobile Device</CardTitle>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for your device..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedBrand === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedBrand("")}
            >
              All Brands
            </Button>
            {brands.map(brand => (
              <Button
                key={brand}
                variant={selectedBrand === brand ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedBrand(brand)}
              >
                {brand}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {popularDevices.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-primary">Popular Devices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {popularDevices.map(device => (
                <Card key={device.id} className="cursor-pointer transition-all hover:shadow-md hover:scale-105" onClick={() => onSelect(device)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{device.brand}</p>
                        <p className="text-sm text-muted-foreground">{device.model}</p>
                      </div>
                      <Badge variant="secondary">Popular</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {otherDevices.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Other Devices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {otherDevices.map(device => (
                <Card key={device.id} className="cursor-pointer transition-all hover:shadow-md hover:scale-105" onClick={() => onSelect(device)}>
                  <CardContent className="p-4">
                    <div>
                      <p className="font-medium">{device.brand}</p>
                      <p className="text-sm text-muted-foreground">{device.model}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {filteredDevices.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No devices found matching your search.</p>
            <p className="text-sm mt-2">Try adjusting your search terms or contact us for help.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileSelector;