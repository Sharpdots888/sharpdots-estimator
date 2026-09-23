// Ephemeral PostgreSQL-compatible database; never reads DATABASE_URL.
const {readFileSync}=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {PGlite}=require(process.env.PGLITE_PATH || '@electric-sql/pglite');
(async()=>{
  const db=new PGlite();
  try {
    const sql=readFileSync(path.join(__dirname,'../migrations/001_sfpq_opportunities.sql'),'utf8');
    await db.exec(`CREATE TABLE public.sfvc_companies (company_id uuid PRIMARY KEY);
      CREATE TABLE public.sfvc_people (person_id uuid PRIMARY KEY);`);
    await db.exec(sql);
    const insert=(key,name='Opportunity')=>db.query('INSERT INTO public.sfpq_opportunities (creation_key,name) VALUES ($1,$2) RETURNING *',[key,name]);
    const key=crypto.randomUUID();
    const first=(await insert(key)).rows[0];
    assert.equal(first.opportunity_number,'O-000001');
    await assert.rejects(db.query('UPDATE sfpq_opportunities SET account_ref=$1 WHERE id=1',[crypto.randomUUID()]), /foreign key/);
    await assert.rejects(db.query('UPDATE sfpq_opportunities SET contact_ref=$1 WHERE id=1',[crypto.randomUUID()]), /foreign key/);
    assert.equal((await insert(crypto.randomUUID())).rows[0].opportunity_number,'O-000002');
    await assert.rejects(insert(key));
    await assert.rejects(insert(crypto.randomUUID(),''));
    await assert.rejects(db.exec('UPDATE sfpq_opportunities SET id=42 WHERE id=1'));
    await assert.rejects(db.exec("UPDATE sfpq_opportunities SET one_time_amount=-1 WHERE id=1"));
    await assert.rejects(db.exec("UPDATE sfpq_opportunities SET status='won' WHERE id=1"));
    await assert.rejects(db.exec("UPDATE sfpq_opportunities SET status='lost',closed_at=now() WHERE id=1"));
    const revised=await db.query('UPDATE sfpq_opportunities SET one_time_amount=1000.25,monthly_amount=100.50,initial_term_months=3 WHERE id=$1 AND row_version=$2 RETURNING *',[first.id,first.row_version]);
    assert.equal(Number(revised.rows[0].initial_contract_amount),1301.75);
    assert.equal(Number(revised.rows[0].row_version),2);
    assert.equal((await db.query('UPDATE sfpq_opportunities SET brief=$1 WHERE id=$2 AND row_version=$3 RETURNING id',['stale edit',first.id,first.row_version])).rows.length,0);
    await db.exec("UPDATE sfpq_opportunities SET status='won',stage='won',closed_at=now() WHERE id=1");
    await db.exec("UPDATE sfpq_opportunities SET status='lost',closed_at=now(),lost_reason='Timing' WHERE id=2");
    await db.exec('BEGIN');await insert(crypto.randomUUID());await db.exec('ROLLBACK');
    const after=(await insert(crypto.randomUUID())).rows[0];
    assert.ok(Number(after.id)>3,'rolled-back identities are not reused');
    await db.exec("SELECT setval(pg_get_serial_sequence('public.sfpq_opportunities','id'),999999,true)");
    await assert.rejects(insert(crypto.randomUUID()),/maximum value/);
    console.log('PASS: migration executes; O sequence, uniqueness, immutable identity, financial/status constraints, concurrency token, rollback gaps and six-digit capacity checked.');
  } finally {await db.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
