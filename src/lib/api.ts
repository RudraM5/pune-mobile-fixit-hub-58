// src/lib/api.ts
// Full Supabase-only API: No Render dependency. Handles bookings with schema alignment, validation, and error mapping.

import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Supabase client initialization (using your integrations path; env from Vite/React)
let supabase: any;
async function getSupabaseClient() {
  if (!supabase) {
    const { supabase: client } = await import("@/integrations/supabase/client");
    supabase = client;
  }
  return supabase;
}

// Types (align with your @/types/booking.ts - extend if needed)
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
    id: string | number;  // Can be numeric or UUID
    name: string;
    price: number;
    quantity?: number;
  }>;
  shopId: string | number;  // Can be numeric or UUID
  totalAmount: number;
  userId?: string | null;
}

// Zod validation schema (now accepts number OR string IDs, not UUID-only)
const bookingValidationSchema = z.object({
  customer: z.object({
    name: z.string().min(1, 'Customer name is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    email: z.string().email('Invalid email').optional(),
    address: z.string().optional(),
    pickupPreferred: z.boolean().optional().default(false),
    description: z.string().optional(),
  }),
  device: z.object({
    brand: z.string().min(1, 'Device brand (e.g., Apple) is required'),
    model: z.string().min(1, 'Device model (e.g., iPhone 14) is required'),
  }),
  services: z.array(z.object({
    id: z.union([z.string(), z.number()]),  // accepts numeric IDs too
    name: z.string().min(1),
    price: z.number().positive('Service price must be positive'),
    quantity: z.number().int().min(1).default(1),
  })).min(1, 'At least one service must be selected'),
  shopId: z.union([z.string(), z.number()]),  // accepts numeric IDs too
  totalAmount: z.number().positive('Total amount must be greater than 0'),
  userId: z.string().optional().or(z.null()),
}).transform((validatedData) => {
  // Validate/compute total_amount (matches schema requirement)
  const computedTotal = validatedData.services.reduce((sum, service) => {
    return sum + (service.price * service.quantity);
  }, 0);

  if (Math.abs(computedTotal - validatedData.totalAmount) > 0.01) {
    throw new Error('Total amount does not match selected services');
  }

  return validatedData;
});

// Enhanced error handler (maps Supabase codes to user-friendly messages; exported for page use)
export function handleSupabaseError(err: any): string {
  console.error('Supabase Error Details:', {
    code: err.code,
    message: err.message,
    details: err.details,
    hint: err.hint,
  });

  let userMessage = err.message || 'An unexpected error occurred during the operation.';

  switch (err.code) {
    case '23502': 
      userMessage = 'Missing required information (e.g., device brand, model, or services). Please check your inputs.';
      break;
    case '42501': 
      userMessage = 'Permission denied. Please log in and try again.';
      break;
    case '23503': 
      userMessage = 'Invalid selection (e.g., shop or service not found). Please choose from available options.';
      break;
    case '22P02': 
      userMessage = 'Invalid data format (e.g., price or total). Please verify your selections.';
      break;
    case 'P0001': 
      userMessage = 'Booking validation failed (e.g., total mismatch or unavailable service).';
      break;
    case '400': 
      userMessage = 'Invalid form data. Please fill all required fields.';
      break;
    default:
      if (err.message?.includes('total_amount')) {
        userMessage = 'Total amount calculation error. Please select services again.';
      }
  }

  return userMessage;
}

// Get services from Supabase
export async function getServices() {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('services')
    .select('id, name, description, price, duration, category_id, is_active')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) {
    const errMsg = handleSupabaseError(error);
    console.error('Error fetching services:', error);
    throw new Error(errMsg);
  }

  return data || [];
}

// Get shops from Supabase
export async function getShops() {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('shops')
    .select('id, name, address, phone, rating, is_active, location_lat, location_lng')
    .eq('is_active', true)
    .order('rating', { ascending: false });

  if (error) {
    const errMsg = handleSupabaseError(error);
    console.error('Error fetching shops:', error);
    throw new Error(errMsg);
  }

  return data || [];
}

// Create booking
export async function createBooking(data: BookingData) {
  const supabase = await getSupabaseClient();

  try {
    const validatedData = bookingValidationSchema.parse(data);

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
      status: 'pending',
      priority: 'medium',
      payment_status: 'pending',
      payment_method: 'online',
      pickup_preferred: validatedData.customer.pickupPreferred || false,
      pickup_address: validatedData.customer.pickupPreferred ? validatedData.customer.address : null,
      shop_id: validatedData.shopId,  
      assigned_technician_id: null,
      estimated_completion: null,
      notes: null,
    };

    console.log('Inserting main payload to repair_requests:', mainPayload);

    const { data: requestData, error: insertError } = await supabase
      .from('repair_requests')
      .insert([mainPayload])
      .select('id')
      .single();

    if (insertError) {
      throw insertError;
    }

    const bookingId = requestData.id;

    if (validatedData.services && validatedData.services.length > 0) {
      const serviceInserts = validatedData.services.map((service) => ({
        repair_request_id: bookingId,
        service_id: service.id,
        quantity: service.quantity,
        unit_price: service.price,
        total_price: service.price * service.quantity,
      }));

      console.log('Inserting services to repair_request_services:', serviceInserts);

      const { error: serviceError } = await supabase
        .from('repair_request_services')
        .insert(serviceInserts);

      if (serviceError) {
        await supabase.from('repair_requests').delete().eq('id', bookingId);
        throw serviceError;
      }
    }

    if (validatedData.userId) {
      await supabase.from('cart_items').delete().eq('user_id', validatedData.userId);
    }

    console.log('Booking created successfully with ID:', bookingId);
    return { bookingId };

  } catch (error: any) {
    if (error.name === 'ZodError') {
      throw new Error('Validation failed: ' + error.errors[0].message);
    }
    const errMsg = handleSupabaseError(error);
    throw new Error(errMsg);
  }
}

// Contact form to Supabase
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

  if (error) {
    const errMsg = handleSupabaseError(error);
    console.error('Contact submission error:', error);
    throw new Error(errMsg);
  }

  return contactData || { success: true };
}
