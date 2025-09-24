import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileSelector } from "@/components/MobileSelector";
import { ServicesSelector } from "@/components/booking/ServicesSelector";
import AreaSearch from "@/components/booking/AreaSearch";
import CustomerDetails from "@/components/booking/CustomerDetails";
import BookingCart from "@/components/booking/BookingCart";
import { SelectedDevice } from "@/components/booking/SelectedDevice";
import { TechnicianSuggestions } from "@/components/booking/TechnicianSuggestions";
import { Device, Service, Shop, CustomerInfo } from "@/types/booking";
import { createBooking } from "@/lib/api"; // ✅ Supabase booking API

const BookRepairPage: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [cart, setCart] = useState<Service[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
  };

  const handleServiceAdd = (service: Service) => {
    // ✅ ensure UUID is always stored, not a number
    if (!service.id) {
      console.error("❌ Missing service.id (UUID)");
      return;
    }
    setCart((prev) => [...prev, service]);
  };

  const handleServiceRemove = (serviceId: string) => {
    setCart((prev) => prev.filter((service) => service.id !== serviceId));
  };

  const handleShopSelect = (shop: Shop) => {
    setSelectedShop(shop);
  };

  const updateCustomerInfo = (info: Partial<CustomerInfo>) => {
    setCustomerInfo((prev) => ({ ...prev, ...info }));
  };

  const getTotalItems = () => cart.length;

  const getTotalPrice = () => {
    return cart.reduce((total, service) => total + (service.price || 0), 0);
  };

  const handleBooking = async () => {
    if (!selectedDevice || cart.length === 0) {
      alert("Please select a device and at least one service");
      return;
    }

    if (!selectedShop) {
      alert("Please select a shop");
      return;
    }

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.email || !customerInfo.address) {
      alert("Please fill in all customer details");
      return;
    }

    setIsSubmitting(true);
    try {
      // ✅ Always format services as array of objects with UUIDs
      const formattedServices = cart.map((s) => ({
        service: { id: s.id, price: s.price },
        quantity: s.quantity || 1,
      }));

      const bookingData = {
        customer: customerInfo,
        device: selectedDevice,
        services: formattedServices,
        shopId: selectedShop.id,
        totalAmount: getTotalPrice(),
        pickupPreferred: customerInfo.pickupPreferred || false,
        description: customerInfo.description || "",
      };

      const response = await createBooking(bookingData);
      console.log("✅ Booking created:", response);

      alert("Booking successful!");
      setCart([]);
      setSelectedDevice(null);
      setSelectedShop(null);
      setCustomerInfo({ name: "", phone: "", email: "", address: "" });
    } catch (error: any) {
      console.error("❌ Booking failed:", error);
      alert("Booking failed: " + (error.message || "Unexpected error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="device" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="device">Device</TabsTrigger>
                <TabsTrigger value="services" disabled={!selectedDevice}>
                  Services
                </TabsTrigger>
                <TabsTrigger value="area" disabled={cart.length === 0}>
                  Area
                </TabsTrigger>
                <TabsTrigger value="details" disabled={!selectedShop}>
                  Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="device" className="space-y-6">
                <MobileSelector onDeviceSelect={handleDeviceSelect} />
                {selectedDevice && <SelectedDevice device={selectedDevice} />}
              </TabsContent>

              <TabsContent value="services" className="space-y-6">
                <ServicesSelector selectedDevice={selectedDevice} onServiceAdd={handleServiceAdd} />
                {selectedShop && <TechnicianSuggestions shop={selectedShop} />}
              </TabsContent>

              <TabsContent value="area" className="space-y-6">
                <AreaSearch onShopSelect={handleShopSelect} />
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <CustomerDetails customerInfo={customerInfo} onUpdate={updateCustomerInfo} />
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
