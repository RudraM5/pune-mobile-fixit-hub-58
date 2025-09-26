import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import MobileSelector from "@/components/MobileSelector";
import SelectedDevice from "@/components/booking/SelectedDevice";
import ServicesSelector from "@/components/booking/ServicesSelector";
import CustomerDetails from "@/components/booking/CustomerDetails";
import BookingCart from "@/components/booking/BookingCart";
import AreaSearch from "@/components/booking/AreaSearch";
import { useCart } from "@/contexts/CartContext";
import { useCustomerInfo } from "@/hooks/useCustomerInfo";
import { useAuth } from "@/contexts/AuthContext";
import { MobileDevice, Service } from "@/types/booking";
import { createBooking } from "@/lib/api";

const BookRepairPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDevice, setSelectedDevice] = useState<MobileDevice | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedShop, setSelectedShop] = useState<any>(null);
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
  };

  const handleServiceAdd = (service: Service) => {
    addToCart(service);
    setSelectedServices(prev => [...prev, service]);

    if (cart.length === 0) {
      setTimeout(() => {
        setActiveTab("area");
      }, 500);
    }
  };

  const handleServiceRemove = (serviceId: string) => {
    removeFromCart(serviceId);
    setSelectedServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const handleShopSelect = (shop: any) => {
    setSelectedShop(shop);
    setActiveTab("details");
  };

  const handleBooking = async () => {
    if (!selectedDevice || cart.length === 0) {
      alert("Please select a device and add services to the cart.");
      return;
    }

    if (!selectedShop) {
      alert("Please select a shop to proceed.");
      return;
    }

    if (!isCustomerInfoValid()) {
      alert("Please fill in all required contact details.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a flat payload object that matches your 'repair_requests' table schema
      const bookingPayload = {
        // Customer Info
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_email: customerInfo.email,
        customer_address: customerInfo.address || null,

        // Device Info
        device_brand: selectedDevice.brand,
        device_model: selectedDevice.model,

        // Booking Details
        issue_description: customerInfo.description || "",
        total_amount: getTotalPrice(),
        shop_id: selectedShop.id,
        pickup_preferred: customerInfo.pickupPreferred || false,
        user_id: user ? user.id : null,

        // Pass services separately for the backend to process
        services: cart.map(item => ({
          service_id: item.id,
          quantity: item.quantity || 1,
          unit_price: item.price
        }))
      };

      const data = await createBooking(bookingPayload);
      console.log("✅ Booking created:", data);

      // --- The rest of your payment logic remains the same ---
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: getTotalPrice(),
          currency: 'INR',
          receipt: `booking_${data.bookingId}`,
          bookingId: data.bookingId
        }
      });

      if (paymentError) {
        console.error("Payment error:", paymentError);
        alert("Booking created but payment setup failed. Please contact support.");
        return;
      }
      
      const options = {
        key: paymentData.key_id,
        amount: paymentData.order.amount,
        currency: paymentData.order.currency,
        name: "Mobile Repair Wala",
        description: `Payment for repair booking #${data.bookingId}`,
        order_id: paymentData.order.id,
        handler: function (response: any) {
          console.log("Payment successful:", response);
          clearCart();
          resetCustomerInfo();
          alert("Payment successful! Your booking has been confirmed.");
          navigate("/", { replace: true });
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone
        },
        theme: {
          color: "#3B82F6"
        }
      };

      if (!(window as any).Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }

    } catch (error: any) {
      console.error("❌ Booking submission error:", error);
      alert("Failed to create booking: " + error.message);
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
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="device">1. Device</TabsTrigger>
                <TabsTrigger value="services" disabled={!selectedDevice}>2. Services</TabsTrigger>
                <TabsTrigger value="area" disabled={cart.length === 0}>3. Select Shop</TabsTrigger>
                <TabsTrigger value="details" disabled={!selectedShop}>4. Details</TabsTrigger>
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
                <AreaSearch onShopSelect={handleShopSelect} />
              </TabsContent>
              <TabsContent value="details" className="space-y-6">
                <CustomerDetails
                  customerInfo={customerInfo}
                  onUpdate={updateCustomerInfo}
                />
              </TabsContent>
            </Tabs>
          </div>
          <div className="lg:col-span-1">
            <BookingCart
              cart={cart}
              totalItems={getTotalItems()}
              totalPrice={getTotalPrice()}
              selectedDevice={selectedDevice}
              selectedShop={selectedShop}
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
