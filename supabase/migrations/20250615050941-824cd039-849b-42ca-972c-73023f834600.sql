-- Create some sample customers (without user_id for demo)
INSERT INTO public.customers (name, phone, email, address) VALUES
('Rohit Singh', '+919876543214', 'rohit@example.com', 'Pune, Maharashtra'),
('Sneha Joshi', '+919876543215', 'sneha@example.com', 'Pune, Maharashtra'),
('Vikram Desai', '+919876543216', 'vikram@example.com', 'Pune, Maharashtra');

-- Create some sample technicians (without user_id for demo)
INSERT INTO public.technicians (name, phone, email, specialization, is_active) VALUES
('Raj Kumar', '+919876543211', 'raj@mobilerepairwala.com', ARRAY['Screen Repair', 'Battery Replacement'], true),
('Priya Sharma', '+919876543212', 'priya@mobilerepairwala.com', ARRAY['Camera Repair', 'Water Damage'], true),
('Amit Patel', '+919876543213', 'amit@mobilerepairwala.com', ARRAY['Software Issues', 'Data Recovery'], true);

-- Create some sample repair requests
INSERT INTO public.repair_requests (customer_id, device_id, technician_id, status, priority, description, estimated_completion, total_amount, notes) VALUES
(
  (SELECT id FROM public.customers WHERE name = 'Rohit Singh'), 
  (SELECT id FROM public.devices WHERE brand = 'Apple' AND model = 'iPhone 14'),
  (SELECT id FROM public.technicians WHERE name = 'Raj Kumar'),
  'in-progress', 
  'high', 
  'Screen cracked after drop', 
  NOW() + INTERVAL '2 hours',
  2999.00,
  'Customer waiting in store'
),
(
  (SELECT id FROM public.customers WHERE name = 'Sneha Joshi'),
  (SELECT id FROM public.devices WHERE brand = 'Samsung' AND model = 'Galaxy S23'),
  (SELECT id FROM public.technicians WHERE name = 'Priya Sharma'),
  'pending',
  'medium',
  'Battery draining quickly',
  NOW() + INTERVAL '1 day',
  1499.00,
  'Diagnostic required'
),
(
  (SELECT id FROM public.customers WHERE name = 'Vikram Desai'),
  (SELECT id FROM public.devices WHERE brand = 'OnePlus' AND model = 'OnePlus 11'),
  (SELECT id FROM public.technicians WHERE name = 'Amit Patel'),
  'completed',
  'low',
  'Phone not starting',
  NOW() - INTERVAL '1 hour',
  699.00,
  'Software reflash completed'
);

-- Link services to repair requests
INSERT INTO public.repair_request_services (repair_request_id, service_id, quantity, price) VALUES
(
  (SELECT rr.id FROM public.repair_requests rr JOIN public.customers c ON rr.customer_id = c.id WHERE c.name = 'Rohit Singh'),
  (SELECT id FROM public.services WHERE name = 'Screen Replacement'),
  1,
  2999.00
),
(
  (SELECT rr.id FROM public.repair_requests rr JOIN public.customers c ON rr.customer_id = c.id WHERE c.name = 'Sneha Joshi'),
  (SELECT id FROM public.services WHERE name = 'Battery Replacement'),
  1,
  1499.00
),
(
  (SELECT rr.id FROM public.repair_requests rr JOIN public.customers c ON rr.customer_id = c.id WHERE c.name = 'Vikram Desai'),
  (SELECT id FROM public.services WHERE name = 'Software Issues'),
  1,
  699.00
);