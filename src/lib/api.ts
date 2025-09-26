import { supabase } from '@/integrations/supabase/client';
import { 
  getServices as getServicesFromSupabase,
  getShops as getShopsFromSupabase,
  createRepairRequest,
  addRepairRequestServices,
  submitContactForm
} from './supabase';

export interface BookingData {
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    pickupPreferred?: boolean;
    description?: string;
  };
  device: {
    brand: string;
    model: string;
  };
  services: Array<{
    id: string | number;
    name: string;
    price: number | string;
    quantity?: number | string;
  }>;
  shopId: string | number;
  totalAmount: number | string;
  userId?: string | null;
}

export async function getServices() {
  return await getServicesFromSupabase();
}

export async function getShops() {
  return await getShopsFromSupabase();
}

export async function createBooking(rawData: BookingData) {
  try {
    // Validate required fields
    if (!rawData.customer.name || !rawData.customer.phone) {
      throw new Error("Customer name and phone are required");
    }
    if (!rawData.device.brand || !rawData.device.model) {
      throw new Error("Device brand and model are required");
    }
    if (!rawData.services || rawData.services.length === 0) {
      throw new Error("At least one service must be selected");
    }

    // Calculate total amount from services
    const totalAmount = rawData.services.reduce((sum, service) => {
      const price = typeof service.price === 'string' ? parseFloat(service.price) : service.price;
      const quantity = typeof service.quantity === 'string' ? parseInt(service.quantity) : (service.quantity || 1);
      return sum + (price * quantity);
    }, 0);

    // Create repair request
    const repairRequestData = {
      customer_name: rawData.customer.name,
      customer_phone: rawData.customer.phone,
      customer_email: rawData.customer.email || null,
      customer_address: rawData.customer.address || null,
      device_brand: rawData.device.brand,
      device_model: rawData.device.model,
      issue_description: rawData.customer.description || null,
      total_amount: totalAmount,
      user_id: rawData.userId || null,
      status: "pending",
      priority: "medium",
      payment_status: "pending",
      payment_method: "online",
      pickup_preferred: rawData.customer.pickupPreferred || false,
      pickup_address: rawData.customer.pickupPreferred ? rawData.customer.address : null,
      shop_id: rawData.shopId
    };

    const repairRequest = await createRepairRequest(repairRequestData);

    // Add services to repair request
    await addRepairRequestServices(repairRequest.id, rawData.services);

    // Clear user's cart if logged in
    if (rawData.userId) {
      await supabase.from("cart_items").delete().eq("user_id", rawData.userId);
    }

    return { bookingId: repairRequest.id };
  } catch (error: any) {
    console.error("Booking creation error:", error);
    throw new Error(error.message || "Failed to create booking");
  }
}

export async function contactUs(data: any) {
  return await submitContactForm(data);
}
