import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MobileSelector } from '@/components/MobileSelector';
import { ServicesSelector } from '@/components/booking/ServicesSelector';
import { AreaSearch } from '@/components/booking/AreaSearch';
import { CustomerDetails } from '@/components/booking/CustomerDetails';
import { BookingCart } from '@/components/booking/BookingCart';
import { SelectedDevice } from '@/components/booking/SelectedDevice';
import { TechnicianSuggestions } from '@/components/booking/TechnicianSuggestions';
import { Device, Service, Shop, CustomerInfo } from '@/types/booking';

const BookRepairPage: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [cart, setCart] = useState<Service[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
  };

  const handleServiceAdd = (service: Service) => {
    setCart(prev => [...prev, service]);
  };

  const handleServiceRemove = (serviceId: string) => {
    setCart(prev => prev.filter(service => service.id !== serviceId));
  };

  const handleShopSelect = (shop: Shop) => {
    setSelectedShop(shop);
  };

  const updateCustomerInfo = (info: Partial<CustomerInfo>) => {
    setCustomerInfo(prev => ({ ...prev, ...info }));
  };

  const getTotalItems = () => cart.length;

  const getTotalPrice = () => {
    return cart.reduce((total, service) => total + service.price, 0);
  };

  const handleBooking = async () => {
    setIsSubmitting(true);
    try {
      // Handle booking logic here
      console.log('Booking submitted:', {
        device: selectedDevice,
        services: cart,
        shop: selectedShop,
        customer: customerInfo
      });
    } catch (error) {
      console.error('Booking failed:', error);
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
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="area">Area</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="device" className="space-y-6">
                <MobileSelector onDeviceSelect={handleDeviceSelect} />
                {selectedDevice && (
                  <SelectedDevice device={selectedDevice} />
                )}
              </TabsContent>
              
              <TabsContent value="services" className="space-y-6">
                <ServicesSelector
                  selectedDevice={selectedDevice}
                  onServiceAdd={handleServiceAdd}
                />
                {selectedShop && (
                  <TechnicianSuggestions shop={selectedShop} />
                )}
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