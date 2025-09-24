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
    // Add other props like imei if in your MobileDevice type
  };
  services: Array<{
    id: string;  // UUID from services table
    name: string;
    price: number;
    quantity?: number;  // Default 1 if missing
  }>;
  shopId: string;  // UUID
  totalAmount: number;
  userId?: string | null;  // From auth
}

// Zod validation schema (ensures match to Supabase schema before insert)
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
    id: z.string().uuid('Invalid service ID'),
    name: z.string().min(1),
    price: z.number().positive('Service price must be positive'),
    quantity: z.number().int().min(1).default(1),
  })).min(1, 'At least one service must be selected'),
  shopId: z.string().uuid('Invalid shop ID'),
  totalAmount: z.number().positive('Total amount must be greater than 0'),
  userId: z.string().uuid('Invalid user ID').or(z.null()).optional(),
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

  // Map common errors based on schema/RLS
  switch (err.code) {
    case '23502':  // Not-null violation (e.g., missing device_brand, total_amount)
      userMessage = 'Missing required information (e.g., device brand, model, or services). Please check your inputs.';
      break;
    case '42501':  // RLS policy violation
      userMessage = 'Permission denied. Please log in and try again.';
      break;
    case '23503':  // Foreign key violation (e.g., invalid shop_id, service_id)
      userMessage = 'Invalid selection (e.g., shop or service not found). Please choose from available options.';
      break;
    case '22P02':  // Invalid data type (e.g., non-numeric total)
      userMessage = 'Invalid data format (e.g., price or total). Please verify your selections.';
      break;
    case 'P0001':  // Custom constraint/trigger error
      userMessage = 'Booking validation failed (e.g., total mismatch or unavailable service).';
      break;
    case '400':  // Bad request (validation/Zod)
      userMessage = 'Invalid form data. Please fill all required fields.';
      break;
    default:
      if (err.message?.includes('total_amount')) {
        userMessage = 'Total amount calculation error. Please select services again.';
      }
  }

  return userMessage;
}

// FIXED: Get services from Supabase (replaces Render fetch)
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

// FIXED: Get shops from Supabase (replaces Render fetch)
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

// FIXED: Create booking with direct Supabase inserts (replaces RPC; full schema alignment)
export async function createBooking(data: BookingData) {
  const supabase = await getSupabaseClient();

  try {
    // Step 1: Validate input with Zod
    const validatedData = bookingValidationSchema.parse(data);

    // Step 2: Build payload for repair_requests (exact schema match, add defaults)
    const mainPayload = {
      customer_name: validatedData.customer.name,
      customer_phone: validatedData.customer.phone,
      customer_email: validatedData.customer.email || null,
      customer_address: validatedData.customer.address || null,
      device_brand: validatedData.device.brand,  // Required: From device
      device_model: validatedData.device.model,  // Required: From device
      issue_description: validatedData.customer.description || null,
      total_amount: validatedData.totalAmount,  // Numeric, validated
      user_id: validatedData.userId || null,  // FIXED: For RLS/auth
      status: 'pending',  // Default
      priority: 'medium',  // Default
      payment_status: 'pending',  // For Razorpay
      payment_method: 'online',  // Since using Razorpay
      pickup_preferred: validatedData.customer.pickupPreferred || false,
      pickup_address: validatedData.customer.pickupPreferred ? validatedData.customer.address : null,
      shop_id: validatedData.shopId,  // UUID
      assigned_technician_id: null,  // Assign later
      estimated_completion: null,  // Add date picker later if needed
      notes: null,
    };

    console.log('Inserting main payload to repair_requests:', mainPayload);  // Debug

    // Step 3: Insert main booking
    const { data: requestData, error: insertError } = await supabase
      .from('repair_requests')
      .insert([mainPayload])
      .select('id')
      .single();

    if (insertError) {
      throw insertError;
    }

    const bookingId = requestData.id;

    // Step 4: FIXED: Insert services to junction table (repair_request_services)
    if (validatedData.services && validatedData.services.length > 0) {
      const serviceInserts = validatedData.services.map((service) => ({
        repair_request_id: bookingId,
        service_id: service.id,  // UUID
        quantity: service.quantity,
        unit_price: service.price,
        total_price: service.price * service.quantity,
      }));

      console.log('Inserting services to repair_request_services:', serviceInserts);  // Debug

      const { error: serviceError } = await supabase
        .from('repair_request_services')
        .insert(serviceInserts);

      if (serviceError) {
        // Rollback main insert if junction fails (optional: delete main)
        await supabase.from('repair_requests').delete().eq('id', bookingId);
        throw serviceError;
      }
    }

    // Step 5: Optional - Clear user cart if authenticated
    if (validatedData.userId) {
      await supabase.from('cart_items').delete().eq('user_id', validatedData.userId);
    }

    console.log('Booking created successfully with ID:', bookingId);
    return { bookingId };  // Matches page expectation for Razorpay

  } catch (error: any) {
    // Zod validation errors are thrown as Error
    if (error.name === 'ZodError') {
      throw new Error('Validation failed: ' + error.errors[0].message);
    }
    // Supabase errors handled here
    const errMsg = handleSupabaseError(error);
    throw new Error(errMsg);
  }
}

// FIXED: Contact form to Supabase (replaces Render POST; assumes 'contacts' table)
export async function contactUs(data: any) {
  const supabase = await getSupabaseClient();

  const { data: contactData, error } = await supabase
    .from('contacts')  // Assume table: id, name, email, message, created_at
    .insert([{
      name: data.name,
      email: data.email,
      message: data.message,
      // Add user_id if auth
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
