
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import MobileSelector from "@/components/MobileSelector";
import SelectedDevice from "@/components/booking/SelectedDevice";
import ServicesSelector from "@/components/booking/ServicesSelector";
import CustomerDetails from "@/components/booking/CustomerDetails";
import BookingCart from "@/components/booking/BookingCart";
import TechnicianSuggestions from "@/components/booking/TechnicianSuggestions";
import { useBookingCart } from "@/hooks/useBookingCart";
import { useCustomerInfo } from "@/hooks/useCustomerInfo";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { MobileDevice, Service } from "@/types/booking";
import { EnhancedTechnician } from "@/types/shop";
import { sendWhatsAppConfirmation, sendWhatsAppToShop } from "@/utils/whatsappService";

const BookRepairPage = () => {
  const { toast } = useToast();
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
    toast({
      title: "Technician selected",
      description: `${technician.name} from ${technician.shop?.name} selected`,
    });
  };

  const handleBooking = async () => {
    if (!selectedDevice || cart.length === 0) {
      toast({
        title: "Incomplete booking",
        description: "Please select a device and add services to cart",
        variant: "destructive"
      });
      return;
    }

    if (!selectedTechnician) {
      toast({
        title: "Select technician",
        description: "Please select a technician to proceed",
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

    setIsSubmitting(true);

    try {
      // Generate a mock booking ID for demo purposes
      const bookingId = `MR${Date.now().toString().slice(-6)}`;
      const totalAmount = getTotalPrice();
      const estimatedCompletion = new Date();
      estimatedCompletion.setHours(estimatedCompletion.getHours() + 24);

      // Prepare booking details for WhatsApp
      const bookingDetails = {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        deviceBrand: selectedDevice.brand,
        deviceModel: selectedDevice.model,
        services: cart.map(item => item.service.name),
        technicianName: selectedTechnician.name,
        shopName: selectedTechnician.shop?.name || 'Mobile Repair Shop',
        shopPhone: selectedTechnician.shop?.phone || '+91-9876543210',
        totalAmount,
        bookingId,
        estimatedCompletion: estimatedCompletion.toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      // Simulate booking creation (since no database is connected)
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Booking confirmed!",
        description: `Request #${bookingId} assigned to ${selectedTechnician.name}. WhatsApp confirmations are being sent.`,
      });

      // Send WhatsApp confirmations
      try {
        await sendWhatsAppConfirmation(bookingDetails);
        await sendWhatsAppToShop(bookingDetails);
        
        toast({
          title: "Confirmations sent",
          description: "WhatsApp confirmations sent to you and the shop",
        });
      } catch (error) {
        console.error('Error sending WhatsApp confirmations:', error);
        toast({
          title: "Booking confirmed",
          description: "Booking successful! Shop will be notified shortly.",
          variant: "default"
        });
      }

      // Reset form
      setSelectedDevice(null);
      setSelectedServices([]);
      setSelectedTechnician(null);
      clearCart();
      resetCustomerInfo();
      setActiveTab("device");

    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive"
      });
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="device">1. Select Device</TabsTrigger>
                <TabsTrigger value="services" disabled={!selectedDevice}>2. Choose Services</TabsTrigger>
                <TabsTrigger value="technician" disabled={cart.length === 0}>3. Select Technician</TabsTrigger>
                <TabsTrigger value="details" disabled={!selectedTechnician}>4. Contact Details</TabsTrigger>
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
                  onProceedToDetails={() => setActiveTab("technician")}
                  hasItemsInCart={cart.length > 0}
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
