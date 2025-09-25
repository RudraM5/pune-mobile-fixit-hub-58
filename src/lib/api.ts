// src/lib/api.ts
// Supabase-only API: Handles bookings, services, shops, and contacts with bigint IDs.
// No Render dependency, aligned to your Supabase schema.

import { z } from "zod";

// Lazy Supabase import (Lovable/React integration)
let supabase: any;
async function getSupabaseClient() {
  if (!supabase) {
    const { supabase: client } = await import("@/integrations/supabase/client");
    supabase = client;
  }
  return supabase;
}

// ----------------- Types -----------------
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
    id: number; // bigint from Supabase
    name: string;
    price: number;
    quantity?: number;
  }>;
  shopId: number; // bigint from Supabase
  totalAmount: number;
  userId?: string | null; // UUID if logged in
}

// ----------------- Validation -----------------
const bookingValidationSchema = z
  .object({
    customer: z.object({
      name: z.string().min(1, "Customer name is required"),
      phone: z.string().min(10, "Valid phone number is required"),
      email: z.string().email("Invalid email").optional(),
      address: z.string().optional(),
      pickupPreferred: z.boolean().optional().default(false),
      description: z.string().optional(),
    }),
    device: z.object({
      brand: z.string().min(1, "Device brand (e.g., Apple) is required"),
      model: z.string().min(1, "Device model (e.g., iPhone 14) is required"),
    }),
    services: z
      .array(
        z.object({
          id: z.number(), // bigint, required
          name: z.string().min(1),
          price: z.number().positive("Service price must be positive"),
          quantity: z.number().int().min(1).default(1),
        })
      )
      .min(1, "At least one service must be selected"),
    shopId: z.number(), // bigint
    totalAmount: z.number().positive("Total amount must be greater than 0"),
    userId: z.string().uuid().optional().or(z.null()),
  })
  .transform((validatedData) => {
    // Check computed total vs provided total
    const computedTotal = validatedData.services.reduce((sum, service) => {
      return sum + service.price * service.quantity;
    }, 0);

    if (Math.abs(computedTotal - validatedData.totalAmount) > 0.01) {
      throw new Error("Total amount does not match selected services");
    }

    return validatedData;
  });

// ----------------- Error Handler -----------------
export function handleSupabaseError(err: any): string {
  console.error("Supabase Error Details:", {
    code: err.code,
    message: err.message,
    details: err.details,
    hint: err.hint,
  });

  let userMessage = err.message || "Unexpected error during operation.";

  switch (err.code) {
    case "23502": // not null violation
      userMessage =
        "Missing required information. Please check all required fields.";
      break;
    case "42501": // RLS
      userMessage = "Permission denied. Please log in and try again.";
      break;
    case "23503": // foreign key
      userMessage = "Invalid shop or service. Please select valid options.";
      break;
    case "22P02": // invalid data type
      userMessage = "Invalid data format. Please verify your selections.";
      break;
    case "P0001": // custom constraint
      userMessage = "Booking validation failed. Please review your booking.";
      break;
    case "400":
      userMessage = "Invalid form data. Please fill all required fields.";
      break;
    default:
      if (err.message?.includes("total_amount")) {
        userMessage =
          "Total amount mismatch. Please recheck selected services.";
      }
  }

  return userMessage;
}

// ----------------- API Functions -----------------

// Get active services
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

// Get active shops
export async function getShops() {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("shops")
    .select(
      "id, name, address, phone, rating, is_active, location_lat, location_lng"
    )
    .eq("is_active", true)
    .order("rating", { ascending: false });

  if (error) throw new Error(handleSupabaseError(error));
  return data || [];
}

// Create booking (direct insert into repair_requests & repair_request_services)
export async function createBooking(data: BookingData) {
  const supabase = await getSupabaseClient();

  try {
    const validatedData = bookingValidationSchema.parse(data);

    // 1. Insert main booking
    const mainPayload = {
      customer_name: validatedData.customer.name,
      customer_phone: validatedData.customer.phone,
      customer_email: validatedData.customer.email || null,
      customer_address: validatedData.customer.address || null,
      device_brand: validatedData.device.brand,
      device_model: validatedData.device.model,
      issue_description: validatedData.customer.description || null,
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

    // 2. Insert services
    if (validatedData.services.length > 0) {
      const serviceInserts = validatedData.services.map((service) => ({
        repair_request_id: bookingId,
        service_id: service.id,
        quantity: service.quantity,
        unit_price: service.price,
        total_price: service.price * service.quantity,
      }));

      const { error: serviceError } = await supabase
        .from("repair_request_services")
        .insert(serviceInserts);

      if (serviceError) {
        // Rollback
        await supabase.from("repair_requests").delete().eq("id", bookingId);
        throw serviceError;
      }
    }

    // 3. Optional: Clear cart
    if (validatedData.userId) {
      await supabase.from("cart_items").delete().eq("user_id", validatedData.userId);
    }

    return { bookingId };
  } catch (error: any) {
    if (error.name === 'ZodError') {
  console.error('Zod Validation Errors:', error.errors);
  throw new Error('Validation failed: ' + error.errors.map((e: any) => e.message).join(', '));
}

    throw new Error(handleSupabaseError(error));
  }
}

// Save contact form
export async function contactUs(data: {
  name: string;
  email: string;
  message: string;
}) {
  const supabase = await getSupabaseClient();

  const { data: contactData, error } = await supabase
    .from("contacts")
    .insert([
      {
        name: data.name,
        email: data.email,
        message: data.message,
      },
    ])
    .select("id")
    .single();

  if (error) throw new Error(handleSupabaseError(error));
  return contactData || { success: true };
}
