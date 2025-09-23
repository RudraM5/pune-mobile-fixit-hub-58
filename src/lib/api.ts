const API_BASE = "https://mobilerepairwala-backend.onrender.com"; 

export async function getServices() {
  const res = await fetch(`${API_BASE}/api/services`);
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

export async function getShops() {
  const res = await fetch(`${API_BASE}/api/shops`);
  if (!res.ok) throw new Error("Failed to fetch shops");
  return res.json();
}

export async function createBooking(data: any) {
  // Import supabase client
  const { supabase } = await import("@/integrations/supabase/client");
  
  const { data: bookingId, error } = await supabase.rpc("create_repair_booking", {
    p_customer_name: data.customer.name,
    p_customer_phone: data.customer.phone,
    p_customer_email: data.customer.email,
    p_customer_address: data.customer.address,
    p_device_brand: data.device.brand,
    p_device_model: data.device.model,
    p_shop_id: data.shopId,
    p_total_amount: data.totalAmount,
    p_pickup_preferred: data.pickupPreferred,
    p_issue_description: data.description,
    p_services: JSON.stringify(data.services) // ✅ Always array
  });

  if (error) {
    console.error("Booking error:", error);
    throw new Error(error.message || "Failed to create booking");
  }

  // ✅ bookingId is already a UUID, return it clean
  return { bookingId };
}

export async function contactUs(data: any) {
  const res = await fetch(`${API_BASE}/api/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit contact form");
  return res.json();
}
