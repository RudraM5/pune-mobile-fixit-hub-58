
-- Create shops table for local repair shops
CREATE TABLE public.shops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  area TEXT NOT NULL, -- area in Pune
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN NOT NULL DEFAULT true,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_repairs INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add shop_id to technicians table and enhance specialization
ALTER TABLE public.technicians 
ADD COLUMN shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
ADD COLUMN expertise_level TEXT DEFAULT 'intermediate' CHECK (expertise_level IN ('beginner', 'intermediate', 'expert', 'master')),
ADD COLUMN years_experience INTEGER DEFAULT 0,
ADD COLUMN rating DECIMAL(3, 2) DEFAULT 0,
ADD COLUMN completed_repairs INTEGER DEFAULT 0,
ADD COLUMN availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'offline')),
ADD COLUMN hourly_rate DECIMAL(10, 2),
ADD COLUMN area TEXT NOT NULL DEFAULT 'Pune Center';

-- Create technician_expertise table for detailed specializations
CREATE TABLE public.technician_expertise (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  technician_id UUID NOT NULL REFERENCES public.technicians(id) ON DELETE CASCADE,
  service_category TEXT NOT NULL,
  expertise_level TEXT NOT NULL CHECK (expertise_level IN ('beginner', 'intermediate', 'expert', 'master')),
  certifications TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(technician_id, service_category)
);

-- Add area and preferred_technician to repair_requests
ALTER TABLE public.repair_requests 
ADD COLUMN customer_area TEXT,
ADD COLUMN preferred_shop_id UUID REFERENCES public.shops(id),
ADD COLUMN distance_km DECIMAL(5, 2);

-- Enable RLS on new tables
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_expertise ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for shops
CREATE POLICY "Anyone can view active shops" ON public.shops FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage shops" ON public.shops FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for technician_expertise
CREATE POLICY "Anyone can view technician expertise" ON public.technician_expertise FOR SELECT USING (true);
CREATE POLICY "Admins can manage technician expertise" ON public.technician_expertise FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Technicians can view their own expertise" ON public.technician_expertise FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.technicians WHERE id = technician_id AND user_id = auth.uid())
);

-- Create triggers for timestamps
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON public.shops FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample shops data
INSERT INTO public.shops (name, owner_name, phone, email, address, area, latitude, longitude, rating, total_repairs) VALUES
('TechFix Mobile Center', 'Rajesh Sharma', '+91-9876543210', 'techfix.pune@gmail.com', 'Shop 15, FC Road, Near Sambhaji Bridge', 'FC Road', 18.5204, 73.8567, 4.5, 150),
('Mobile Care Hub', 'Priya Patel', '+91-9876543211', 'mobilecare.kothrud@gmail.com', 'Shop 7, Karve Road, Kothrud', 'Kothrud', 18.5074, 73.8077, 4.2, 120),
('QuickFix Solutions', 'Amit Kumar', '+91-9876543212', 'quickfix.vimaan@gmail.com', 'Shop 22, Airport Road, Viman Nagar', 'Viman Nagar', 18.5679, 73.9143, 4.7, 200),
('Digital Repair Point', 'Sneha Joshi', '+91-9876543213', 'digital.hadapsar@gmail.com', 'Shop 5, Hadapsar Main Road', 'Hadapsar', 18.5089, 73.9262, 4.3, 90),
('Smart Phone Clinic', 'Rahul Desai', '+91-9876543214', 'smartphone.shivaji@gmail.com', 'Shop 12, Shivaji Nagar, Near Railway Station', 'Shivaji Nagar', 18.5304, 73.8567, 4.1, 80),
('Expert Mobile Solutions', 'Kavita Singh', '+91-9876543215', 'expert.wakad@gmail.com', 'Shop 18, Wakad IT Park Road', 'Wakad', 18.5974, 73.7898, 4.6, 180),
('Gadget Repair Zone', 'Suresh Patil', '+91-9876543216', 'gadget.bhosari@gmail.com', 'Shop 9, Bhosari MIDC', 'Bhosari', 18.6298, 73.8389, 4.0, 75),
('Mobile Master', 'Deepika Rao', '+91-9876543217', 'master.aundh@gmail.com', 'Shop 25, Aundh IT Park', 'Aundh', 18.5562, 73.8070, 4.4, 110);

-- Insert sample technicians with shop associations
INSERT INTO public.technicians (user_id, name, phone, email, shop_id, expertise_level, years_experience, rating, completed_repairs, area, hourly_rate, specialization) VALUES
(null, 'Arjun Mehta', '+91-9876543301', 'arjun.mehta@techfix.com', (SELECT id FROM public.shops WHERE name = 'TechFix Mobile Center'), 'expert', 5, 4.6, 85, 'FC Road', 300.00, ARRAY['Screen Replacement', 'Battery Replacement']),
(null, 'Pooja Gupta', '+91-9876543302', 'pooja.gupta@mobilecare.com', (SELECT id FROM public.shops WHERE name = 'Mobile Care Hub'), 'master', 7, 4.8, 120, 'Kothrud', 400.00, ARRAY['Water Damage', 'Motherboard Repair']),
(null, 'Vikram Singh', '+91-9876543303', 'vikram.singh@quickfix.com', (SELECT id FROM public.shops WHERE name = 'QuickFix Solutions'), 'expert', 4, 4.7, 95, 'Viman Nagar', 350.00, ARRAY['Camera Repair', 'Software Issues']),
(null, 'Anita Sharma', '+91-9876543304', 'anita.sharma@digital.com', (SELECT id FROM public.shops WHERE name = 'Digital Repair Point'), 'intermediate', 3, 4.3, 60, 'Hadapsar', 250.00, ARRAY['Charging Port', 'Speaker Repair']),
(null, 'Rohit Jain', '+91-9876543305', 'rohit.jain@smartphone.com', (SELECT id FROM public.shops WHERE name = 'Smart Phone Clinic'), 'expert', 6, 4.5, 110, 'Shivaji Nagar', 320.00, ARRAY['Screen Replacement', 'Data Recovery']),
(null, 'Priyanka Das', '+91-9876543306', 'priyanka.das@expert.com', (SELECT id FROM public.shops WHERE name = 'Expert Mobile Solutions'), 'master', 8, 4.9, 150, 'Wakad', 450.00, ARRAY['Water Damage', 'Complex Repairs']),
(null, 'Manoj Kumar', '+91-9876543307', 'manoj.kumar@gadget.com', (SELECT id FROM public.shops WHERE name = 'Gadget Repair Zone'), 'intermediate', 2, 4.1, 45, 'Bhosari', 200.00, ARRAY['Battery Replacement', 'Software Issues']),
(null, 'Sunita Reddy', '+91-9876543308', 'sunita.reddy@master.com', (SELECT id FROM public.shops WHERE name = 'Mobile Master'), 'expert', 5, 4.4, 88, 'Aundh', 310.00, ARRAY['Camera Repair', 'Charging Port']);

-- Insert technician expertise details
INSERT INTO public.technician_expertise (technician_id, service_category, expertise_level, certifications) 
SELECT t.id, unnest(ARRAY['display', 'battery', 'camera', 'charging', 'audio', 'liquid', 'software', 'data']), 
       CASE 
         WHEN t.expertise_level = 'master' THEN 'expert'
         ELSE t.expertise_level 
       END,
       ARRAY['Certified Mobile Technician', 'Brand Authorized']
FROM public.technicians t;

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.shops;
ALTER PUBLICATION supabase_realtime ADD TABLE public.technician_expertise;
