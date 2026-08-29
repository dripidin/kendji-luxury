-- KenDji Luxury — Operations, Audit Timeline & Inventory Extensions

-- 1. Extend orders status enum check to include complete operational states
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('PENDING', 'CONFIRMED', 'PREPARING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'));

-- 2. Extend deliveries status enum check to include normalized statuses
ALTER TABLE deliveries DROP CONSTRAINT IF EXISTS deliveries_status_check;
ALTER TABLE deliveries ADD CONSTRAINT deliveries_status_check 
  CHECK (status IN ('PENDING', 'CREATED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'RETURNED', 'CANCELLED'));

-- 3. Order Timeline Events (Audit Log)
CREATE TABLE IF NOT EXISTS order_timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    actor TEXT NOT NULL DEFAULT 'ADMIN_OPERATOR',
    tracking_number TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. COD Reconciliation Records
CREATE TABLE IF NOT EXISTS cod_reconciliations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    expected_amount NUMERIC NOT NULL CHECK (expected_amount >= 0),
    collected_amount NUMERIC NOT NULL CHECK (collected_amount >= 0),
    difference NUMERIC NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'COLLECTED', 'RECONCILED', 'DISCREPANCY')),
    reconciled_at TIMESTAMPTZ,
    reconciled_by TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE order_timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE cod_reconciliations ENABLE ROW LEVEL SECURITY;
