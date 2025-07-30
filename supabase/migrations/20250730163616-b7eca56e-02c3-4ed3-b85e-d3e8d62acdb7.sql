-- Make all tables publicly readable for a fully open site
-- Keep admin write access but allow public read access

-- Products - allow everyone to read
DROP POLICY IF EXISTS "Anyone can read products" ON public.products;
DROP POLICY IF EXISTS "Everyone can view products" ON public.products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;

CREATE POLICY "Public can read all products" 
ON public.products FOR SELECT 
USING (true);

-- Product deals - allow everyone to read
DROP POLICY IF EXISTS "Anyone can read deals" ON public.product_deals;
CREATE POLICY "Public can read all deals" 
ON public.product_deals FOR SELECT 
USING (true);

-- Product API snapshots - allow everyone to read
DROP POLICY IF EXISTS "Anyone can read snapshots" ON public.product_api_snapshots;
CREATE POLICY "Public can read all snapshots" 
ON public.product_api_snapshots FOR SELECT 
USING (true);

-- Categories - allow everyone to read
DROP POLICY IF EXISTS "Anyone can read categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
CREATE POLICY "Public can read all categories" 
ON public.categories FOR SELECT 
USING (true);

-- Blog posts - allow everyone to read published posts
DROP POLICY IF EXISTS "Anyone can read published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;
CREATE POLICY "Public can read published blog posts" 
ON public.blog_posts FOR SELECT 
USING (published = true);

-- Blog tags - allow everyone to read
DROP POLICY IF EXISTS "Anyone can read blog tags" ON public.blog_tags;
CREATE POLICY "Public can read all blog tags" 
ON public.blog_tags FOR SELECT 
USING (true);

-- Blog post tags - allow everyone to read
DROP POLICY IF EXISTS "Anyone can read blog post tags" ON public.blog_post_tags;
CREATE POLICY "Public can read all blog post tags" 
ON public.blog_post_tags FOR SELECT 
USING (true);

-- Settings - allow everyone to read public settings
DROP POLICY IF EXISTS "Anyone can read settings" ON public.settings;
CREATE POLICY "Public can read all settings" 
ON public.settings FOR SELECT 
USING (true);

-- Affiliate links - allow everyone to read
DROP POLICY IF EXISTS "Allow public read access to affiliate links" ON public.affiliate_links;
CREATE POLICY "Public can read all affiliate links" 
ON public.affiliate_links FOR SELECT 
USING (true);