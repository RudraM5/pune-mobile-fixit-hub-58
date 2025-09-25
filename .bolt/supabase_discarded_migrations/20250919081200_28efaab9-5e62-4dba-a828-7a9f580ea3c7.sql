-- Fix the search path security warning by updating the function
CREATE OR REPLACE FUNCTION public.create_repair_booking(
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_customer_email TEXT,
  p_customer_address TEXT,
  p_device_brand TEXT,
  p_device_model TEXT,
  p_shop_id UUID,
  p_total_amount NUMERIC,
  p_pickup_preferred BOOLEAN DEFAULT false,
  p_issue_description TEXT DEFAULT NULL,
  p_services JSONB DEFAULT '[]'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request_id UUID;
  v_service JSONB;
BEGIN
  -- Create the repair request
  INSERT INTO repair_requests (
    user_id,
    customer_name,
    customer_phone,
    customer_email,
    customer_address,
    device_brand,
    device_model,
    shop_id,
    total_amount,
    pickup_preferred,
    issue_description,
    status,
    priority
  )
  VALUES (
    auth.uid(),
    p_customer_name,
    p_customer_phone,
    p_customer_email,
    p_customer_address,
    p_device_brand,
    p_device_model,
    p_shop_id,
    p_total_amount,
    p_pickup_preferred,
    p_issue_description,
    'pending',
    'medium'
  )
  RETURNING id INTO v_request_id;

  -- Add services to repair_request_services table
  FOR v_service IN SELECT * FROM jsonb_array_elements(p_services)
  LOOP
    INSERT INTO repair_request_services (
      repair_request_id,
      service_id,
      quantity,
      unit_price,
      total_price
    )
    VALUES (
      v_request_id,
      (v_service->'service'->>'id')::uuid,
      (v_service->>'quantity')::integer,
      (v_service->'service'->>'price')::numeric,
      (v_service->>'quantity')::integer * (v_service->'service'->>'price')::numeric
    );
  END LOOP;

  RETURN v_request_id;
END;
$$;