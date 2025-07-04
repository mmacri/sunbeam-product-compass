-- Phase 1: Enhance products table with API tracking fields
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS asin TEXT,
ADD COLUMN IF NOT EXISTS api_last_updated TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS api_source TEXT DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS price_history JSONB DEFAULT '[]'::jsonb;

-- Create index on asin for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_asin ON public.products(asin);

-- Create product_api_snapshots table for historical tracking
CREATE TABLE IF NOT EXISTS public.product_api_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  asin TEXT NOT NULL,
  api_source TEXT NOT NULL,
  raw_data JSONB NOT NULL,
  price_at_time NUMERIC,
  availability_at_time BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_snapshots_product_id ON public.product_api_snapshots(product_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_asin ON public.product_api_snapshots(asin);
CREATE INDEX IF NOT EXISTS idx_snapshots_created_at ON public.product_api_snapshots(created_at);

-- Enable RLS on the new table
ALTER TABLE public.product_api_snapshots ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for product_api_snapshots
CREATE POLICY "Admins can manage all snapshots" 
ON public.product_api_snapshots 
FOR ALL 
USING (is_admin(auth.uid()));

CREATE POLICY "Anyone can read snapshots" 
ON public.product_api_snapshots 
FOR SELECT 
USING (true);