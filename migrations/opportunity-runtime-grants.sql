-- Operator-run AFTER 001, as its owner. NOT called at application startup.
-- Review target role/ownership and inherited privileges first. No credentials here.
-- This is the proposed current runtime role, not approval to execute production SQL.
BEGIN;
DO $$
BEGIN
  IF current_user <> 'u1plkuc8dacl0j'
     OR (SELECT pg_get_userbyid(relowner) FROM pg_class
         WHERE oid = 'public.sfpq_opportunities'::regclass) <> current_user
     OR pg_has_role('db_admin', 'u1plkuc8dacl0j', 'MEMBER') THEN
    RAISE EXCEPTION 'Require reviewed owner u1plkuc8dacl0j, distinct from runtime and not accessible through runtime membership';
  END IF;
END;
$$;
REVOKE ALL ON public.sfpq_opportunities FROM PUBLIC, db_admin;
REVOKE ALL ON SEQUENCE public.sfpq_opportunities_id_seq FROM PUBLIC, db_admin;
REVOKE ALL ON FUNCTION public.sfpq_opportunities_before_update() FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO db_admin;
GRANT SELECT ON public.sfpq_opportunities TO db_admin;
GRANT INSERT (
  creation_key, name, account_name, contact_name, contact_email, account_ref,
  contact_ref, owner_operator_ref, offering, lead_source, brief, stage, status,
  probability_percent, expected_close_date, closed_at, lost_reason,
  qualified_need, qualified_budget, qualified_authority, qualified_timing,
  currency, one_time_amount, monthly_amount, initial_term_months,
  created_by_operator_ref, updated_by_operator_ref
) ON public.sfpq_opportunities TO db_admin;
GRANT UPDATE (
  name, account_name, contact_name, contact_email, account_ref, contact_ref,
  owner_operator_ref, offering, lead_source, brief, stage, status,
  probability_percent, expected_close_date, closed_at, lost_reason,
  qualified_need, qualified_budget, qualified_authority, qualified_timing,
  currency, one_time_amount, monthly_amount, initial_term_months,
  updated_by_operator_ref, archived_at
) ON public.sfpq_opportunities TO db_admin;
GRANT USAGE ON SEQUENCE public.sfpq_opportunities_id_seq TO db_admin;
-- No DELETE/TRUNCATE, generated/identity/audit timestamp/creation-field updates,
-- legacy mapping writes, sequence reset, or DDL privileges.
COMMIT;
