import { useState } from "react";
import { createBooking } from "@/lib/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BookRepairPage() {
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [customerInfo, setCustomerInfo] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const isCustomerInfoValid = () =>
    customerInfo?.name &&
    customerInfo?.phone &&
    customerInfo?.email &&
    customerInfo?.address;

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

      const data = await createBooking(bookingData);
      console.log("✅ Booking created:", data);

      alert("Booking successful!");
      setCart([]);
      setSelectedDevice(null);
      setSelectedShop(null);
      setCustomerInfo({});
    } catch (err: any) {
      console.error("Booking failed:", err);
      alert("Booking failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Steps */}
      <div className="lg:col-span-2">
        <Tabs defaultValue="device">
          <TabsList className="mb-4">
            <TabsTrigger value="device">Device</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="shop">Shop</TabsTrigger>
            <TabsTrigger value="customer">Customer Info</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          <TabsContent value="device">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-2">Select Device</h2>
                {/* Replace with dropdowns / selectors */}
                <Input
                  placeholder="Device Brand"
                  onChange={(e) =>
                    setSelectedDevice({
                      ...selectedDevice,
                      brand: e.target.value,
                    })
                  }
                  className="mb-2"
                />
                <Input
                  placeholder="Device Model"
                  onChange={(e) =>
                    setSelectedDevice({
                      ...selectedDevice,
                      model: e.target.value,
                    })
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-2">Select Services</h2>
                {/* Replace with dynamic service list */}
                <Button
                  onClick={() =>
                    setCart([...cart, { id: "screen", name: "Screen Repair", price: 2000, quantity: 1 }])
                  }
                >
                  Add Screen Repair
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shop">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-2">Select Shop</h2>
                <Button
                  onClick={() => setSelectedShop({ id: "shop123", name: "Repair Hub" })}
                >
                  Choose Repair Hub
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customer">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-2">Your Details</h2>
                <Input
                  placeholder="Name"
                  className="mb-2"
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Phone"
                  className="mb-2"
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, phone: e.target.value })
                  }
                />
                <Input
                  placeholder="Email"
                  className="mb-2"
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, email: e.target.value })
                  }
                />
                <Input
                  placeholder="Address"
                  className="mb-2"
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, address: e.target.value })
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="review">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">Review & Confirm</h2>
                <p><b>Device:</b> {selectedDevice?.brand} {selectedDevice?.model}</p>
                <p><b>Shop:</b> {selectedShop?.name}</p>
                <p><b>Total:</b> ₹{getTotalPrice()}</p>
                <Button
                  className="mt-4 w-full"
                  disabled={isSubmitting}
                  onClick={handleBooking}
                >
                  {isSubmitting ? "Booking..." : "Confirm Booking"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Cart Sidebar */}
      <div>
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Your Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500">No services added yet.</p>
            ) : (
              <ul className="mb-4">
                {cart.map((item, idx) => (
                  <li key={idx} className="flex justify-between mb-2">
                    <span>
                      {item.name} x{item.quantity || 1}
                    </span>
                    <span>₹{item.price}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="font-semibold">Total: ₹{getTotalPrice()}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
