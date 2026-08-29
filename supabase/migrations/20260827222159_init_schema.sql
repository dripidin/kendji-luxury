-- Categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Collections
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT UNIQUE,
    short_description TEXT,
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    base_price NUMERIC NOT NULL CHECK (base_price >= 0),
    currency TEXT DEFAULT 'DZD',
    status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    is_featured BOOLEAN DEFAULT false,
    story TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Product Collections
CREATE TABLE product_collections (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, collection_id)
);

-- Variants
CREATE TABLE variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    sku TEXT,
    price_override NUMERIC CHECK (price_override >= 0),
    stock INTEGER CHECK (stock >= 0),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Product Media
CREATE TABLE product_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES variants(id) ON DELETE SET NULL,
    url TEXT NOT NULL,
    role TEXT DEFAULT 'GALLERY' CHECK (role IN ('COVER', 'GALLERY', 'DETAIL', 'VARIANT', 'LIFESTYLE')),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
    payment_method TEXT DEFAULT 'COD',
    payment_status TEXT DEFAULT 'UNPAID' CHECK (payment_status IN ('UNPAID', 'PAID')),
    subtotal NUMERIC NOT NULL CHECK (subtotal >= 0),
    delivery_fee NUMERIC NOT NULL CHECK (delivery_fee >= 0),
    total NUMERIC NOT NULL CHECK (total >= 0),
    currency TEXT DEFAULT 'DZD',
    delivery_wilaya TEXT NOT NULL,
    delivery_commune TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Order Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES variants(id) ON DELETE SET NULL,
    product_name_snapshot TEXT NOT NULL,
    variant_label_snapshot TEXT,
    unit_price NUMERIC NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    line_total NUMERIC NOT NULL CHECK (line_total >= 0),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Deliveries
CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    provider TEXT,
    tracking_number TEXT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'RETURNED')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Site Settings
CREATE TABLE site_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    brand_name TEXT DEFAULT 'KenDji Luxury',
    contact_email TEXT,
    contact_phone TEXT,
    social_links JSONB,
    default_currency TEXT DEFAULT 'DZD',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS) Enablement
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Public Storefront (Read-Only)
-- Categories & Collections are readable if active
CREATE POLICY "Public categories are viewable" ON categories FOR SELECT USING (active = true);
CREATE POLICY "Public collections are viewable" ON collections FOR SELECT USING (active = true);

-- Products are readable if published
CREATE POLICY "Published products are viewable" ON products FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Published product connections are viewable" ON product_collections FOR SELECT USING (
    product_id IN (SELECT id FROM products WHERE status = 'PUBLISHED')
);
CREATE POLICY "Published variants are viewable" ON variants FOR SELECT USING (
    product_id IN (SELECT id FROM products WHERE status = 'PUBLISHED')
);
CREATE POLICY "Published product media is viewable" ON product_media FOR SELECT USING (
    product_id IN (SELECT id FROM products WHERE status = 'PUBLISHED')
);

-- Site settings are always readable publicly
CREATE POLICY "Site settings are viewable" ON site_settings FOR SELECT USING (true);

-- Note: All other operations (INSERT/UPDATE/DELETE) and protected tables (Customers, Orders, etc.) 
-- will be handled by authenticated admins via Auth policies or Service Role bypass on the backend.
