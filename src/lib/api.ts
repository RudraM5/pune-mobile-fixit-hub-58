// src/lib/api.ts
// Supabase-only API with validation fixes: safe number conversion, empty string → null, recomputed totals.

import { z } from "zod";

// Supabase client initialization
let supabase: any;
async function getSupabaseClient() {
  if (!supabase) {
    const { supabase: client } = await import("@/integrations/supabase/client");
    supabase = client;
  }
  return supabase;
}

// Types
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

// Zod schema
const bookingValidationSchema = z.object({
  customer: z.object({
    name: z.string().min(1, "Customer name is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    email: z.string().email("Invalid email").optional().nullable(),
    address: z.string().optional().nullable(),
    pickupPreferred: z.boolean().optional().default(false),
    description: z.string().optional().nullable(),
  }),
  device: z.object({
    brand: z.string().min(1, "Device brand is required"),
    model: z.string().min(1, "Device model is required"),
  }),
  services: z.array(
    z.object({
      id: z.union([z.string(), z.number()]),
      name: z.string().min(1),
      price: z.number().nonnegative(),
      quantity: z.number().int().min(1),
    })
  ).min(1, "At least one service must be selected"),
  shopId: z.number().int().positive("Shop ID is required"),
  totalAmount: z.number().nonnegative(),
  userId: z.string().optional().nullable(),
});

// Error handler
export function handleSupabaseError(err: any): string {
  console.error("Supabase Error:", err);
  let userMessage = err.message || "Unexpected error occurred.";
  switch (err.code) {
    case "23502":
      userMessage = "Missing required information.";
      break;
    case "42501":
      userMessage = "Permission denied.";
      break;
    case "23503":
      userMessage = "Invalid selection (shop or service not found).";
      break;
    case "22P02":
      userMessage = "Invalid data format.";
      break;
    case "P0001":
      userMessage = "Booking validation failed.";
      break;
  }
  return userMessage;
}

// Get services
export async function getServices() {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, name, description, price, duration, category_id, is_active")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) throw new Error(handleSupabaseError(error));
  return data || [];
}

// Get shops
export async function getShops() {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("shops")
    .select("id, name, address, phone, rating, is_active, location_lat, location_lng")
    .eq("is_active", true)
    .order("rating", { ascending: false });

  if (error) throw new Error(handleSupabaseError(error));
  return data || [];
}

// Create booking
export async function createBooking(rawData: BookingData) {
  const supabase = await getSupabaseClient();

  try {
    // Clean + normalize payload
    const cleaned: BookingData = {
      ...rawData,
      customer: {
        ...rawData.customer,
        email: rawData.customer.email?.trim() || null,
        address: rawData.customer.address?.trim() || null,
        description: rawData.customer.description?.trim() || null,
      },
      services: rawData.services.map((s) => ({
        ...s,
        price: isNaN(Number(s.price)) ? 0 : Number(s.price),
        quantity: isNaN(Number(s.quantity)) ? 1 : Number(s.quantity),
      })),
      shopId: isNaN(Number(rawData.shopId))
        ? (() => {
            throw new Error("Shop ID is required and must be a number");
          })()
        : Number(rawData.shopId),
      // Always recompute total from services
      totalAmount: rawData.services.reduce((sum, s) => {
        const price = isNaN(Number(s.price)) ? 0 : Number(s.price);
        const qty = isNaN(Number(s.quantity)) ? 1 : Number(s.quantity);
        return sum + price * qty;
      }, 0),
    };

    console.log("Booking payload before validation:", cleaned);

    const validatedData = bookingValidationSchema.parse(cleaned);

    const mainPayload = {
      customer_name: validatedData.customer.name,
      customer_phone: validatedData.customer.phone,
      customer_email: validatedData.customer.email,
      customer_address: validatedData.customer.address,
      device_brand: validatedData.device.brand,
      device_model: validatedData.device.model,
      issue_description: validatedData.customer.description,
      total_amount: validatedData.totalAmount,
      user_id: validatedData.userId || null,
      status: "pending",
      priority: "medium",
      payment_status: "pending",
      payment_method: "online",
      pickup_preferred: validatedData.customer.pickupPreferred || false,
      pickup_address: validatedData.customer.pickupPreferred
        ? validatedData.customer.address
        : null,
      shop_id: validatedData.shopId,
      assigned_technician_id: null,
      estimated_completion: null,
      notes: null,
    };

    const { data: requestData, error: insertError } = await supabase
      .from("repair_requests")
      .insert([mainPayload])
      .select("id")
      .single();

    if (insertError) throw insertError;

    const bookingId = requestData.id;

    // Insert services
    if (validatedData.services?.length > 0) {
      const serviceInserts = validatedData.services.map((s) => ({
        repair_request_id: bookingId,
        service_id: s.id,
        quantity: s.quantity,
        unit_price: s.price,
        total_price: s.price * s.quantity,
      }));

      const { error: serviceError } = await supabase
        .from("repair_request_services")
        .insert(serviceInserts);

      if (serviceError) {
        await supabase.from("repair_requests").delete().eq("id", bookingId);
        throw serviceError;
      }
    }

    // Clear cart if logged in
    if (validatedData.userId) {
      await supabase.from("cart_items").delete().eq("user_id", validatedData.userId);
    }

    return { bookingId };
  } catch (error: any) {
    if (error.name === "ZodError") {
      console.error("Validation failed:", error.errors);
      throw new Error(
        "Validation failed: " + error.errors.map((e: any) => e.message).join(", ")
      );
    }
    throw new Error(handleSupabaseError(error));
  }
}

// Contact form
export async function contactUs(data: any) {
  const supabase = await getSupabaseClient();
  const { data: contactData, error } = await supabase
    .from("contacts")
    .insert([{ name: data.name, email: data.email, message: data.message }])
    .select("id")
    .single();

  if (error) throw new Error(handleSupabaseError(error));
  return contactData || { success: true };
}
