ALTER TABLE sdsp_products ADD COLUMN IF NOT EXISTS price_basis TEXT NOT NULL DEFAULT 'cost' CHECK (price_basis IN ('cost', 'selling'));
ALTER TABLE sdsp_products ADD COLUMN IF NOT EXISTS source_metadata JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE sdsp_price_tiers ADD COLUMN IF NOT EXISTS source_metadata JSONB NOT NULL DEFAULT '{}'::jsonb;
