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
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { MobileDevice } from "@/types/booking";

const BookRepairPage = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [selectedDevice, setSelectedDevice] = useState<MobileDevice | null>(null);
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

  const handleBooking = async () => {
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

    setIsSubmitting(true);

    try {
      // First, ensure the customer exists or create one
      let customerId: string;
      
      if (isAuthenticated && user) {
        // Check if customer record exists for this user
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          // Create new customer record
          const { data: newCustomer, error: customerError } = await supabase
            .from('customers')
            .insert({
              user_id: user.id,
              name: customerInfo.name,
              phone: customerInfo.phone,
              email: customerInfo.email,
              address: customerInfo.address
            })
            .select('id')
            .single();

          if (customerError) throw customerError;
          customerId = newCustomer.id;
        }
      } else {
        // Create guest customer record
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            name: customerInfo.name,
            phone: customerInfo.phone,
            email: customerInfo.email,
            address: customerInfo.address
          })
          .select('id')
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }

      // Find the device in the database
      const { data: device, error: deviceError } = await supabase
        .from('devices')
        .select('id')
        .eq('brand', selectedDevice.brand)
        .eq('model', selectedDevice.model)
        .single();

      if (deviceError || !device) {
        // Create the device if it doesn't exist
        const { data: newDevice, error: newDeviceError } = await supabase
          .from('devices')
          .insert({
            brand: selectedDevice.brand,
            model: selectedDevice.model,
            category: 'smartphone'
          })
          .select('id')
          .single();

        if (newDeviceError) throw newDeviceError;
        device.id = newDevice.id;
      }

      // Create the repair request
      const totalAmount = getTotalPrice();
      const estimatedCompletion = new Date();
      estimatedCompletion.setHours(estimatedCompletion.getHours() + 24); // 24 hours from now

      const { data: repairRequest, error: repairError } = await supabase
        .from('repair_requests')
        .insert({
          customer_id: customerId,
          device_id: device.id,
          status: 'pending',
          priority: 'medium',
          description: `Repair request for ${selectedDevice.brand} ${selectedDevice.model}`,
          estimated_completion: estimatedCompletion.toISOString(),
          total_amount: totalAmount
        })
        .select('id')
        .single();

      if (repairError) throw repairError;

      // Add services to the repair request
      const serviceInserts = await Promise.all(
        cart.map(async (cartItem) => {
          // Find the service in database
          const { data: service } = await supabase
            .from('services')
            .select('id')
            .eq('name', cartItem.service.name)
            .single();

          if (service) {
            return {
              repair_request_id: repairRequest.id,
              service_id: service.id,
              quantity: cartItem.quantity,
              price: cartItem.service.price
            };
          }
          return null;
        })
      );

      const validServiceInserts = serviceInserts.filter(Boolean);
      
      if (validServiceInserts.length > 0) {
        const { error: servicesError } = await supabase
          .from('repair_request_services')
          .insert(validServiceInserts);

        if (servicesError) throw servicesError;
      }

      // Create initial status update
      await supabase
        .from('status_updates')
        .insert({
          repair_request_id: repairRequest.id,
          old_status: null,
          new_status: 'pending',
          message: 'Repair request submitted successfully',
          created_by: user?.id || null
        });

      toast({
        title: "Booking confirmed!",
        description: `Request #${repairRequest.id.substring(0, 8)} created. We'll contact you shortly.`,
      });

      // Reset form
      setSelectedDevice(null);
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
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRepairPage;