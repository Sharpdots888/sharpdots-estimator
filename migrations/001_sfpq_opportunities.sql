-- Reviewed, operator-run migration only. NOT invoked by server startup.
-- Requires PostgreSQL 12+ and CREATE privilege in public. Run with ON_ERROR_STOP.
-- Intentionally fails if the table already exists: inspect schema before proceeding.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

CREATE TABLE public.sfpq_opportunities (
  id bigint GENERATED ALWAYS AS IDENTITY
    (START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 999999 NO CYCLE) PRIMARY KEY,
  opportunity_number text GENERATED ALWAYS AS
    ('O-' || lpad(id::text, 6, '0')) STORED NOT NULL UNIQUE,
  -- Caller-generated stable creation key also makes retry reconciliation possible.
  creation_key uuid NOT NULL UNIQUE,
  name text NOT NULL CHECK (length(btrim(name)) BETWEEN 1 AND 500),
  account_name text NOT NULL DEFAULT '',
  contact_name text NOT NULL DEFAULT '',
  contact_email text NOT NULL DEFAULT '',
  account_ref uuid REFERENCES public.sfvc_companies(company_id) ON DELETE RESTRICT,
  contact_ref uuid REFERENCES public.sfvc_people(person_id) ON DELETE RESTRICT,
  -- Portal subject -> users.id mapping is NOT yet verified; do not populate these
  -- staging placeholders from a browser-supplied or assumed local user ID.
  owner_operator_ref text,
  offering text NOT NULL DEFAULT 'Print' CHECK (offering IN ('Print','Services','Mixed')),
  lead_source text NOT NULL DEFAULT '',
  brief text NOT NULL DEFAULT '',
  stage text NOT NULL DEFAULT 'intake'
    CHECK (stage IN ('intake','qualified','costing','ready','review','won')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','won','lost')),
  probability_percent smallint NOT NULL DEFAULT 10 CHECK (probability_percent BETWEEN 0 AND 100),
  expected_close_date date,
  stage_entered_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  closed_at timestamptz,
  lost_reason text,
  qualified_need boolean NOT NULL DEFAULT false,
  qualified_budget boolean NOT NULL DEFAULT false,
  qualified_authority boolean NOT NULL DEFAULT false,
  qualified_timing boolean NOT NULL DEFAULT false,
  currency char(3) NOT NULL DEFAULT 'USD' CHECK (currency = 'USD'),
  one_time_amount numeric(14,2) NOT NULL DEFAULT 0 CHECK (one_time_amount >= 0),
  monthly_amount numeric(14,2) NOT NULL DEFAULT 0 CHECK (monthly_amount >= 0),
  initial_term_months integer NOT NULL DEFAULT 3 CHECK (initial_term_months BETWEEN 1 AND 1200),
  initial_contract_amount numeric(18,2) GENERATED ALWAYS AS
    (one_time_amount + monthly_amount * initial_term_months) STORED,
  -- Canonical legacy container identity, NOT an unqualified browser-local W number.
  legacy_workspace_key text UNIQUE CHECK (legacy_workspace_key IS NULL OR length(btrim(legacy_workspace_key)) > 0),
  created_by_operator_ref text,
  updated_by_operator_ref text,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  row_version bigint NOT NULL DEFAULT 1 CHECK (row_version > 0),
  archived_at timestamptz,
  CONSTRAINT sfpq_opportunities_close_state CHECK (
    (status = 'open' AND closed_at IS NULL AND stage <> 'won') OR
    (status = 'won' AND closed_at IS NOT NULL AND stage = 'won') OR
    (status = 'lost' AND closed_at IS NOT NULL AND stage <> 'won' AND length(btrim(lost_reason)) > 0 AND lost_reason IS NOT NULL)
  )
);

CREATE INDEX sfpq_opportunities_pipeline_idx
  ON public.sfpq_opportunities (status, stage, expected_close_date) WHERE archived_at IS NULL;
CREATE INDEX sfpq_opportunities_owner_idx
  ON public.sfpq_opportunities (owner_operator_ref, status) WHERE archived_at IS NULL;
CREATE INDEX sfpq_opportunities_account_idx
  ON public.sfpq_opportunities (account_ref) WHERE account_ref IS NOT NULL;
CREATE INDEX sfpq_opportunities_contact_idx
  ON public.sfpq_opportunities (contact_ref) WHERE contact_ref IS NOT NULL;

CREATE FUNCTION public.sfpq_opportunities_before_update()
RETURNS trigger LANGUAGE plpgsql SET search_path = pg_catalog AS $$
BEGIN
  IF NEW.id IS DISTINCT FROM OLD.id OR NEW.creation_key IS DISTINCT FROM OLD.creation_key
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Opportunity identity and creation timestamp are immutable';
  END IF;
  NEW.updated_at := statement_timestamp();
  NEW.row_version := OLD.row_version + 1;
  IF NEW.stage IS DISTINCT FROM OLD.stage THEN
    NEW.stage_entered_at := statement_timestamp();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER sfpq_opportunities_before_update
  BEFORE UPDATE ON public.sfpq_opportunities
  FOR EACH ROW EXECUTE FUNCTION public.sfpq_opportunities_before_update();

COMMENT ON TABLE public.sfpq_opportunities IS
  'Opportunity CRM header. O numbers are DB assigned. Does not migrate legacy Workspace links or activate CRM APIs.';
COMMENT ON COLUMN public.sfpq_opportunities.opportunity_number IS
  'Immutable display identifier O-000001 through O-999999. Gaps are expected; numbers are never recycled.';
COMMENT ON COLUMN public.sfpq_opportunities.creation_key IS
  'Caller-generated UUID retained across create retries. Unique conflict must retrieve and reconcile the existing record, not allocate another opportunity.';
COMMENT ON COLUMN public.sfpq_opportunities.row_version IS
  'Optimistic concurrency token. API updates must WHERE id = supplied id AND row_version = supplied version; zero rows means conflict.';
COMMENT ON COLUMN public.sfpq_opportunities.legacy_workspace_key IS
  'Reviewed canonical mapping only. Do not automatically equate browser-local W numbers across users or copy W suffixes to O numbers.';

-- Existing owner defaults grant broad access to several application roles.
-- Strip defaults on ONLY these new objects before the transaction becomes visible.
DO $$
DECLARE grant_row record;
BEGIN
  FOR grant_row IN
    SELECT DISTINCT c.oid::regclass AS object_name, c.relkind, a.grantee
    FROM pg_class c
    CROSS JOIN LATERAL aclexplode(c.relacl) a
    WHERE c.oid IN ('public.sfpq_opportunities'::regclass,
                   'public.sfpq_opportunities_id_seq'::regclass)
      AND a.grantee <> c.relowner
  LOOP
    EXECUTE format('REVOKE ALL ON %s %s FROM %s',
      CASE WHEN grant_row.relkind = 'S' THEN 'SEQUENCE' ELSE 'TABLE' END,
      grant_row.object_name,
      CASE WHEN grant_row.grantee = 0 THEN 'PUBLIC'
           ELSE quote_ident(pg_get_userbyid(grant_row.grantee)) END);
  END LOOP;
END;
$$;
REVOKE ALL ON FUNCTION public.sfpq_opportunities_before_update() FROM PUBLIC;
-- Apply reviewed opportunity-runtime-grants.sql separately as the owner.
COMMIT;
