-- Enable Row Level Security on customers table (if not already enabled)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate them properly
DROP POLICY IF EXISTS "Users can create their own customer record" ON public.customers;
DROP POLICY IF EXISTS "Users can view their own customer record" ON public.customers;
DROP POLICY IF EXISTS "Users can update their own customer record" ON public.customers;
DROP POLICY IF EXISTS "Allow guest bookings" ON public.customers;
DROP POLICY IF EXISTS "Allow viewing customer records for repair management" ON public.customers;

-- Allow both authenticated and guest users to create customer records
CREATE POLICY "Allow customer creation for bookings" 
ON public.customers 
FOR INSERT 
WITH CHECK (true);

-- Allow users to view customer records (needed for admin dashboard and user management)
CREATE POLICY "Allow viewing customer records" 
ON public.customers 
FOR SELECT 
USING (true);

-- Allow authenticated users to update customer records
CREATE POLICY "Allow customer updates" 
ON public.customers 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid() IS NOT NULL);