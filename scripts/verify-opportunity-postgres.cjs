// Disposable local PostgreSQL cluster. Never reads DATABASE_URL or touches Heroku.
const { execFileSync } = require('node:child_process');
const { mkdtempSync, readFileSync, mkdirSync, rmSync } = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { Client } = require('pg');
const { randomUUID } = require('node:crypto');

async function main() {
  const schemaPath = process.env.OPPORTUNITY_REFERENCE_SCHEMA;
  const enumPath = process.env.OPPORTUNITY_REFERENCE_ENUM;
  if (schemaPath && !enumPath) throw new Error('Schema restore requires OPPORTUNITY_REFERENCE_ENUM');
  const bin = process.env.OPPORTUNITY_PG_BIN || '/opt/homebrew/opt/postgresql@16/bin';
  const dir = mkdtempSync(path.join(os.tmpdir(), 'opportunity-pg-'));
  const data = path.join(dir, 'data');
  const socket = path.join(dir, 'socket');
  mkdirSync(socket);
  const run = (command, args) => execFileSync(path.join(bin, command), args, { stdio: 'pipe' });
  const clients = [];
  let started = false;
  const connect = async user => {
    const c = new Client({ host: socket, user, database: 'postgres', port: 5432 });
    await c.connect(); clients.push(c); return c;
  };
  try {
    run('initdb', ['-D', data, '-U', 'test_admin', '-A', 'trust', '--no-locale']);
    // Unique Unix socket directory; no TCP listener and no conflict with other apps.
    run('pg_ctl', ['-D', data, '-l', path.join(dir, 'postgres.log'), '-o', `-k ${socket} -c listen_addresses=''`, '-w', 'start']);
    started = true;
    const admin = await connect('test_admin');
    await admin.query(`CREATE ROLE u1plkuc8dacl0j LOGIN;
      CREATE ROLE db_admin LOGIN;
      CREATE ROLE replit_user LOGIN;
      CREATE ROLE production_app LOGIN;
      CREATE ROLE n8n_workflows LOGIN;
      CREATE ROLE inventory_review NOLOGIN;
      GRANT USAGE, CREATE ON SCHEMA public TO u1plkuc8dacl0j,db_admin;
      SET ROLE u1plkuc8dacl0j;
      ALTER DEFAULT PRIVILEGES GRANT ALL ON TABLES TO db_admin,replit_user;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO production_app,n8n_workflows;
      ALTER DEFAULT PRIVILEGES GRANT ALL ON SEQUENCES TO db_admin,replit_user,production_app,n8n_workflows;
      RESET ROLE;`);
    if (schemaPath) {
      const labels = JSON.parse(readFileSync(enumPath, 'utf8'));
      assert.ok(Array.isArray(labels) && labels.length && labels.every(s => typeof s === 'string'));
      await admin.query(`CREATE TYPE public.user_role AS ENUM (${labels.map(s => "'" + s.replaceAll("'", "''") + "'").join(',')})`);
      run('psql', ['-h', socket, '-U', 'test_admin', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', '-f', path.resolve(schemaPath)]);
      await admin.query(`INSERT INTO public.users (id,username,email,password_hash,is_admin,is_active)
        VALUES (45,'local_test','local-test@example.invalid','not-a-real-password-hash',false,true)`);
    } else {
      await admin.query(`SET ROLE u1plkuc8dacl0j;
      CREATE TABLE public.sfvc_companies (company_id uuid PRIMARY KEY);
      CREATE TABLE public.sfvc_people (person_id uuid PRIMARY KEY);
      RESET ROLE;
      SET ROLE db_admin;
      CREATE TABLE public.users (id integer PRIMARY KEY);
      INSERT INTO public.users VALUES (45);
      RESET ROLE;`);
    }
    await admin.query(`SET ROLE db_admin;
      GRANT REFERENCES (id) ON public.users TO u1plkuc8dacl0j;
      RESET ROLE;`);
    const owner = await connect('u1plkuc8dacl0j');
    const migration = readFileSync(path.join(__dirname, '../migrations/001_sfpq_opportunities.sql'), 'utf8');
    const grants = readFileSync(path.join(__dirname, '../migrations/opportunity-runtime-grants.sql'), 'utf8');
    await owner.query(migration);
    for (const role of ['db_admin','replit_user','production_app','n8n_workflows']) {
      const privileges = await admin.query(`SELECT
        has_table_privilege($1,'public.sfpq_opportunities','SELECT') AS readable,
        has_sequence_privilege($1,'public.sfpq_opportunities_id_seq','UPDATE') AS resettable`, [role]);
      assert.equal(privileges.rows[0].readable, false);
      assert.equal(privileges.rows[0].resettable, false);
    }
    await owner.query(grants);
    const runtime = await connect('db_admin');
    const other = await connect('db_admin');
    const create = c => c.query('INSERT INTO public.sfpq_opportunities (creation_key,name) VALUES ($1,$2) RETURNING *', [randomUUID(), 'Test only']);
    const results = await Promise.all([create(runtime), create(other)]);
    assert.equal(new Set(results.map(r => r.rows[0].opportunity_number)).size, 2);
    const id = results[0].rows[0].id;
    const updates = await Promise.all([runtime, other].map(c => c.query('UPDATE public.sfpq_opportunities SET brief=$1 WHERE id=$2 AND row_version=1 RETURNING id', ['revision', id])));
    assert.deepEqual(updates.map(r => r.rowCount).sort(), [0, 1]);
    for (const sql of [
      'DELETE FROM public.sfpq_opportunities',
      'TRUNCATE public.sfpq_opportunities',
      'UPDATE public.sfpq_opportunities SET created_at=now()',
      'UPDATE public.sfpq_opportunities SET created_by_operator_ref=45',
      'UPDATE public.sfpq_opportunities SET id=DEFAULT',
      'UPDATE public.sfpq_opportunities SET row_version=42',
      "SELECT setval('public.sfpq_opportunities_id_seq',1)",
      'ALTER TABLE public.sfpq_opportunities ADD COLUMN unauthorized text'
    ]) await assert.rejects(runtime.query(sql), e => e.code === '42501');
    await assert.rejects(runtime.query('UPDATE public.sfpq_opportunities SET account_ref=$1 WHERE id=$2', [randomUUID(), id]), e => e.code === '23503');
    await assert.rejects(runtime.query('UPDATE public.sfpq_opportunities SET contact_ref=$1 WHERE id=$2', [randomUUID(), id]), e => e.code === '23503');
    const company = randomUUID(), person = randomUUID();
    await assert.rejects(runtime.query('UPDATE public.sfpq_opportunities SET owner_operator_ref=999 WHERE id=$1', [id]), e => e.code === '23503');
    await runtime.query('UPDATE public.sfpq_opportunities SET owner_operator_ref=45,updated_by_operator_ref=45 WHERE id=$1', [id]);
    await assert.rejects(admin.query('DELETE FROM public.users WHERE id=45'), e => e.code === '23503');
    if (schemaPath) {
      await owner.query('INSERT INTO public.sfvc_companies (company_id,legal_name) VALUES ($1,$2)', [company,'Synthetic staging company']);
      await owner.query('INSERT INTO public.sfvc_people (person_id,first_name,last_name) VALUES ($1,$2,$3)', [person,'Synthetic','Contact']);
      await owner.query('INSERT INTO public.sfvc_company_people (company_id,person_id) VALUES ($1,$2)', [company,person]);
    } else {
      await owner.query('INSERT INTO public.sfvc_companies VALUES ($1)', [company]);
      await owner.query('INSERT INTO public.sfvc_people VALUES ($1)', [person]);
    }
    await runtime.query('UPDATE public.sfpq_opportunities SET account_ref=$1,contact_ref=$2 WHERE id=$3', [company, person, id]);
    await assert.rejects(owner.query('DELETE FROM public.sfvc_companies WHERE company_id=$1', [company]), e => e.code === '23503');
    await assert.rejects(owner.query('DELETE FROM public.sfvc_people WHERE person_id=$1', [person]), e => e.code === '23503');
    console.log(`PASS: real local PostgreSQL, separate owner/runtime, restricted grants, concurrent allocation and optimistic updates, UUID/operator FKs and delete protection. ${schemaPath ? 'Restored production reference schema; synthetic rows only.' : 'Synthetic minimal schema fixture.'} No production writes or Portal implementation verification.`);
  } finally {
    await Promise.all(clients.map(c => c.end()));
    if (started) run('pg_ctl', ['-D', data, '-m', 'fast', '-w', 'stop']);
    if (process.env.OPPORTUNITY_KEEP_LOCAL_DB === '1') console.log(`Stopped local staging cluster retained at ${dir}`);
    else rmSync(dir, { recursive: true, force: true });
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
