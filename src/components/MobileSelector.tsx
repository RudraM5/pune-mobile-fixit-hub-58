import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getMobileDevices, addMobileDevice } from "@/lib/supabase";

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

// Comprehensive mobile device database covering all major brands and models
const initialMobileDatabase: MobileDevice[] = [
  // Apple iPhones
  { id: "1", brand: "Apple", model: "iPhone 15 Pro Max", popular: true },
  { id: "2", brand: "Apple", model: "iPhone 15 Pro", popular: true },
  { id: "3", brand: "Apple", model: "iPhone 15 Plus", popular: true },
  { id: "4", brand: "Apple", model: "iPhone 15", popular: true },
  { id: "5", brand: "Apple", model: "iPhone 14 Pro Max" },
  { id: "6", brand: "Apple", model: "iPhone 14 Pro" },
  { id: "7", brand: "Apple", model: "iPhone 14 Plus" },
  { id: "8", brand: "Apple", model: "iPhone 14" },
  { id: "9", brand: "Apple", model: "iPhone 13 Pro Max" },
  { id: "10", brand: "Apple", model: "iPhone 13 Pro" },
  { id: "11", brand: "Apple", model: "iPhone 13 mini" },
  { id: "12", brand: "Apple", model: "iPhone 13" },
  { id: "13", brand: "Apple", model: "iPhone 12 Pro Max" },
  { id: "14", brand: "Apple", model: "iPhone 12 Pro" },
  { id: "15", brand: "Apple", model: "iPhone 12" },
  { id: "16", brand: "Apple", model: "iPhone 12 mini" },
  { id: "17", brand: "Apple", model: "iPhone SE (3rd generation)" },
  { id: "18", brand: "Apple", model: "iPhone 11 Pro Max" },
  { id: "19", brand: "Apple", model: "iPhone 11 Pro" },
  { id: "20", brand: "Apple", model: "iPhone 11" },

  // Samsung Galaxy S Series
  { id: "21", brand: "Samsung", model: "Galaxy S24 Ultra", popular: true },
  { id: "22", brand: "Samsung", model: "Galaxy S24+", popular: true },
  { id: "23", brand: "Samsung", model: "Galaxy S24", popular: true },
  { id: "24", brand: "Samsung", model: "Galaxy S23 Ultra" },
  { id: "25", brand: "Samsung", model: "Galaxy S23+" },
  { id: "26", brand: "Samsung", model: "Galaxy S23" },
  { id: "27", brand: "Samsung", model: "Galaxy S22 Ultra" },
  { id: "28", brand: "Samsung", model: "Galaxy S22+" },
  { id: "29", brand: "Samsung", model: "Galaxy S22" },
  { id: "30", brand: "Samsung", model: "Galaxy S21 Ultra" },
  { id: "31", brand: "Samsung", model: "Galaxy S21+" },
  { id: "32", brand: "Samsung", model: "Galaxy S21" },

  // Samsung Galaxy Note Series
  { id: "33", brand: "Samsung", model: "Galaxy Note 20 Ultra" },
  { id: "34", brand: "Samsung", model: "Galaxy Note 20" },

  // Samsung Galaxy A Series
  { id: "35", brand: "Samsung", model: "Galaxy A54 5G" },
  { id: "36", brand: "Samsung", model: "Galaxy A34 5G" },
  { id: "37", brand: "Samsung", model: "Galaxy A24" },
  { id: "38", brand: "Samsung", model: "Galaxy A14 5G" },
  { id: "39", brand: "Samsung", model: "Galaxy A73 5G" },
  { id: "40", brand: "Samsung", model: "Galaxy A53 5G" },
  { id: "41", brand: "Samsung", model: "Galaxy A33 5G" },
  { id: "42", brand: "Samsung", model: "Galaxy A23" },
  { id: "43", brand: "Samsung", model: "Galaxy A13" },

  // Samsung Galaxy Z Series (Foldables)
  { id: "44", brand: "Samsung", model: "Galaxy Z Fold 5" },
  { id: "45", brand: "Samsung", model: "Galaxy Z Flip 5" },
  { id: "46", brand: "Samsung", model: "Galaxy Z Fold 4" },
  { id: "47", brand: "Samsung", model: "Galaxy Z Flip 4" },

  // OnePlus
  { id: "48", brand: "OnePlus", model: "OnePlus 12", popular: true },
  { id: "49", brand: "OnePlus", model: "OnePlus 11", popular: true },
  { id: "50", brand: "OnePlus", model: "OnePlus 10 Pro" },
  { id: "51", brand: "OnePlus", model: "OnePlus 10T" },
  { id: "52", brand: "OnePlus", model: "OnePlus 9 Pro" },
  { id: "53", brand: "OnePlus", model: "OnePlus 9" },
  { id: "54", brand: "OnePlus", model: "OnePlus Nord 3 5G" },
  { id: "55", brand: "OnePlus", model: "OnePlus Nord CE 3 Lite" },
  { id: "56", brand: "OnePlus", model: "OnePlus Nord CE 2 Lite" },

  // Xiaomi Mi/Redmi Series
  { id: "57", brand: "Xiaomi", model: "Xiaomi 14 Ultra", popular: true },
  { id: "58", brand: "Xiaomi", model: "Xiaomi 14" },
  { id: "59", brand: "Xiaomi", model: "Xiaomi 13 Ultra" },
  { id: "60", brand: "Xiaomi", model: "Xiaomi 13 Pro" },
  { id: "61", brand: "Xiaomi", model: "Xiaomi 13" },
  { id: "62", brand: "Xiaomi", model: "Xiaomi 12 Pro" },
  { id: "63", brand: "Xiaomi", model: "Xiaomi 12" },
  { id: "64", brand: "Xiaomi", model: "Redmi Note 13 Pro+", popular: true },
  { id: "65", brand: "Xiaomi", model: "Redmi Note 13 Pro" },
  { id: "66", brand: "Xiaomi", model: "Redmi Note 13" },
  { id: "67", brand: "Xiaomi", model: "Redmi Note 12 Pro+" },
  { id: "68", brand: "Xiaomi", model: "Redmi Note 12 Pro" },
  { id: "69", brand: "Xiaomi", model: "Redmi Note 12" },
  { id: "70", brand: "Xiaomi", model: "Redmi 13C" },
  { id: "71", brand: "Xiaomi", model: "Redmi 12 5G" },
  { id: "72", brand: "Xiaomi", model: "POCO X6 Pro" },
  { id: "73", brand: "Xiaomi", model: "POCO X6" },
  { id: "74", brand: "Xiaomi", model: "POCO F5 Pro" },
  { id: "75", brand: "Xiaomi", model: "POCO F5" },

  // Google Pixel
  { id: "76", brand: "Google", model: "Pixel 8 Pro", popular: true },
  { id: "77", brand: "Google", model: "Pixel 8", popular: true },
  { id: "78", brand: "Google", model: "Pixel 8a" },
  { id: "79", brand: "Google", model: "Pixel 7 Pro" },
  { id: "80", brand: "Google", model: "Pixel 7" },
  { id: "81", brand: "Google", model: "Pixel 7a" },
  { id: "82", brand: "Google", model: "Pixel 6 Pro" },
  { id: "83", brand: "Google", model: "Pixel 6" },
  { id: "84", brand: "Google", model: "Pixel 6a" },
  { id: "85", brand: "Google", model: "Pixel Fold" },

  // Vivo
  { id: "86", brand: "Vivo", model: "V30 Pro", popular: true },
  { id: "87", brand: "Vivo", model: "V30" },
  { id: "88", brand: "Vivo", model: "V29 Pro" },
  { id: "89", brand: "Vivo", model: "V29" },
  { id: "90", brand: "Vivo", model: "X100 Pro" },
  { id: "91", brand: "Vivo", model: "X100" },
  { id: "92", brand: "Vivo", model: "X90 Pro" },
  { id: "93", brand: "Vivo", model: "T2 Pro 5G" },
  { id: "94", brand: "Vivo", model: "T2 5G" },
  { id: "95", brand: "Vivo", model: "Y100 5G" },
  { id: "96", brand: "Vivo", model: "Y56 5G" },

  // Oppo
  { id: "97", brand: "Oppo", model: "Find X7 Ultra" },
  { id: "98", brand: "Oppo", model: "Find X7" },
  { id: "99", brand: "Oppo", model: "Reno 11 Pro", popular: true },
  { id: "100", brand: "Oppo", model: "Reno 11" },
  { id: "101", brand: "Oppo", model: "Reno 10 Pro+" },
  { id: "102", brand: "Oppo", model: "Reno 10 Pro" },
  { id: "103", brand: "Oppo", model: "Reno 10" },
  { id: "104", brand: "Oppo", model: "F25 Pro 5G" },
  { id: "105", brand: "Oppo", model: "A79 5G" },
  { id: "106", brand: "Oppo", model: "A78 5G" },

  // Realme
  { id: "107", brand: "Realme", model: "GT 5 Pro", popular: true },
  { id: "108", brand: "Realme", model: "GT 3" },
  { id: "109", brand: "Realme", model: "12 Pro+" },
  { id: "110", brand: "Realme", model: "12 Pro" },
  { id: "111", brand: "Realme", model: "12" },
  { id: "112", brand: "Realme", model: "11 Pro+" },
  { id: "113", brand: "Realme", model: "11 Pro" },
  { id: "114", brand: "Realme", model: "C67" },
  { id: "115", brand: "Realme", model: "C55" },
  { id: "116", brand: "Realme", model: "Narzo 70 Pro" },

  // Nothing
  { id: "117", brand: "Nothing", model: "Phone (2a)" },
  { id: "118", brand: "Nothing", model: "Phone (2)" },
  { id: "119", brand: "Nothing", model: "Phone (1)" },

  // Honor
  { id: "120", brand: "Honor", model: "Magic 6 Pro" },
  { id: "121", brand: "Honor", model: "Magic 5 Pro" },
  { id: "122", brand: "Honor", model: "90 5G" },
  { id: "123", brand: "Honor", model: "X9b 5G" },

  // Motorola
  { id: "124", brand: "Motorola", model: "Edge 50 Pro" },
  { id: "125", brand: "Motorola", model: "Edge 40 Pro" },
  { id: "126", brand: "Motorola", model: "G84 5G" },
  { id: "127", brand: "Motorola", model: "G54 5G" },
  { id: "128", brand: "Motorola", model: "Razr 50 Ultra" },

  // Asus
  { id: "129", brand: "Asus", model: "ROG Phone 8 Pro" },
  { id: "130", brand: "Asus", model: "ROG Phone 8" },
  { id: "131", brand: "Asus", model: "Zenfone 11 Ultra" },
  { id: "132", brand: "Asus", model: "Zenfone 10" },

  // Sony
  { id: "133", brand: "Sony", model: "Xperia 1 VI" },
  { id: "134", brand: "Sony", model: "Xperia 5 V" },
  { id: "135", brand: "Sony", model: "Xperia 10 VI" },

  // iQOO
  { id: "136", brand: "iQOO", model: "12 5G" },
  { id: "137", brand: "iQOO", model: "Neo 9 Pro" },
  { id: "138", brand: "iQOO", model: "Z9 5G" },

  // Infinix
  { id: "139", brand: "Infinix", model: "Note 40 Pro+" },
  { id: "140", brand: "Infinix", model: "Hot 40 Pro" },

  // Tecno
  { id: "141", brand: "Tecno", model: "Phantom V Fold" },
  { id: "142", brand: "Tecno", model: "Camon 30 Pro" },

  // CMF by Nothing
  { id: "143", brand: "CMF", model: "Phone 1" },

  // Lava
  { id: "144", brand: "Lava", model: "Blaze 2 5G" },
  { id: "145", brand: "Lava", model: "Agni 2 5G" },
];

const MobileSelector = ({ onSelect }: MobileSelectorProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [mobileDatabase, setMobileDatabase] = useState<MobileDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDeviceBrand, setNewDeviceBrand] = useState("");
  const [newDeviceModel, setNewDeviceModel] = useState("");

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const devices = await getMobileDevices();
        const transformedDevices = devices.map(device => ({
          id: device.id,
          brand: device.brand,
          model: device.model,
          popular: ['iPhone 15 Pro', 'iPhone 15', 'Galaxy S24', 'OnePlus 12', 'Xiaomi 14'].includes(device.model)
        }));
        setMobileDatabase([...transformedDevices, ...initialMobileDatabase]);
      } catch (error) {
        console.error('Error fetching devices:', error);
        setMobileDatabase(initialMobileDatabase);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const brands = Array.from(new Set(mobileDatabase.map(device => device.brand)));
  
  const filteredDevices = mobileDatabase.filter(device => {
    const matchesSearch = device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === "" || device.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  const popularDevices = filteredDevices.filter(device => device.popular);
  const otherDevices = filteredDevices.filter(device => !device.popular);

  const handleAddDevice = () => {
    if (!newDeviceBrand.trim() || !newDeviceModel.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both brand and model",
        variant: "destructive"
      });
      return;
    }

    const addDevice = async () => {
      try {
        const newDevice = await addMobileDevice(newDeviceBrand.trim(), newDeviceModel.trim());
        const transformedDevice: MobileDevice = {
          id: newDevice.id,
          brand: newDevice.brand,
          model: newDevice.model,
          popular: false
        };

        setMobileDatabase(prev => [...prev, transformedDevice]);
        setIsAddDialogOpen(false);
        setNewDeviceBrand("");
        setNewDeviceModel("");
        
        toast({
          title: "Device added successfully",
          description: `${transformedDevice.brand} ${transformedDevice.model} has been added to the database`,
        });

        // Auto-select the newly added device
        onDeviceSelect(transformedDevice);
      } catch (error) {
        toast({
          title: "Error adding device",
          description: "Failed to add device to database",
          variant: "destructive"
        });
      }
    };

    addDevice();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Devices...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

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
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">
              <p>No devices found matching your search.</p>
              <p className="text-sm mt-2">Can't find your device? Add it to our database!</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add My Device
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Your Device</DialogTitle>
                  <DialogDescription>
                    Add your device to our database so others can find it too.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Select value={newDeviceBrand} onValueChange={setNewDeviceBrand}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand or type a new one" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map(brand => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                        <SelectItem value="Other">Other (Custom Brand)</SelectItem>
                      </SelectContent>
                    </Select>
                    {(newDeviceBrand === "Other" || !brands.includes(newDeviceBrand)) && (
                      <Input
                        placeholder="Enter custom brand name"
                        value={newDeviceBrand === "Other" ? "" : newDeviceBrand}
                        onChange={(e) => setNewDeviceBrand(e.target.value)}
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      placeholder="Enter device model (e.g., iPhone 15 Pro)"
                      value={newDeviceModel}
                      onChange={(e) => setNewDeviceModel(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddDevice}>
                    Add Device
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Plus className="h-4 w-4" />
            <span>Missing your device? You can add it using the button above when no results are found.</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileSelector;