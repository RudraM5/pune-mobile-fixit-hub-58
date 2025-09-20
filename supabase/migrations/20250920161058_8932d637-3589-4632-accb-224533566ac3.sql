-- Insert shops data
INSERT INTO public.shops (id, name, owner_name, phone, email, address, area, latitude, longitude, is_active, rating, total_repairs) VALUES
(gen_random_uuid(), 'TechFix Mobile Solutions', 'Rajesh Kumar', '+91-9876543210', 'rajesh@techfix.com', '123 Main Street, Electronic City', 'Electronic City', 12.845966, 77.662300, true, 4.8, 150),
(gen_random_uuid(), 'QuickRepair Hub', 'Amit Sharma', '+91-9876543211', 'amit@quickrepair.com', '456 Tech Park Road, Whitefield', 'Whitefield', 12.970000, 77.750000, true, 4.6, 120),
(gen_random_uuid(), 'Smart Device Care', 'Priya Singh', '+91-9876543212', 'priya@smartcare.com', '789 IT Corridor, Marathahalli', 'Marathahalli', 12.956924, 77.697300, true, 4.7, 95),
(gen_random_uuid(), 'Mobile Masters', 'Suresh Reddy', '+91-9876543213', 'suresh@mobilemasters.com', '321 Ring Road, Koramangala', 'Koramangala', 12.935000, 77.624000, true, 4.5, 180),
(gen_random_uuid(), 'Digital Care Center', 'Neha Gupta', '+91-9876543214', 'neha@digitalcare.com', '654 Commercial Street, Brigade Road', 'Brigade Road', 12.975000, 77.610000, true, 4.9, 200),
(gen_random_uuid(), 'Express Mobile Repair', 'Kiran Patel', '+91-9876543215', 'kiran@expressrepair.com', '987 Main Road, Jayanagar', 'Jayanagar', 12.925000, 77.583000, true, 4.4, 85),
(gen_random_uuid(), 'Tech Savvy Solutions', 'Vikram Joshi', '+91-9876543216', 'vikram@techsavvy.com', '147 Cross Road, Indiranagar', 'Indiranagar', 12.978000, 77.640000, true, 4.6, 110),
(gen_random_uuid(), 'Gadget Clinic', 'Ravi Shankar', '+91-9876543217', 'ravi@gadgetclinic.com', '258 Service Road, HSR Layout', 'HSR Layout', 12.910000, 77.647000, true, 4.7, 95);

-- Get shop IDs for technician insertion
DO $$
DECLARE
    shop_ids uuid[];
BEGIN
    -- Get all shop IDs
    SELECT ARRAY(SELECT id FROM public.shops ORDER BY name) INTO shop_ids;
    
    -- Insert technicians data
    INSERT INTO public.technicians (id, name, phone, email, shop_id, specialization, expertise_level, years_experience, rating, completed_repairs, availability_status, hourly_rate, area, is_active) VALUES
    (gen_random_uuid(), 'Arjun Verma', '+91-9876543220', 'arjun@techfix.com', shop_ids[1], ARRAY['Screen Replacement', 'Battery Replacement'], 'expert', 5, 4.8, 200, 'available', 500, 'Electronic City', true),
    (gen_random_uuid(), 'Sneha Kapoor', '+91-9876543221', 'sneha@quickrepair.com', shop_ids[2], ARRAY['Water Damage Repair', 'Software Issues'], 'expert', 4, 4.6, 150, 'available', 450, 'Whitefield', true),
    (gen_random_uuid(), 'Rohit Sharma', '+91-9876543222', 'rohit@smartcare.com', shop_ids[3], ARRAY['Speaker Repair', 'Charging Port'], 'intermediate', 3, 4.5, 100, 'busy', 350, 'Marathahalli', true),
    (gen_random_uuid(), 'Meera Krishnan', '+91-9876543223', 'meera@mobilemasters.com', shop_ids[4], ARRAY['Camera Repair', 'Button Replacement'], 'expert', 6, 4.9, 250, 'available', 550, 'Koramangala', true),
    (gen_random_uuid(), 'Deepak Yadav', '+91-9876543224', 'deepak@digitalcare.com', shop_ids[5], ARRAY['Screen Replacement', 'Water Damage Repair'], 'master', 8, 4.9, 300, 'available', 600, 'Brigade Road', true),
    (gen_random_uuid(), 'Kavya Nair', '+91-9876543225', 'kavya@expressrepair.com', shop_ids[6], ARRAY['Battery Replacement', 'Software Issues'], 'intermediate', 2, 4.3, 80, 'available', 300, 'Jayanagar', true),
    (gen_random_uuid(), 'Sanjay Kumar', '+91-9876543226', 'sanjay@techsavvy.com', shop_ids[7], ARRAY['Charging Port', 'Speaker Repair'], 'expert', 5, 4.7, 180, 'offline', 500, 'Indiranagar', true),
    (gen_random_uuid(), 'Asha Reddy', '+91-9876543227', 'asha@gadgetclinic.com', shop_ids[8], ARRAY['Camera Repair', 'Screen Replacement'], 'expert', 4, 4.6, 120, 'available', 450, 'HSR Layout', true);
END $$;

-- Insert mobile devices
INSERT INTO public.mobile_devices (brand, model) VALUES
('iPhone', 'iPhone 14 Pro'),
('iPhone', 'iPhone 13'),
('iPhone', 'iPhone 12'),
('Samsung', 'Galaxy S23 Ultra'),
('Samsung', 'Galaxy S22'),
('Samsung', 'Galaxy A54'),
('OnePlus', 'OnePlus 11'),
('OnePlus', 'OnePlus 10 Pro'),
('Xiaomi', 'Mi 13 Pro'),
('Xiaomi', 'Redmi Note 12'),
('Google', 'Pixel 7 Pro'),
('Google', 'Pixel 6a'),
('Oppo', 'Find X5 Pro'),
('Vivo', 'V27 Pro'),
('Realme', 'GT 3');

-- Insert service categories
INSERT INTO public.service_categories (name, slug, description, is_active) VALUES
('Screen Repair', 'screen-repair', 'All types of screen and display related repairs', true),
('Battery Service', 'battery-service', 'Battery replacement and power-related issues', true),
('Water Damage', 'water-damage', 'Water damage repair and restoration services', true),
('Software Issues', 'software-issues', 'Operating system and software related problems', true),
('Hardware Repair', 'hardware-repair', 'Internal component repairs and replacements', true),
('Audio Issues', 'audio-issues', 'Speaker, microphone, and audio-related repairs', true);

-- Get category IDs for services insertion
DO $$
DECLARE
    screen_cat_id uuid;
    battery_cat_id uuid;
    water_cat_id uuid;
    software_cat_id uuid;
    hardware_cat_id uuid;
    audio_cat_id uuid;
BEGIN
    -- Get category IDs
    SELECT id INTO screen_cat_id FROM public.service_categories WHERE slug = 'screen-repair';
    SELECT id INTO battery_cat_id FROM public.service_categories WHERE slug = 'battery-service';
    SELECT id INTO water_cat_id FROM public.service_categories WHERE slug = 'water-damage';
    SELECT id INTO software_cat_id FROM public.service_categories WHERE slug = 'software-issues';
    SELECT id INTO hardware_cat_id FROM public.service_categories WHERE slug = 'hardware-repair';
    SELECT id INTO audio_cat_id FROM public.service_categories WHERE slug = 'audio-issues';
    
    -- Insert services
    INSERT INTO public.services (name, description, price, duration, category_id, is_active) VALUES
    ('Screen Replacement', 'Complete screen and display replacement service', 2500.00, '2-3 hours', screen_cat_id, true),
    ('Screen Repair', 'Minor screen damage repair without replacement', 1200.00, '1-2 hours', screen_cat_id, true),
    ('Touch Screen Fix', 'Touch sensitivity and responsiveness repair', 800.00, '1 hour', screen_cat_id, true),
    ('Battery Replacement', 'Original battery replacement service', 1500.00, '1 hour', battery_cat_id, true),
    ('Charging Port Repair', 'Charging port cleaning and repair', 600.00, '30 minutes', battery_cat_id, true),
    ('Power Button Fix', 'Power button repair or replacement', 400.00, '45 minutes', hardware_cat_id, true),
    ('Water Damage Repair', 'Complete water damage assessment and repair', 3000.00, '4-6 hours', water_cat_id, true),
    ('Logic Board Repair', 'Motherboard component repair', 4000.00, '6-8 hours', water_cat_id, true),
    ('Software Troubleshooting', 'OS issues and software problems', 500.00, '1 hour', software_cat_id, true),
    ('Data Recovery', 'Recover lost or corrupted data', 1000.00, '2-4 hours', software_cat_id, true),
    ('Speaker Repair', 'Speaker replacement or repair service', 800.00, '1 hour', audio_cat_id, true),
    ('Microphone Fix', 'Microphone repair or replacement', 600.00, '45 minutes', audio_cat_id, true),
    ('Camera Repair', 'Front or rear camera repair/replacement', 2000.00, '2 hours', hardware_cat_id, true),
    ('Button Replacement', 'Volume, home, or other button repairs', 400.00, '30 minutes', hardware_cat_id, true);
END $$;