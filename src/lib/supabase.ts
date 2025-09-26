import { supabase } from '@/integrations/supabase/client';

// Service functions
export const getServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      category:service_categories(name, slug)
    `)
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data || [];
};

export const getServiceCategories = async () => {
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data || [];
};

// Shop functions
export const getShops = async () => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('is_active', true)
    .order('rating', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getShopsByArea = async (area?: string) => {
  let query = supabase
    .from('shops')
    .select(`
      *,
      technicians(
        id, name, phone, specialization, expertise_level, 
        years_experience, rating, completed_repairs, availability_status
      )
    `)
    .eq('is_active', true);

  if (area) {
    query = query.ilike('area', `%${area}%`);
  }

  const { data, error } = await query.order('rating', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Technician functions
export const getTechnicians = async () => {
  const { data, error } = await supabase
    .from('technicians')
    .select(`
      *,
      shop:shops(name, address, area, phone)
    `)
    .eq('is_active', true)
    .order('rating', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getTechniciansByArea = async (area: string) => {
  const { data, error } = await supabase
    .from('technicians')
    .select(`
      *,
      shop:shops(name, address, area, phone)
    `)
    .eq('is_active', true)
    .ilike('area', `%${area}%`)
    .order('rating', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Mobile device functions
export const getMobileDevices = async () => {
  const { data, error } = await supabase
    .from('mobile_devices')
    .select('*')
    .order('brand', { ascending: true })
    .order('model', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const addMobileDevice = async (brand: string, model: string) => {
  const { data, error } = await supabase
    .from('mobile_devices')
    .insert([{ brand, model }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Booking functions
export const createRepairRequest = async (requestData: any) => {
  const { data, error } = await supabase
    .from('repair_requests')
    .insert([requestData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const addRepairRequestServices = async (repairRequestId: string, services: any[]) => {
  const serviceData = services.map(service => ({
    repair_request_id: repairRequestId,
    service_id: service.id,
    quantity: service.quantity || 1,
    unit_price: service.price,
    total_price: (service.price * (service.quantity || 1))
  }));

  const { data, error } = await supabase
    .from('repair_request_services')
    .insert(serviceData)
    .select();

  if (error) throw error;
  return data;
};

// User functions
export const getUserRepairRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from('repair_requests')
    .select(`
      *,
      repair_request_services(
        *,
        service:services(name, description)
      ),
      assigned_technician:technicians(name, phone),
      shop:shops(name, address, phone)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Contact functions
export const submitContactForm = async (contactData: any) => {
  const { data, error } = await supabase
    .from('contacts')
    .insert([contactData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Reviews functions
export const getReviews = async () => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      shop:shops(name),
      technician:technicians(name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createReview = async (reviewData: any) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([reviewData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Cart functions
export const getUserCart = async (userId: string) => {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      service:services(*)
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
};

export const addToCart = async (userId: string, serviceId: string, quantity: number = 1) => {
  // Check if item already exists
  const { data: existing } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('service_id', serviceId)
    .single();

  if (existing) {
    // Update quantity
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Insert new item
    const { data, error } = await supabase
      .from('cart_items')
      .insert([{ user_id: userId, service_id: serviceId, quantity }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const removeFromCart = async (userId: string, serviceId: string) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('service_id', serviceId);

  if (error) throw error;
};

export const clearCart = async (userId: string) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
};

// Admin functions
export const getAdminStats = async () => {
  const [
    { count: totalRequests },
    { count: pendingRequests },
    { count: inProgressRequests },
    { count: completedToday }
  ] = await Promise.all([
    supabase.from('repair_requests').select('*', { count: 'exact', head: true }),
    supabase.from('repair_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('repair_requests').select('*', { count: 'exact', head: true }).eq('status', 'in-progress'),
    supabase.from('repair_requests').select('*', { count: 'exact', head: true })
      .eq('status', 'completed')
      .gte('created_at', new Date().toISOString().split('T')[0])
  ]);

  return {
    totalRequests: totalRequests || 0,
    pendingRequests: pendingRequests || 0,
    inProgressRequests: inProgressRequests || 0,
    completedToday: completedToday || 0
  };
};