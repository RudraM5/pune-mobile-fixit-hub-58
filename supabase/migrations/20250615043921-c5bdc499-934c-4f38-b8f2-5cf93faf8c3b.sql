-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('customer', 'admin', 'technician');

-- Create profiles table for extended user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role app_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create technicians table
CREATE TABLE public.technicians (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  specialization TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create devices table
CREATE TABLE public.devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'smartphone',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(brand, model)
);

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create repair_requests table
CREATE TABLE public.repair_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES public.devices(id),
  technician_id UUID REFERENCES public.technicians(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'delivered', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  description TEXT,
  estimated_completion TIMESTAMP WITH TIME ZONE,
  actual_completion TIMESTAMP WITH TIME ZONE,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create repair_request_services junction table
CREATE TABLE public.repair_request_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  repair_request_id UUID NOT NULL REFERENCES public.repair_requests(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(repair_request_id, service_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  repair_request_id UUID REFERENCES public.repair_requests(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('sms', 'email', 'in_app')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  repair_request_id UUID NOT NULL REFERENCES public.repair_requests(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  repair_request_id UUID NOT NULL REFERENCES public.repair_requests(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES public.technicians(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create status_updates table
CREATE TABLE public.status_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  repair_request_id UUID NOT NULL REFERENCES public.repair_requests(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  message TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_request_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_updates ENABLE ROW LEVEL SECURITY;

-- Create helper function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create RLS policies

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Customers policies
CREATE POLICY "Users can view their own customer record" ON public.customers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own customer record" ON public.customers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own customer record" ON public.customers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins and technicians can view all customers" ON public.customers FOR SELECT USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'technician')
);

-- Technicians policies
CREATE POLICY "Technicians can view their own record" ON public.technicians FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all technicians" ON public.technicians FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view active technicians" ON public.technicians FOR SELECT USING (is_active = true);

-- Devices policies (public read for catalog)
CREATE POLICY "Anyone can view active devices" ON public.devices FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage devices" ON public.devices FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Services policies (public read for catalog)
CREATE POLICY "Anyone can view active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Repair requests policies
CREATE POLICY "Customers can view their own repair requests" ON public.repair_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.customers WHERE id = customer_id AND user_id = auth.uid())
);
CREATE POLICY "Customers can create repair requests" ON public.repair_requests FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.customers WHERE id = customer_id AND user_id = auth.uid())
);
CREATE POLICY "Admins and technicians can view all repair requests" ON public.repair_requests FOR SELECT USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'technician')
);
CREATE POLICY "Admins and assigned technicians can update repair requests" ON public.repair_requests FOR UPDATE USING (
  public.has_role(auth.uid(), 'admin') OR 
  (technician_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.technicians WHERE id = technician_id AND user_id = auth.uid()))
);

-- Repair request services policies
CREATE POLICY "Users can view services for their repair requests" ON public.repair_request_services FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.repair_requests rr 
    JOIN public.customers c ON rr.customer_id = c.id 
    WHERE rr.id = repair_request_id AND c.user_id = auth.uid()
  ) OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'technician')
);
CREATE POLICY "Admins can manage repair request services" ON public.repair_request_services FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all notifications" ON public.notifications FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Invoices policies
CREATE POLICY "Customers can view their own invoices" ON public.invoices FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.repair_requests rr 
    JOIN public.customers c ON rr.customer_id = c.id 
    WHERE rr.id = repair_request_id AND c.user_id = auth.uid()
  )
);
CREATE POLICY "Admins can manage all invoices" ON public.invoices FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Reviews policies
CREATE POLICY "Customers can view and create their own reviews" ON public.reviews FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.customers WHERE id = customer_id AND user_id = auth.uid())
);
CREATE POLICY "Customers can create reviews for their repairs" ON public.reviews FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.customers WHERE id = customer_id AND user_id = auth.uid())
);
CREATE POLICY "Anyone can view published reviews" ON public.reviews FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage all reviews" ON public.reviews FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Status updates policies
CREATE POLICY "Users can view status updates for their repair requests" ON public.status_updates FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.repair_requests rr 
    JOIN public.customers c ON rr.customer_id = c.id 
    WHERE rr.id = repair_request_id AND c.user_id = auth.uid()
  ) OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'technician')
);
CREATE POLICY "Admins and technicians can create status updates" ON public.status_updates FOR INSERT WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'technician')
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_technicians_updated_at BEFORE UPDATE ON public.technicians FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_repair_requests_updated_at BEFORE UPDATE ON public.repair_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, phone, role)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'display_name',
    NEW.raw_user_meta_data ->> 'phone',
    COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'customer')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data

-- Insert devices
INSERT INTO public.devices (brand, model, category) VALUES
('Apple', 'iPhone 14', 'smartphone'),
('Apple', 'iPhone 13', 'smartphone'),
('Apple', 'iPhone 12', 'smartphone'),
('Samsung', 'Galaxy S23', 'smartphone'),
('Samsung', 'Galaxy S22', 'smartphone'),
('OnePlus', 'OnePlus 11', 'smartphone'),
('Google', 'Pixel 7', 'smartphone'),
('Xiaomi', 'Mi 13', 'smartphone');

-- Insert services
INSERT INTO public.services (name, description, category, price, duration) VALUES
('Screen Replacement', 'Complete screen and digitizer replacement', 'display', 2999.00, '1-2 hours'),
('Battery Replacement', 'Original battery replacement with warranty', 'battery', 1499.00, '30 minutes'),
('Camera Repair', 'Front or rear camera module replacement', 'camera', 1999.00, '1 hour'),
('Charging Port Repair', 'Charging port cleaning or replacement', 'charging', 899.00, '45 minutes'),
('Speaker Repair', 'Loudspeaker or earpiece replacement', 'audio', 799.00, '30 minutes'),
('Water Damage Repair', 'Complete water damage assessment and repair', 'liquid', 3999.00, '2-3 days'),
('Software Issues', 'OS reinstallation and software troubleshooting', 'software', 699.00, '1 hour'),
('Data Recovery', 'Recover data from damaged devices', 'data', 2499.00, '1-2 days');

-- Enable realtime for important tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.repair_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.status_updates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;