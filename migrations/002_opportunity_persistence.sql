-- Operator-run after 001. Never run by web startup. Review grants with 001.
BEGIN;
SET LOCAL lock_timeout = '5s';
DO $$ BEGIN
  IF current_user = 'db_admin' OR current_user <> (SELECT pg_get_userbyid(relowner) FROM pg_class WHERE oid='public.sfpq_opportunities'::regclass)
    OR pg_has_role('db_admin',current_user,'MEMBER') THEN
    RAISE EXCEPTION 'Run as the opportunity schema owner, separate from runtime';
  END IF;
END $$;
CREATE TABLE public.sfpq_opportunity_state (
  opportunity_id bigint PRIMARY KEY REFERENCES public.sfpq_opportunities(id),
  state jsonb NOT NULL DEFAULT '{}' CHECK (jsonb_typeof(state) = 'object')
);
CREATE TABLE public.sfpq_crm_records (
  id bigint GENERATED ALWAYS AS IDENTITY (MAXVALUE 899999 NO CYCLE) PRIMARY KEY,
  creation_key uuid UNIQUE NOT NULL,
  collection text NOT NULL CHECK (collection IN ('proposals','estimates','services','sourcing','printQuotes','ecomm')),
  number text UNIQUE NOT NULL,
  name text NOT NULL,
  version integer NOT NULL CHECK (version > 0),
  created_by integer NOT NULL REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.sfpq_crm_record_versions (
  record_id bigint NOT NULL REFERENCES public.sfpq_crm_records(id),
  version integer NOT NULL CHECK (version > 0),
  name text NOT NULL,
  snapshot jsonb NOT NULL CHECK (jsonb_typeof(snapshot) = 'object'),
  created_by integer NOT NULL REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (record_id,version)
);
CREATE TABLE public.sfpq_opportunity_records (
  opportunity_id bigint NOT NULL REFERENCES public.sfpq_opportunities(id),
  record_id bigint NOT NULL,
  version integer NOT NULL,
  role text NOT NULL CHECK (role IN ('Primary offer','Component','Cost basis','Alternative')),
  PRIMARY KEY (opportunity_id,record_id),
  FOREIGN KEY (record_id,version) REFERENCES public.sfpq_crm_record_versions(record_id,version)
);
CREATE UNIQUE INDEX sfpq_opportunity_primary_offer ON public.sfpq_opportunity_records(opportunity_id) WHERE role='Primary offer';
CREATE INDEX sfpq_opportunity_records_record ON public.sfpq_opportunity_records(record_id,version);
CREATE TABLE public.sfpq_opportunity_audit (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  opportunity_id bigint NOT NULL REFERENCES public.sfpq_opportunities(id),
  operator_id integer NOT NULL REFERENCES public.users(id),
  action text NOT NULL,
  detail jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sfpq_opportunity_audit_parent ON public.sfpq_opportunity_audit(opportunity_id,id DESC);
-- Remove inherited default grants on ONLY the new objects before commit.
DO $$ DECLARE r record; BEGIN
  FOR r IN SELECT DISTINCT c.oid::regclass AS obj,c.relkind,a.grantee
    FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    CROSS JOIN LATERAL aclexplode(c.relacl) a
    WHERE n.nspname='public' AND c.relname IN
      ('sfpq_opportunity_state','sfpq_crm_records','sfpq_crm_records_id_seq',
       'sfpq_crm_record_versions','sfpq_opportunity_records','sfpq_opportunity_audit','sfpq_opportunity_audit_id_seq')
      AND a.grantee <> c.relowner
  LOOP EXECUTE format('REVOKE ALL ON %s %s FROM %s',CASE WHEN r.relkind='S' THEN 'SEQUENCE' ELSE 'TABLE' END,r.obj,
    CASE WHEN r.grantee=0 THEN 'PUBLIC' ELSE quote_ident(pg_get_userbyid(r.grantee)) END); END LOOP;
END $$;
GRANT SELECT,INSERT,UPDATE ON public.sfpq_opportunity_state TO db_admin;
GRANT SELECT,INSERT ON public.sfpq_crm_records TO db_admin;
GRANT UPDATE (name,version) ON public.sfpq_crm_records TO db_admin;
GRANT SELECT,INSERT ON public.sfpq_crm_record_versions,public.sfpq_opportunity_audit TO db_admin;
GRANT SELECT,INSERT,DELETE ON public.sfpq_opportunity_records TO db_admin;
GRANT USAGE ON SEQUENCE public.sfpq_crm_records_id_seq,public.sfpq_opportunity_audit_id_seq TO db_admin;
COMMIT;
