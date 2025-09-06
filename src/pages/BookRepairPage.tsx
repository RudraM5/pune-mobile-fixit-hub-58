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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

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
      alert("Please select a device and add services to cart");
      return;
    }

    if (!selectedShop) {
      alert("Please select a shop to proceed");
      return;
    }

    if (!isCustomerInfoValid()) {
      alert("Please fill in your contact details");
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        customer: customerInfo,
        device: selectedDevice,
        services: cart,
        shopId: selectedShop.id, // Ensure your shop has an ID field
        totalAmount: getTotalPrice(),
        pickupPreferred: customerInfo.pickupPreferred || false,
        description: customerInfo.notes || "",
      };

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Booking failed");
      }

      console.log("✅ Booking created:", data);

      clearCart();
      resetCustomerInfo();

      navigate("/checkout", { state: { bookingId: data.bookingId } });
    } catch (error: any) {
      console.error("❌ Booking error:", error);
      alert(error.message || "Something went wrong while creating booking");
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

          {/* Cart Sidebar */}
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
