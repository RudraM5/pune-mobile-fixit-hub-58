-- Insert initial data to populate the database

-- Insert service categories
INSERT INTO public.service_categories (name, description, slug) VALUES
('Basic Repairs', 'Common repair services', 'basic'),
('Advanced Repairs', 'Complex technical repairs', 'advanced'),
('Accessories', 'Protective accessories', 'accessories'),
('Premium Services', 'Special services', 'premium');

-- Insert services (using category IDs)
INSERT INTO public.services (name, description, price, duration, category_id) 
SELECT 
    s.name, 
    s.description, 
    s.price, 
    s.duration, 
    sc.id
FROM (VALUES
    ('Screen Replacement', 'High-quality OLED/LCD display replacement', 1500.00, '30 mins', 'basic'),
    ('Battery Replacement', 'Original capacity battery replacement', 1200.00, '20 mins', 'basic'),
    ('Charging Port Repair', 'Fix charging port issues', 800.00, '45 mins', 'basic'),
    ('Speaker Repair', 'Fix audio issues and speaker replacement', 600.00, '30 mins', 'basic'),
    ('Motherboard Repair', 'Circuit board and chip-level repairs', 3500.00, '2-4 hours', 'advanced'),
    ('Water Damage Treatment', 'Complete liquid damage recovery service', 2500.00, '4-6 hours', 'advanced'),
    ('Camera Repair', 'Front/rear camera module replacement', 1800.00, '45 mins', 'advanced'),
    ('Face ID/Touch ID Repair', 'Biometric sensor repair', 2200.00, '1 hour', 'advanced'),
    ('Tempered Glass', '9H hardness screen protector', 200.00, '5 mins', 'accessories'),
    ('Phone Cover', 'Protective case installation', 300.00, '2 mins', 'accessories'),
    ('Screen Guard', 'Anti-glare screen protection', 150.00, '5 mins', 'accessories'),
    ('On-Call Technician', 'Technician visits your location', 500.00, 'Travel time', 'premium'),
    ('Express Service', 'Priority repair service', 300.00, 'Half the time', 'premium'),
    ('Data Recovery', 'Recover data from damaged devices', 1500.00, '2-8 hours', 'premium')
) AS s(name, description, price, duration, category_slug)
JOIN public.service_categories sc ON sc.slug = s.category_slug;

-- Insert mobile devices
INSERT INTO public.mobile_devices (brand, model) VALUES
('iPhone', 'iPhone 15 Pro'),
('iPhone', 'iPhone 14 Pro'),
('iPhone', 'iPhone 13'),
('Samsung', 'Galaxy S24'),
('Samsung', 'Galaxy S23'),
('OnePlus', 'OnePlus 12'),
('OnePlus', 'OnePlus 11'),
('Xiaomi', 'Xiaomi 13'),
('Google', 'Pixel 7'),
('Nothing', 'Nothing Phone 2');

-- Insert shops
INSERT INTO public.shops (name, owner_name, phone, email, address, area, rating, total_repairs) VALUES
('Mobile Repairwala FC Road', 'Rajesh Kumar', '+91 98765 43210', 'fcroad@mobilerepairwala.com', 'Shop No. 15, Lane 5, FC Road, Pune', 'FC Road', 4.8, 1250),
('Mobile Repairwala Koregaon Park', 'Priya Sharma', '+91 87654 32109', 'kp@mobilerepairwala.com', 'Unit 3B, North Main Road, Koregaon Park, Pune', 'Koregaon Park', 4.7, 980),
('Mobile Repairwala Baner', 'Amit Patel', '+91 76543 21098', 'baner@mobilerepairwala.com', 'Shop No. 8, Baner Road, Pune', 'Baner', 4.6, 750),
('Mobile Repairwala Kothrud', 'Sneha Gupta', '+91 65432 10987', 'kothrud@mobilerepairwala.com', 'A-12, Kothrud Depot, Pune', 'Kothrud', 4.5, 620);

-- Insert technicians
INSERT INTO public.technicians (name, phone, email, shop_id, specialization, expertise_level, years_experience, rating, completed_repairs, area, bio, certifications)
SELECT 
    t.name,
    t.phone,
    t.email,
    s.id,
    t.specialization,
    t.expertise_level,
    t.years_experience,
    t.rating,
    t.completed_repairs,
    t.area,
    t.bio,
    t.certifications
FROM (VALUES
    ('Priyanka Das', '+91 98765 00001', 'priyanka@mobilerepairwala.com', 'Mobile Repairwala FC Road', ARRAY['Screen Replacement', 'Data Recovery', 'Software Issues'], 'master', 8, 4.9, 2850, 'FC Road', 'Master technician specializing in complex repairs and data recovery. Expert in iPhone diagnostics and component-level repairs.', ARRAY['Apple Certified Technician', 'Data Recovery Specialist']),
    ('Pooja Gupta', '+91 98765 00002', 'pooja@mobilerepairwala.com', 'Mobile Repairwala Koregaon Park', ARRAY['Water Damage', 'Motherboard Repair', 'Software Issues'], 'expert', 7, 4.8, 2120, 'Koregaon Park', 'Water damage and motherboard repair expert. Specialized in retrieving devices from severe liquid damage with advanced cleaning techniques.', ARRAY['Samsung Certified Repair', 'Motherboard Specialist']),
    ('Kiran Patil', '+91 98765 00003', 'kiran@mobilerepairwala.com', 'Mobile Repairwala Baner', ARRAY['Motherboard Repair', 'Water Damage', 'Data Recovery'], 'master', 9, 4.7, 3140, 'Baner', 'Master technician with 9+ years of experience in complex motherboard repairs and micro-soldering. Expert in component-level diagnostics.', ARRAY['Master Technician', 'Component Level Repair']),
    ('Kavita Desai', '+91 98765 00004', 'kavita@mobilerepairwala.com', 'Mobile Repairwala Kothrud', ARRAY['Water Damage', 'Charging Port', 'Software Issues'], 'expert', 7, 4.6, 2250, 'Kothrud', 'Expert in water damage restoration and charging port repairs. Known for quick diagnostics and efficient repair solutions.', ARRAY['Software Specialist', 'Hardware Diagnostic Expert'])
) AS t(name, phone, email, shop_name, specialization, expertise_level, years_experience, rating, completed_repairs, area, bio, certifications)
JOIN public.shops s ON s.name = t.shop_name;

-- Insert some sample reviews
INSERT INTO public.reviews (customer_name, rating, review_text, service_type, device_model, is_verified, is_featured, technician_id, shop_id)
SELECT 
    r.customer_name,
    r.rating,
    r.review_text,
    r.service_type,
    r.device_model,
    r.is_verified,
    r.is_featured,
    t.id,
    s.id
FROM (VALUES
    ('Priya Sharma', 5, 'Excellent service! My iPhone screen was replaced within 30 minutes and it looks brand new. The technician was very professional and explained everything clearly.', 'Screen Replacement', 'iPhone 14 Pro', true, true, 'Priyanka Das', 'Mobile Repairwala FC Road'),
    ('Rohit Patel', 5, 'Amazing experience! They picked up my phone from home, fixed the battery issue, and delivered it back the same day. Highly recommended!', 'Battery Replacement', 'Samsung Galaxy S23', true, true, 'Pooja Gupta', 'Mobile Repairwala Koregaon Park'),
    ('Anita Desai', 4, 'Good service and fair pricing. The water damage repair took a bit longer than expected, but they kept me updated throughout the process.', 'Water Damage Repair', 'OnePlus 11', true, false, 'Kavita Desai', 'Mobile Repairwala Kothrud'),
    ('Vikram Singh', 5, 'Fantastic work! They managed to recover all my data from my damaged phone. The team is skilled and trustworthy.', 'Data Recovery', 'iPhone 13', true, true, 'Kiran Patil', 'Mobile Repairwala Baner')
) AS r(customer_name, rating, review_text, service_type, device_model, is_verified, is_featured, tech_name, shop_name)
JOIN public.technicians t ON t.name = r.tech_name
JOIN public.shops s ON s.name = r.shop_name;

-- Insert before/after gallery items
INSERT INTO public.before_after_gallery (title, device_model, service_type, description, is_featured, technician_id)
SELECT 
    g.title,
    g.device_model,
    g.service_type,
    g.description,
    g.is_featured,
    t.id
FROM (VALUES
    ('iPhone 14 Screen Replacement', 'iPhone 14 Pro', 'Screen Replacement', 'Completely shattered screen restored to factory condition with genuine Apple parts.', true, 'Priyanka Das'),
    ('Samsung Galaxy Water Damage Recovery', 'Samsung Galaxy S23', 'Water Damage Repair', 'Phone fell in water, full restoration including motherboard cleaning and component replacement.', true, 'Pooja Gupta'),
    ('OnePlus Charging Port Repair', 'OnePlus 11', 'Charging Port Repair', 'Loose charging port causing intermittent charging issues, replaced with OEM part.', false, 'Kiran Patil')
) AS g(title, device_model, service_type, description, is_featured, tech_name)
JOIN public.technicians t ON t.name = g.tech_name;

-- Insert video testimonials
INSERT INTO public.video_testimonials (customer_name, title, service_type, rating, is_featured, video_url) VALUES
('Rahul Gupta', 'Amazing Screen Replacement Service', 'Screen Replacement', 5, true, 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
('Kavya Nair', 'Water Damage Recovery Success', 'Water Damage Repair', 5, true, 'https://www.youtube.com/embed/dQw4w9WgXcQ');