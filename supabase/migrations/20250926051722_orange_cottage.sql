/*
  # Complete Mobile Repairwala Database Schema Integration

  1. New Tables
    - `contacts` - Contact form submissions
    - Enhanced existing tables with missing columns
    - Proper RLS policies for all tables
    - Trigger functions for automatic updates

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for authenticated and public access
    - Secure admin-only operations

  3. Functions
    - Auto-update timestamps
    - User profile creation on signup
    - Booking creation with services

  4. Sample Data
    - Service categories and services
    - Sample shops and technicians
    - Mobile device models
*/

-- Create contacts table if not exists
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Add missing columns to existing tables
DO $$
BEGIN
  -- Add missing columns to service_categories
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_categories' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE service_categories ADD COLUMN is_active boolean DEFAULT true;
  END IF;

  -- Add missing columns to services
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'shop_id'
  ) THEN
    ALTER TABLE services ADD COLUMN shop_id uuid REFERENCES shops(id) ON DELETE CASCADE;
  END IF;

  -- Add missing columns to technicians
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'technicians' AND column_name = 'specialization'
  ) THEN
    ALTER TABLE technicians ADD COLUMN specialization text[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'technicians' AND column_name = 'years_experience'
  ) THEN
    ALTER TABLE technicians ADD COLUMN years_experience integer DEFAULT 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'technicians' AND column_name = 'area'
  ) THEN
    ALTER TABLE technicians ADD COLUMN area text DEFAULT 'Pune';
  END IF;
END $$;

-- Create comprehensive RLS policies

-- Contacts policies (public can insert, admins can read)
CREATE POLICY "Anyone can submit contact form"
  ON contacts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Shops policies (public read, admin manage)
CREATE POLICY "Anyone can view active shops"
  ON shops
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage shops"
  ON shops
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Service categories policies
CREATE POLICY "Anyone can view active service categories"
  ON service_categories
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage service categories"
  ON service_categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Services policies
CREATE POLICY "Anyone can view active services"
  ON services
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage services"
  ON services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Technicians policies
CREATE POLICY "Anyone can view active technicians"
  ON technicians
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage technicians"
  ON technicians
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Mobile devices policies
CREATE POLICY "Anyone can view mobile devices"
  ON mobile_devices
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can add mobile devices"
  ON mobile_devices
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage mobile devices"
  ON mobile_devices
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Repair requests policies
CREATE POLICY "Users can view own repair requests"
  ON repair_requests
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Anyone can create repair requests"
  ON repair_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage repair requests"
  ON repair_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Repair request services policies
CREATE POLICY "Users can view own repair request services"
  ON repair_request_services
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM repair_requests 
      WHERE id = repair_request_id AND (
        user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM user_roles 
          WHERE user_id = auth.uid() AND role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Anyone can create repair request services"
  ON repair_request_services
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Cart items policies
CREATE POLICY "Users can manage own cart"
  ON cart_items
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Reviews policies
CREATE POLICY "Anyone can view reviews"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Before after gallery policies
CREATE POLICY "Anyone can view gallery"
  ON before_after_gallery
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage gallery"
  ON before_after_gallery
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Video testimonials policies
CREATE POLICY "Anyone can view video testimonials"
  ON video_testimonials
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage video testimonials"
  ON video_testimonials
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- User roles policies
CREATE POLICY "Users can view own roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Insert sample data

-- Service categories
INSERT INTO service_categories (name, slug, description, is_active) VALUES
  ('Basic Repairs', 'basic-repairs', 'Common repair services for everyday issues', true),
  ('Advanced Repairs', 'advanced-repairs', 'Complex technical repairs requiring expertise', true),
  ('Accessories', 'accessories', 'Protective accessories and add-ons', true),
  ('Premium Services', 'premium-services', 'Special services for enhanced experience', true)
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs for services
DO $$
DECLARE
  basic_cat_id uuid;
  advanced_cat_id uuid;
  accessories_cat_id uuid;
  premium_cat_id uuid;
BEGIN
  SELECT id INTO basic_cat_id FROM service_categories WHERE slug = 'basic-repairs';
  SELECT id INTO advanced_cat_id FROM service_categories WHERE slug = 'advanced-repairs';
  SELECT id INTO accessories_cat_id FROM service_categories WHERE slug = 'accessories';
  SELECT id INTO premium_cat_id FROM service_categories WHERE slug = 'premium-services';

  -- Insert services
  INSERT INTO services (name, description, price, duration, category_id, is_active) VALUES
    -- Basic Repairs
    ('Screen Replacement', 'High-quality OLED/LCD display replacement', 1500, '30 mins', basic_cat_id, true),
    ('Battery Replacement', 'Original capacity battery replacement', 1200, '20 mins', basic_cat_id, true),
    ('Charging Port Repair', 'Fix charging port issues', 800, '45 mins', basic_cat_id, true),
    ('Speaker Repair', 'Fix audio issues and speaker replacement', 600, '30 mins', basic_cat_id, true),
    
    -- Advanced Repairs
    ('Motherboard Repair', 'Circuit board and chip-level repairs', 3500, '2-4 hours', advanced_cat_id, true),
    ('Water Damage Treatment', 'Complete liquid damage recovery service', 2500, '4-6 hours', advanced_cat_id, true),
    ('Camera Repair', 'Front/rear camera module replacement', 1800, '45 mins', advanced_cat_id, true),
    ('Face ID/Touch ID Repair', 'Biometric sensor repair', 2200, '1 hour', advanced_cat_id, true),
    
    -- Accessories
    ('Tempered Glass', '9H hardness screen protector', 200, '5 mins', accessories_cat_id, true),
    ('Phone Cover', 'Protective case installation', 300, '2 mins', accessories_cat_id, true),
    ('Screen Guard', 'Anti-glare screen protection', 150, '5 mins', accessories_cat_id, true),
    
    -- Premium Services
    ('On-Call Technician', 'Technician visits your location', 500, 'Travel time', premium_cat_id, true),
    ('Express Service', 'Priority repair service', 300, 'Half the time', premium_cat_id, true),
    ('Data Recovery', 'Recover data from damaged devices', 1500, '2-8 hours', premium_cat_id, true)
  ON CONFLICT (name) DO NOTHING;
END $$;

-- Sample shops
INSERT INTO shops (name, owner_name, phone, email, address, area, latitude, longitude, is_active, rating, total_repairs) VALUES
  ('TechFix Mobile Center', 'Rajesh Kumar', '+91-9876543210', 'rajesh@techfix.com', 'Shop No. 15, Lane 5, Koregaon Park', 'Koregaon Park', 18.5362, 73.8958, true, 4.8, 1250),
  ('QuickFix Solutions', 'Priya Sharma', '+91-9876543211', 'priya@quickfix.com', 'Ground Floor, Baner Road, Near D-Mart', 'Baner', 18.5679, 73.7797, true, 4.7, 980),
  ('Mobile Care Wakad', 'Amit Patel', '+91-9876543212', 'amit@mobilecare.com', 'Shop 12, Wakad Square, Hinjewadi Road', 'Wakad', 18.5975, 73.7898, true, 4.6, 750),
  ('Expert Mobile Repair', 'Sneha Desai', '+91-9876543213', 'sneha@expertmobile.com', 'FC Road, Near Sambhaji Park', 'FC Road', 18.5196, 73.8553, true, 4.9, 1500),
  ('Digital Repair Hub', 'Kiran Joshi', '+91-9876543214', 'kiran@digitalrepair.com', 'Hadapsar Main Road, IT Park', 'Hadapsar', 18.5089, 73.9260, true, 4.5, 650)
ON CONFLICT (phone) DO NOTHING;

-- Sample technicians
DO $$
DECLARE
  shop1_id uuid;
  shop2_id uuid;
  shop3_id uuid;
  shop4_id uuid;
  shop5_id uuid;
BEGIN
  SELECT id INTO shop1_id FROM shops WHERE name = 'TechFix Mobile Center';
  SELECT id INTO shop2_id FROM shops WHERE name = 'QuickFix Solutions';
  SELECT id INTO shop3_id FROM shops WHERE name = 'Mobile Care Wakad';
  SELECT id INTO shop4_id FROM shops WHERE name = 'Expert Mobile Repair';
  SELECT id INTO shop5_id FROM shops WHERE name = 'Digital Repair Hub';

  INSERT INTO technicians (name, phone, email, shop_id, area, specialization, expertise_level, years_experience, rating, completed_repairs, availability_status, hourly_rate, is_active) VALUES
    -- TechFix Mobile Center
    ('Rajesh Kumar', '+91-9876543210', 'rajesh@techfix.com', shop1_id, 'Koregaon Park', ARRAY['Screen Replacement', 'Battery Replacement', 'Charging Port'], 'expert', 8, 4.9, 850, 'available', 600, true),
    ('Pooja Gupta', '+91-9876543220', 'pooja@techfix.com', shop1_id, 'Koregaon Park', ARRAY['Water Damage', 'Motherboard Repair', 'Data Recovery'], 'master', 10, 4.8, 650, 'available', 800, true),
    
    -- QuickFix Solutions
    ('Priya Sharma', '+91-9876543211', 'priya@quickfix.com', shop2_id, 'Baner', ARRAY['Screen Replacement', 'Camera Repair', 'Software Issues'], 'expert', 7, 4.7, 720, 'available', 550, true),
    ('Vikram Singh', '+91-9876543221', 'vikram@quickfix.com', shop2_id, 'Baner', ARRAY['Battery Replacement', 'Charging Port', 'Speaker Repair'], 'intermediate', 5, 4.6, 480, 'busy', 450, true),
    
    -- Mobile Care Wakad
    ('Amit Patel', '+91-9876543212', 'amit@mobilecare.com', shop3_id, 'Wakad', ARRAY['Motherboard Repair', 'Water Damage', 'Advanced Diagnostics'], 'master', 12, 4.9, 920, 'available', 900, true),
    ('Kavita Desai', '+91-9876543222', 'kavita@mobilecare.com', shop3_id, 'Wakad', ARRAY['Screen Replacement', 'Battery Replacement', 'Accessories'], 'expert', 6, 4.5, 380, 'available', 500, true),
    
    -- Expert Mobile Repair
    ('Sneha Desai', '+91-9876543213', 'sneha@expertmobile.com', shop4_id, 'FC Road', ARRAY['All Repairs', 'Data Recovery', 'Premium Services'], 'master', 15, 4.9, 1200, 'available', 1000, true),
    ('Arjun Mehta', '+91-9876543223', 'arjun@expertmobile.com', shop4_id, 'FC Road', ARRAY['Screen Replacement', 'Camera Repair', 'Face ID Repair'], 'expert', 8, 4.7, 680, 'available', 650, true),
    
    -- Digital Repair Hub
    ('Kiran Joshi', '+91-9876543214', 'kiran@digitalrepair.com', shop5_id, 'Hadapsar', ARRAY['Software Issues', 'Motherboard Repair', 'Charging Port'], 'expert', 9, 4.6, 590, 'available', 700, true),
    ('Meera Kulkarni', '+91-9876543224', 'meera@digitalrepair.com', shop5_id, 'Hadapsar', ARRAY['Battery Replacement', 'Water Damage', 'Accessories'], 'intermediate', 4, 4.4, 320, 'available', 400, true)
  ON CONFLICT (phone) DO NOTHING;
END $$;

-- Sample mobile devices
INSERT INTO mobile_devices (brand, model) VALUES
  ('Apple', 'iPhone 15 Pro Max'),
  ('Apple', 'iPhone 15 Pro'),
  ('Apple', 'iPhone 15'),
  ('Apple', 'iPhone 14 Pro Max'),
  ('Apple', 'iPhone 14'),
  ('Apple', 'iPhone 13'),
  ('Samsung', 'Galaxy S24 Ultra'),
  ('Samsung', 'Galaxy S24'),
  ('Samsung', 'Galaxy S23 Ultra'),
  ('Samsung', 'Galaxy S23'),
  ('Samsung', 'Galaxy A54'),
  ('OnePlus', 'OnePlus 12'),
  ('OnePlus', 'OnePlus 11'),
  ('OnePlus', 'Nord 3'),
  ('Xiaomi', 'Xiaomi 14 Ultra'),
  ('Xiaomi', 'Xiaomi 13'),
  ('Xiaomi', 'Redmi Note 13 Pro'),
  ('Google', 'Pixel 8 Pro'),
  ('Google', 'Pixel 8'),
  ('Google', 'Pixel 7a'),
  ('Vivo', 'V30 Pro'),
  ('Oppo', 'Reno 11 Pro'),
  ('Realme', 'GT 5 Pro'),
  ('Nothing', 'Phone (2)'),
  ('Motorola', 'Edge 50 Pro')
ON CONFLICT (brand, model) DO NOTHING;

-- Sample reviews
INSERT INTO reviews (customer_name, device_model, rating, review_text, service_type, is_verified, shop_id, technician_id) 
SELECT 
  'Priya Sharma',
  'iPhone 14 Pro',
  5,
  'Excellent service! My iPhone screen was replaced within 30 minutes and it looks brand new. The technician was very professional and explained everything clearly.',
  'Screen Replacement',
  true,
  s.id,
  t.id
FROM shops s, technicians t 
WHERE s.name = 'TechFix Mobile Center' AND t.name = 'Rajesh Kumar'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_repair_requests_status ON repair_requests(status);
CREATE INDEX IF NOT EXISTS idx_repair_requests_created_at ON repair_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_technicians_area ON technicians(area);
CREATE INDEX IF NOT EXISTS idx_technicians_availability ON technicians(availability_status);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_shops_area ON shops(area);
CREATE INDEX IF NOT EXISTS idx_shops_rating ON shops(rating);

-- Update trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
DO $$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN 
    SELECT t.table_name 
    FROM information_schema.tables t
    JOIN information_schema.columns c ON t.table_name = c.table_name
    WHERE t.table_schema = 'public' 
    AND c.column_name = 'updated_at'
    AND t.table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%s_updated_at ON %s;
      CREATE TRIGGER update_%s_updated_at
        BEFORE UPDATE ON %s
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    ', table_name, table_name, table_name, table_name);
  END LOOP;
END $$;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();