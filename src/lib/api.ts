// src/lib/api.ts
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

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
    id: string;  // must be UUID
    name: string;
    price: number;
    quantity?: number;
  }>;
  shopId: string;       // must be UUID
  totalAmount: number;
  userId?: string | null;
}

// Validation schema
const bookingValidationSchema = z.object({
  customer: z.object({
    name: z.string().min(1),
    phone: z.string().min(10),
    email: z.string().email().optional(),
    address: z.string().optional(),
    pickupPreferred: z.boolean().optional().default(false),
    description: z.string().optional(),
  }),
  device: z.object({
    brand: z.string().min(1),
    model: z.string().min(1),
  }),
  services: z.array(z.object({
    id: z.string().uuid('Invalid service ID'),
    name: z.string().min(1),
    price: z.number().positive(),
    quantity: z.number().int().min(1).default(1),
  })).min(1),
  shopId: z.string().uuid('Invalid shop ID'),
  totalAmount: z.number().positive(),
  userId: z.string().uuid().or(z.null()).optional(),
}).transform((validated) => {
  const computed = validated.services.reduce(
    (sum, s) => sum + s.price * (s.quantity ?? 1),
    0
  );
  if (Math.abs(computed - validated.totalAmount) > 0.01) {
    throw new Error('Total mismatch with services');
  }
  return validated;
});

// Error handler
export function handleSupabaseError(err: any): string {
  console.error('Supabase Error:', err);
  switch (err.code) {
    case '23502': return 'Missing required information.';
    case '42501': return 'Permission denied. Please log in.';
    case '23503': return 'Invalid shop or service selected.';
    case '22P02': return 'Invalid data format (UUID/number mismatch).';
    case 'P0001': return 'Booking validation failed.';
    default: return err.message || 'Unexpected error';
  }
}

// Get services
export async function getServices() {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('services')
    .select('id, name, description, price, duration, category_id, is_active')
    .eq('is_active', true)
    .order('name', { ascending: true });
  if (error) throw new Error(handleSupabaseError(error));
  return data || [];
}

// Get shops
export async function getShops() {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('shops')
    .select('id, name, address, phone, rating, is_active, location_lat, location_lng')
    .eq('is_active', true)
    .order('rating', { ascending: false });
  if (error) throw new Error(handleSupabaseError(error));
  return data || [];
}

// Create booking
export async function createBooking(data: BookingData) {
  const supabase = await getSupabaseClient();

  try {
    const validated = bookingValidationSchema.parse(data);

    const mainPayload = {
      customer_name: validated.customer.name,
      customer_phone: validated.customer.phone,
      customer_email: validated.customer.email || null,
      customer_address: validated.customer.address || null,
      device_brand: validated.device.brand,
      device_model: validated.device.model,
      issue_description: validated.customer.description || null,
      total_amount: validated.totalAmount,
      user_id: validated.userId || null,
      status: 'pending',
      priority: 'medium',
      payment_status: 'pending',
      payment_method: 'online',
      pickup_preferred: validated.customer.pickupPreferred || false,
      pickup_address: validated.customer.pickupPreferred
        ? validated.customer.address
        : null,
      shop_id: validated.shopId,  // must be UUID
      assigned_technician_id: null,
      estimated_completion: null,
      notes: null,
    };

    const { data: reqData, error: insertError } = await supabase
      .from('repair_requests')
      .insert([mainPayload])
      .select('id')
      .single();

    if (insertError) throw insertError;
    const bookingId = reqData.id;

    // Insert services
    if (validated.services?.length > 0) {
      const serviceInserts = validated.services.map((s) => ({
        repair_request_id: bookingId,
        service_id: s.id,   // must be UUID
        quantity: s.quantity ?? 1,
        unit_price: s.price,
        total_price: s.price * (s.quantity ?? 1),
      }));

      const { error: serviceError } = await supabase
        .from('repair_request_services')
        .insert(serviceInserts);

      if (serviceError) {
        await supabase.from('repair_requests').delete().eq('id', bookingId);
        throw serviceError;
      }
    }

    if (validated.userId) {
      await supabase.from('cart_items').delete().eq('user_id', validated.userId);
    }

    return { bookingId };
  } catch (err: any) {
    if (err.name === 'ZodError') {
      throw new Error('Validation failed: ' + err.errors[0].message);
    }
    throw new Error(handleSupabaseError(err));
  }
}

// Contact form
export async function contactUs(data: any) {
  const supabase = await getSupabaseClient();
  const { data: contactData, error } = await supabase
    .from('contacts')
    .insert([{
      name: data.name,
      email: data.email,
      message: data.message,
    }])
    .select('id')
    .single();
  if (error) throw new Error(handleSupabaseError(error));
  return contactData || { success: true };
}
