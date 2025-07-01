
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import MobileSelector from "@/components/MobileSelector";
import SelectedDevice from "@/components/booking/SelectedDevice";
import ServicesSelector from "@/components/booking/ServicesSelector";
import CustomerDetails from "@/components/booking/CustomerDetails";
import BookingCart from "@/components/booking/BookingCart";
import TechnicianSuggestions from "@/components/booking/TechnicianSuggestions";
import AreaSearch from "@/components/booking/AreaSearch";
import { useCart } from "@/contexts/CartContext";
import { useCustomerInfo } from "@/hooks/useCustomerInfo";
import { useAuth } from "@/contexts/AuthContext";
import { MobileDevice, Service } from "@/types/booking";
import { EnhancedTechnician } from "@/types/shop";

const BookRepairPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedDevice, setSelectedDevice] = useState<MobileDevice | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<EnhancedTechnician | null>(null);
  const [customerArea, setCustomerArea] = useState("Pune Center");
  const [activeTab, setActiveTab] = useState("device");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    cart,
    addToCart,
    removeFromCart,
    getTotalPrice,
    getTotalItems,
    clearCart
  } = useCart();

  const {
    customerInfo,
    updateCustomerInfo,
    resetCustomerInfo,
    isValid: isCustomerInfoValid
  } = useCustomerInfo();

  const handleDeviceSelect = (device: MobileDevice) => {
    setSelectedDevice(device);
    setActiveTab("services");
    console.log(`${device.brand} ${device.model} selected`);
  };

  const handleServiceAdd = (service: Service) => {
    addToCart(service);
    setSelectedServices(prev => [...prev, service]);
  };

  const handleServiceRemove = (serviceId: string) => {
    removeFromCart(serviceId);
    setSelectedServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const handleTechnicianSelect = (technician: EnhancedTechnician) => {
    setSelectedTechnician(technician);
    setActiveTab("details");
    console.log(`${technician.name} from ${technician.shop?.name} selected`);
  };

  const handleBooking = async () => {
    if (!selectedDevice || cart.length === 0) {
      console.log("Please select a device and add services to cart");
      return;
    }

    if (!selectedTechnician) {
      console.log("Please select a technician to proceed");
      return;
    }

    if (!isCustomerInfoValid()) {
      console.log("Please fill in your contact details");
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate a mock booking ID for demo purposes
      const bookingId = `MR${Date.now().toString().slice(-6)}`;
      const totalAmount = getTotalPrice();

      // Simulate booking creation
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log(`Booking confirmed! Request #${bookingId} assigned to ${selectedTechnician.name}`);

      // Reset form
      setSelectedDevice(null);
      setSelectedServices([]);
      setSelectedTechnician(null);
      clearCart();
      resetCustomerInfo();
      setActiveTab("device");

    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header cartItems={getTotalItems()} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Connect with Expert Technicians</h1>
          <p className="text-muted-foreground">
            Find local mobile repair experts in Pune. Get your device fixed by certified technicians.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="device">1. Device</TabsTrigger>
                <TabsTrigger value="services" disabled={!selectedDevice}>2. Services</TabsTrigger>
                <TabsTrigger value="area" disabled={cart.length === 0}>3. Search Area</TabsTrigger>
                <TabsTrigger value="technician" disabled={cart.length === 0}>4. Technician</TabsTrigger>
                <TabsTrigger value="details" disabled={!selectedTechnician}>5. Details</TabsTrigger>
              </TabsList>

              <TabsContent value="device" className="space-y-6">
                <MobileSelector onSelect={handleDeviceSelect} />
              </TabsContent>

              <TabsContent value="services" className="space-y-6">
                {selectedDevice && (
                  <SelectedDevice 
                    device={selectedDevice} 
                    onChangeDevice={() => setActiveTab("device")} 
                  />
                )}
                <ServicesSelector 
                  onAddToCart={handleServiceAdd}
                  onProceedToDetails={() => setActiveTab("area")}
                  hasItemsInCart={cart.length > 0}
                />
              </TabsContent>

              <TabsContent value="area" className="space-y-6">
                <AreaSearch 
                  onTechnicianSelect={(technician, shop) => {
                    const enhancedTechnician = {
                      ...technician,
                      shop_id: shop.id,
                      shop: shop,
                      area: shop.area,
                      hourly_rate: 300,
                      is_active: true,
                      user_id: technician.id,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString()
                    };
                    handleTechnicianSelect(enhancedTechnician);
                  }}
                />
              </TabsContent>

              <TabsContent value="technician" className="space-y-6">
                <TechnicianSuggestions
                  selectedServices={selectedServices}
                  customerArea={customerArea}
                  onSelectTechnician={handleTechnicianSelect}
                />
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <CustomerDetails 
                  customerInfo={customerInfo}
                  onUpdate={updateCustomerInfo}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <BookingCart
              cart={cart}
              totalItems={getTotalItems()}
              totalPrice={getTotalPrice()}
              selectedDevice={selectedDevice}
              selectedTechnician={selectedTechnician}
              onRemoveFromCart={handleServiceRemove}
              onBooking={handleBooking}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRepairPage;
