-- Create product_deals table to track deals
CREATE TABLE public.product_deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  asin TEXT NOT NULL,
  deal_title TEXT,
  original_price NUMERIC,
  deal_price NUMERIC,
  discount_percentage NUMERIC,
  deal_start_date TIMESTAMP WITH TIME ZONE,
  deal_end_date TIMESTAMP WITH TIME ZONE,
  deal_type TEXT,
  is_active BOOLEAN DEFAULT true,
  deal_url TEXT,
  raw_deal_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add deal-related fields to products table
ALTER TABLE public.products 
ADD COLUMN current_deal_id UUID REFERENCES public.product_deals(id),
ADD COLUMN has_active_deal BOOLEAN DEFAULT false,
ADD COLUMN deal_last_updated TIMESTAMP WITH TIME ZONE;

-- Enable RLS on product_deals table
ALTER TABLE public.product_deals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for product_deals
CREATE POLICY "Anyone can read deals" 
ON public.product_deals 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage deals" 
ON public.product_deals 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_product_deals_asin ON public.product_deals(asin);
CREATE INDEX idx_product_deals_product_id ON public.product_deals(product_id);
CREATE INDEX idx_product_deals_active ON public.product_deals(is_active) WHERE is_active = true;
CREATE INDEX idx_product_deals_dates ON public.product_deals(deal_start_date, deal_end_date);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_product_deals_updated_at
BEFORE UPDATE ON public.product_deals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();