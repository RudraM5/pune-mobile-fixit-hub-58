-- Enable Row Level Security (RLS) and create policies for all tables

-- Enable RLS on all tables
ALTER TABLE public.mobile_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_request_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.before_after_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Policies for mobile_devices (public read access)
CREATE POLICY "Anyone can view mobile devices" 
  ON public.mobile_devices FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage mobile devices" 
  ON public.mobile_devices FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for service_categories (public read access)
CREATE POLICY "Anyone can view active service categories" 
  ON public.service_categories FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage service categories" 
  ON public.service_categories FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for services (public read access)
CREATE POLICY "Anyone can view active services" 
  ON public.services FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage services" 
  ON public.services FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for shops (public read access for active shops)
CREATE POLICY "Anyone can view active shops" 
  ON public.shops FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage shops" 
  ON public.shops FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for technicians (public read access for active technicians)
CREATE POLICY "Anyone can view active technicians" 
  ON public.technicians FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Technicians can update their own profile" 
  ON public.technicians FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage technicians" 
  ON public.technicians FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for repair_requests (users can see their own, admins see all)
CREATE POLICY "Users can view their own repair requests" 
  ON public.repair_requests FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own repair requests" 
  ON public.repair_requests FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending requests" 
  ON public.repair_requests FOR UPDATE 
  USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can manage all repair requests" 
  ON public.repair_requests FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Assigned technicians can update their requests" 
  ON public.repair_requests FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.technicians 
      WHERE id = assigned_technician_id AND user_id = auth.uid()
    )
  );

-- Policies for repair_request_services (linked to repair requests)
CREATE POLICY "Users can view their own request services" 
  ON public.repair_request_services FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.repair_requests 
      WHERE id = repair_request_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create services for their own requests" 
  ON public.repair_request_services FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.repair_requests 
      WHERE id = repair_request_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all repair request services" 
  ON public.repair_request_services FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for reviews (users can create, everyone can read verified ones)
CREATE POLICY "Anyone can view verified reviews" 
  ON public.reviews FOR SELECT 
  USING (is_verified = true);

CREATE POLICY "Users can view their own reviews" 
  ON public.reviews FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create reviews for their completed requests" 
  ON public.reviews FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.repair_requests 
      WHERE id = repair_request_id AND user_id = auth.uid() AND status = 'completed'
    )
  );

CREATE POLICY "Admins can manage all reviews" 
  ON public.reviews FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for before_after_gallery (public read for featured)
CREATE POLICY "Anyone can view featured gallery items" 
  ON public.before_after_gallery FOR SELECT 
  USING (is_featured = true);

CREATE POLICY "Admins can manage gallery" 
  ON public.before_after_gallery FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for video_testimonials (public read for featured)
CREATE POLICY "Anyone can view featured video testimonials" 
  ON public.video_testimonials FOR SELECT 
  USING (is_featured = true);

CREATE POLICY "Admins can manage video testimonials" 
  ON public.video_testimonials FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for cart_items (users can only manage their own)
CREATE POLICY "Users can manage their own cart items" 
  ON public.cart_items FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);