-- Enable Row Level Security on devices table
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

-- Allow users to create device records during booking
CREATE POLICY "Allow device creation for bookings" 
ON public.devices 
FOR INSERT 
WITH CHECK (true);

-- Allow users to view device records (needed for booking and admin features)
CREATE POLICY "Allow viewing device records" 
ON public.devices 
FOR SELECT 
USING (true);

-- Allow admin updates to device records
CREATE POLICY "Allow device updates" 
ON public.devices 
FOR UPDATE 
USING (true);