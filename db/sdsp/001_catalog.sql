BEGIN;

CREATE TABLE IF NOT EXISTS sdsp_catalog_versions (
  id BIGSERIAL PRIMARY KEY,
  version_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'retired')),
  effective_from TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sdsp_import_batches (
  id BIGSERIAL PRIMARY KEY,
  catalog_version_id BIGINT NOT NULL REFERENCES sdsp_catalog_versions(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('xml', 'csv')),
  source_name TEXT NOT NULL,
  source_external_id TEXT,
  source_checksum TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'completed', 'failed')),
  record_count INTEGER NOT NULL DEFAULT 0,
  report JSONB NOT NULL DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE (catalog_version_id, source_checksum)
);

CREATE TABLE IF NOT EXISTS sdsp_categories (
  id BIGSERIAL PRIMARY KEY,
  category_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sdsp_products (
  id BIGSERIAL PRIMARY KEY,
  catalog_version_id BIGINT NOT NULL REFERENCES sdsp_catalog_versions(id) ON DELETE CASCADE,
  category_id BIGINT NOT NULL REFERENCES sdsp_categories(id),
  product_code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  default_markup_percent NUMERIC(7, 3) NOT NULL DEFAULT 40,
  source_external_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'retired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (catalog_version_id, product_code)
);

CREATE TABLE IF NOT EXISTS sdsp_option_groups (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES sdsp_products(id) ON DELETE CASCADE,
  group_code TEXT NOT NULL,
  label TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, group_code)
);

CREATE TABLE IF NOT EXISTS sdsp_option_values (
  id BIGSERIAL PRIMARY KEY,
  option_group_id BIGINT NOT NULL REFERENCES sdsp_option_groups(id) ON DELETE CASCADE,
  value_code TEXT NOT NULL,
  label TEXT NOT NULL,
  source_node_key TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (option_group_id, value_code)
);

CREATE TABLE IF NOT EXISTS sdsp_configurations (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES sdsp_products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL UNIQUE,
  sku_status TEXT NOT NULL DEFAULT 'provisional' CHECK (sku_status IN ('provisional', 'final')),
  source_price_key TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'retired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, source_price_key)
);

CREATE TABLE IF NOT EXISTS sdsp_sku_aliases (
  id BIGSERIAL PRIMARY KEY,
  configuration_id BIGINT NOT NULL REFERENCES sdsp_configurations(id) ON DELETE CASCADE,
  sku_alias TEXT NOT NULL UNIQUE,
  retired_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reason TEXT NOT NULL DEFAULT 'SKU convention change'
);

CREATE TABLE IF NOT EXISTS sdsp_configuration_values (
  configuration_id BIGINT NOT NULL REFERENCES sdsp_configurations(id) ON DELETE CASCADE,
  option_value_id BIGINT NOT NULL REFERENCES sdsp_option_values(id) ON DELETE CASCADE,
  PRIMARY KEY (configuration_id, option_value_id)
);

CREATE TABLE IF NOT EXISTS sdsp_price_tiers (
  id BIGSERIAL PRIMARY KEY,
  configuration_id BIGINT NOT NULL REFERENCES sdsp_configurations(id) ON DELETE CASCADE,
  quantity_break INTEGER NOT NULL CHECK (quantity_break > 0),
  unit_price NUMERIC(14, 6) NOT NULL CHECK (unit_price >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'retired')),
  effective_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  effective_to TIMESTAMPTZ,
  source_import_batch_id BIGINT REFERENCES sdsp_import_batches(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (configuration_id, quantity_break)
);

CREATE TABLE IF NOT EXISTS sdsp_optionals (
  id BIGSERIAL PRIMARY KEY,
  catalog_version_id BIGINT NOT NULL REFERENCES sdsp_catalog_versions(id) ON DELETE CASCADE,
  option_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  source_label TEXT,
  description TEXT NOT NULL DEFAULT '',
  pricing_method TEXT NOT NULL CHECK (pricing_method IN ('flat', 'flat_tier', 'per_unit', 'per_unit_tier', 'per_bundle', 'hourly', 'no_charge')),
  unit_label TEXT NOT NULL DEFAULT 'job',
  source_price_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'retired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (catalog_version_id, source_price_id)
);

CREATE TABLE IF NOT EXISTS sdsp_product_optionals (
  product_id BIGINT NOT NULL REFERENCES sdsp_products(id) ON DELETE CASCADE,
  optional_id BIGINT NOT NULL REFERENCES sdsp_optionals(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  applicability_status TEXT NOT NULL DEFAULT 'reviewed' CHECK (applicability_status IN ('provisional', 'reviewed')),
  PRIMARY KEY (product_id, optional_id)
);

CREATE TABLE IF NOT EXISTS sdsp_optional_price_tiers (
  id BIGSERIAL PRIMARY KEY,
  optional_id BIGINT NOT NULL REFERENCES sdsp_optionals(id) ON DELETE CASCADE,
  quantity_break INTEGER NOT NULL CHECK (quantity_break >= 0),
  display_quantity TEXT NOT NULL DEFAULT '',
  amount NUMERIC(14, 6) NOT NULL CHECK (amount >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'retired')),
  effective_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  effective_to TIMESTAMPTZ,
  source_import_batch_id BIGINT REFERENCES sdsp_import_batches(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (optional_id, quantity_break)
);

CREATE INDEX IF NOT EXISTS sdsp_products_category_idx ON sdsp_products(category_id, status);
CREATE INDEX IF NOT EXISTS sdsp_configurations_product_idx ON sdsp_configurations(product_id, status);
CREATE INDEX IF NOT EXISTS sdsp_price_tiers_configuration_idx ON sdsp_price_tiers(configuration_id, quantity_break);
CREATE INDEX IF NOT EXISTS sdsp_optional_tiers_optional_idx ON sdsp_optional_price_tiers(optional_id, quantity_break);

COMMIT;
