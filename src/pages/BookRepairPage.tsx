import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import MobileSelector from "@/components/MobileSelector";
import SelectedDevice from "@/components/booking/SelectedDevice";
import ServicesSelector from "@/components/booking/ServicesSelector";
import CustomerDetails from "@/components/booking/CustomerDetails";
import BookingCart from "@/components/booking/BookingCart";
import { useBookingCart } from "@/hooks/useBookingCart";
import { useCustomerInfo } from "@/hooks/useCustomerInfo";
import { useToast } from "@/hooks/use-toast";
import { MobileDevice } from "@/types/booking";

const BookRepairPage = () => {
  const { toast } = useToast();
  const [selectedDevice, setSelectedDevice] = useState<MobileDevice | null>(null);
  const [activeTab, setActiveTab] = useState("device");
  
  const {
    cart,
    addToCart,
    removeFromCart,
    getTotalPrice,
    getTotalItems,
    clearCart
  } = useBookingCart();

  const {
    customerInfo,
    updateCustomerInfo,
    resetCustomerInfo,
    isValid: isCustomerInfoValid
  } = useCustomerInfo();

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

    if (!isCustomerInfoValid()) {
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
    clearCart();
    resetCustomerInfo();
    setActiveTab("device");
  };

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
                  <SelectedDevice 
                    device={selectedDevice} 
                    onChangeDevice={() => setActiveTab("device")} 
                  />
                )}
                <ServicesSelector onAddToCart={addToCart} />
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
              onRemoveFromCart={removeFromCart}
              onBooking={handleBooking}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRepairPage;