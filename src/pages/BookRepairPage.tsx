import { useState } from "react";
import { createBooking } from "@/lib/api";

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
      // ✅ Services array format
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Book Repair</h1>

        {/* Customer inputs */}
        <input
          type="text"
          placeholder="Name"
          className="border p-2 mb-2 block w-full rounded"
          onChange={(e) =>
            setCustomerInfo({ ...customerInfo, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Phone"
          className="border p-2 mb-2 block w-full rounded"
          onChange={(e) =>
            setCustomerInfo({ ...customerInfo, phone: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 mb-2 block w-full rounded"
          onChange={(e) =>
            setCustomerInfo({ ...customerInfo, email: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Address"
          className="border p-2 mb-2 block w-full rounded"
          onChange={(e) =>
            setCustomerInfo({ ...customerInfo, address: e.target.value })
          }
        />

        {/* Submit button */}
        <button
          onClick={handleBooking}
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4 w-full"
        >
          {isSubmitting ? "Booking..." : "Book Repair"}
        </button>
      </div>
    </div>
  );
}
