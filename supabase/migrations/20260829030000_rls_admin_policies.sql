-- Migration: RLS Admin Policies
-- Grants service_role full access to all tables, and anon INSERT for order creation (COD flow).
-- service_role key is used server-side in admin routes; anon key is used on the storefront.

-- orders
DROP POLICY IF EXISTS "Service role has full access to orders" ON orders;
CREATE POLICY "Service role has full access to orders"
  ON orders FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon can create orders" ON orders;
CREATE POLICY "Anon can create orders"
  ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);

-- order_items
DROP POLICY IF EXISTS "Service role has full access to order_items" ON order_items;
CREATE POLICY "Service role has full access to order_items"
  ON order_items FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon can create order_items" ON order_items;
CREATE POLICY "Anon can create order_items"
  ON order_items FOR INSERT TO anon, authenticated WITH CHECK (true);

-- customers
DROP POLICY IF EXISTS "Service role has full access to customers" ON customers;
CREATE POLICY "Service role has full access to customers"
  ON customers FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon can create customers" ON customers;
CREATE POLICY "Anon can create customers"
  ON customers FOR INSERT TO anon, authenticated WITH CHECK (true);

-- deliveries
DROP POLICY IF EXISTS "Service role has full access to deliveries" ON deliveries;
CREATE POLICY "Service role has full access to deliveries"
  ON deliveries FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon can create deliveries" ON deliveries;
CREATE POLICY "Anon can create deliveries"
  ON deliveries FOR INSERT TO anon, authenticated WITH CHECK (true);

-- order_timeline_events
DROP POLICY IF EXISTS "Service role has full access to order_timeline_events" ON order_timeline_events;
CREATE POLICY "Service role has full access to order_timeline_events"
  ON order_timeline_events FOR ALL TO service_role USING (true) WITH CHECK (true);

-- cod_reconciliations
DROP POLICY IF EXISTS "Service role has full access to cod_reconciliations" ON cod_reconciliations;
CREATE POLICY "Service role has full access to cod_reconciliations"
  ON cod_reconciliations FOR ALL TO service_role USING (true) WITH CHECK (true);

-- products
DROP POLICY IF EXISTS "Service role has full access to products" ON products;
CREATE POLICY "Service role has full access to products"
  ON products FOR ALL TO service_role USING (true) WITH CHECK (true);

-- categories
DROP POLICY IF EXISTS "Service role has full access to categories" ON categories;
CREATE POLICY "Service role has full access to categories"
  ON categories FOR ALL TO service_role USING (true) WITH CHECK (true);

-- collections
DROP POLICY IF EXISTS "Service role has full access to collections" ON collections;
CREATE POLICY "Service role has full access to collections"
  ON collections FOR ALL TO service_role USING (true) WITH CHECK (true);

-- product_collections
DROP POLICY IF EXISTS "Service role has full access to product_collections" ON product_collections;
CREATE POLICY "Service role has full access to product_collections"
  ON product_collections FOR ALL TO service_role USING (true) WITH CHECK (true);

-- variants
DROP POLICY IF EXISTS "Service role has full access to variants" ON variants;
CREATE POLICY "Service role has full access to variants"
  ON variants FOR ALL TO service_role USING (true) WITH CHECK (true);

-- product_media
DROP POLICY IF EXISTS "Service role has full access to product_media" ON product_media;
CREATE POLICY "Service role has full access to product_media"
  ON product_media FOR ALL TO service_role USING (true) WITH CHECK (true);
