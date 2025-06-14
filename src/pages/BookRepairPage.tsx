import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/Header";
import MobileSelector from "@/components/MobileSelector";
import { ShoppingCart, Phone, Clock, MapPin, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MobileDevice {
  id: string;
  brand: string;
  model: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
}

interface CartItem {
  service: Service;
  quantity: number;
}

const BookRepairPage = () => {
  const { toast } = useToast();
  const [selectedDevice, setSelectedDevice] = useState<MobileDevice | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState("device");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    description: "",
    pickupPreferred: true
  });

  const services: Service[] = [
    // Basic Repairs
    { id: "1", name: "Screen Replacement", description: "High-quality OLED/LCD display replacement", price: 1500, duration: "30 mins", category: "basic" },
    { id: "2", name: "Battery Replacement", description: "Original capacity battery replacement", price: 1200, duration: "20 mins", category: "basic" },
    { id: "3", name: "Charging Port Repair", description: "Fix charging port issues", price: 800, duration: "45 mins", category: "basic" },
    { id: "4", name: "Speaker Repair", description: "Fix audio issues and speaker replacement", price: 600, duration: "30 mins", category: "basic" },
    
    // Advanced Repairs
    { id: "5", name: "Motherboard Repair", description: "Circuit board and chip-level repairs", price: 3500, duration: "2-4 hours", category: "advanced" },
    { id: "6", name: "Water Damage Treatment", description: "Complete liquid damage recovery service", price: 2500, duration: "4-6 hours", category: "advanced" },
    { id: "7", name: "Camera Repair", description: "Front/rear camera module replacement", price: 1800, duration: "45 mins", category: "advanced" },
    { id: "8", name: "Face ID/Touch ID Repair", description: "Biometric sensor repair", price: 2200, duration: "1 hour", category: "advanced" },
    
    // Accessories
    { id: "9", name: "Tempered Glass", description: "9H hardness screen protector", price: 200, duration: "5 mins", category: "accessories" },
    { id: "10", name: "Phone Cover", description: "Protective case installation", price: 300, duration: "2 mins", category: "accessories" },
    { id: "11", name: "Screen Guard", description: "Anti-glare screen protection", price: 150, duration: "5 mins", category: "accessories" },
    
    // Premium Services
    { id: "12", name: "On-Call Technician", description: "Technician visits your location", price: 500, duration: "Travel time", category: "premium" },
    { id: "13", name: "Express Service", description: "Priority repair service", price: 300, duration: "Half the time", category: "premium" },
    { id: "14", name: "Data Recovery", description: "Recover data from damaged devices", price: 1500, duration: "2-8 hours", category: "premium" }
  ];

  const addToCart = (service: Service) => {
    const existing = cart.find(item => item.service.id === service.id);
    if (existing) {
      setCart(cart.map(item => 
        item.service.id === service.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { service, quantity: 1 }]);
    }
    toast({
      title: "Added to cart",
      description: `${service.name} has been added to your cart`,
    });
  };

  const removeFromCart = (serviceId: string) => {
    setCart(cart.filter(item => item.service.id !== serviceId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.service.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleDeviceSelect = (device: MobileDevice) => {
    setSelectedDevice(device);
    setActiveTab("services");
    toast({
      title: "Device selected",
      description: `${device.brand} ${device.model} selected`,
    });
  };

  const handleBooking = () => {
    if (!selectedDevice || cart.length === 0) {
      toast({
        title: "Incomplete booking",
        description: "Please select a device and add services to cart",
        variant: "destructive"
      });
      return;
    }

    if (!customerInfo.name || !customerInfo.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in your contact details",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the booking data to your backend
    toast({
      title: "Booking confirmed!",
      description: "We'll contact you shortly to confirm the pickup time",
    });

    // Reset form
    setSelectedDevice(null);
    setCart([]);
    setCustomerInfo({
      name: "",
      phone: "",
      email: "",
      address: "",
      description: "",
      pickupPreferred: true
    });
    setActiveTab("device");
  };

  const serviceCategories = [
    { id: "basic", name: "Basic Repairs", description: "Common repair services" },
    { id: "advanced", name: "Advanced Repairs", description: "Complex technical repairs" },
    { id: "accessories", name: "Accessories", description: "Protective accessories" },
    { id: "premium", name: "Premium Services", description: "Special services" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header cartItems={getTotalItems()} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book Your Repair</h1>
          <p className="text-muted-foreground">
            Get your device fixed with our expert technicians. Free pickup & drop in Pune.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="device">1. Select Device</TabsTrigger>
                <TabsTrigger value="services" disabled={!selectedDevice}>2. Choose Services</TabsTrigger>
                <TabsTrigger value="details" disabled={cart.length === 0}>3. Contact Details</TabsTrigger>
              </TabsList>

              <TabsContent value="device" className="space-y-6">
                <MobileSelector onSelect={handleDeviceSelect} />
              </TabsContent>

              <TabsContent value="services" className="space-y-6">
                {selectedDevice && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Selected Device</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {selectedDevice.brand} {selectedDevice.model}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveTab("device")}
                        >
                          Change Device
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                )}

                <div className="space-y-6">
                  {serviceCategories.map(category => (
                    <Card key={category.id}>
                      <CardHeader>
                        <CardTitle>{category.name}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {services
                            .filter(service => service.category === category.id)
                            .map(service => (
                              <Card key={service.id} className="transition-all hover:shadow-md">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold">{service.name}</h4>
                                    <span className="text-lg font-bold text-primary">₹{service.price}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Clock className="h-4 w-4 mr-1" />
                                      {service.duration}
                                    </div>
                                    <Button size="sm" onClick={() => addToCart(service)}>
                                      Add to Cart
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          }
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                      We'll use this information to contact you about your repair
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Pickup Address</Label>
                      <Textarea
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                        placeholder="Enter your complete address for pickup service"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Issue Description</Label>
                      <Textarea
                        id="description"
                        value={customerInfo.description}
                        onChange={(e) => setCustomerInfo({...customerInfo, description: e.target.value})}
                        placeholder="Describe the issues you're facing with your device"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Your Cart ({getTotalItems()})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Your cart is empty. Add some services to get started.
                  </p>
                ) : (
                  <>
                    <div className="space-y-3">
                      {cart.map(item => (
                        <div key={item.service.id} className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.service.name}</h4>
                            <p className="text-xs text-muted-foreground">₹{item.service.price} × {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">₹{item.service.price * item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromCart(item.service.id)}
                              className="h-6 w-6 p-0"
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>₹{getTotalPrice()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Pickup & Drop:</span>
                        <span>FREE</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span>₹{getTotalPrice()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        *Final quote will be provided by technician after device inspection
                      </p>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={handleBooking}
                      disabled={!selectedDevice || cart.length === 0}
                    >
                      Book Repair Service
                    </Button>

                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>Free pickup & drop in Pune</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span>Call support: +91 98765 43210</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRepairPage;