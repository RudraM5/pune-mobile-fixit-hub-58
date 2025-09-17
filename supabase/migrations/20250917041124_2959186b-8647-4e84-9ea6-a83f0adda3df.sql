-- Add admin role to the existing user
INSERT INTO public.user_roles (user_id, role)
VALUES ('fbf229d2-a8cc-413c-9971-4b717d0243ff', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;