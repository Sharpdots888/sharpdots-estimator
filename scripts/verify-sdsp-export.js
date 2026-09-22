const assert = require('node:assert/strict');
const { Pool } = require('pg');
const { loadLocalEnv } = require('../lib/local-env');
loadLocalEnv(require('path').resolve(__dirname, '..'));
const { getCatalog, calculatePrice } = require('../lib/sdsp-catalog');
async function main() {
  const db = new Pool({ connectionString: process.env.SDSP_DATABASE_URL, ssl: false });
  try {
    const { rows } = await db.query('SELECT quantity_break,unit_price,currency,status,source_metadata FROM sdsp_price_tiers');
    assert.equal(rows.length, 3577);
    for (const row of rows) {
      assert.equal(Number(row.unit_price), Number(row.source_metadata.unit_price));
      assert.equal(row.quantity_break, Number(row.source_metadata.quantity));
      assert.equal(row.currency, 'USD');
      if (row.source_metadata.review_notes) assert.equal(row.status, 'draft');
    }
    const catalog = await getCatalog();
    const products = catalog.categories.flatMap(c => c.products);
    assert.equal(products.length, 31);
    assert.equal(products.flatMap(p => p.configurations.flatMap(c => c.priceTiers)).length, 2723);
    assert.equal(products.some(p => p.sourceExternalId === '66588'), false);
    let tested = 0;
    for (const product of products) {
      assert.equal(product.priceBasis, 'selling');
      assert.equal(product.optionals.length, 0);
      for (const configuration of product.configurations) {
        assert.equal(Object.keys(configuration.selections).length, product.options.length);
        const tier = configuration.priceTiers[0];
        const payload = { productId: product.id, selections: configuration.selections, quantity: tier.quantity, markupPercent: 100 };
        const result = await calculatePrice(payload);
        assert.equal(result.sku, configuration.sku);
        assert.equal(result.markupPercent, 0);
        assert.equal(result.customerTotal, Math.round((tier.unitPrice * tier.quantity + Number.EPSILON) * 100) / 100);
        tested++;
      }
    }
    const product = products.find(p => p.sourceExternalId === '65969');
    assert.equal(product.configurations.filter(c => c.sku.startsWith('SDSP-PC-')).length, 50);
    const payload = { productId: product.id, selections: product.configurations[0].selections, quantity: product.configurations[0].priceTiers[0].quantity };
    await assert.rejects(calculatePrice({ ...payload, quantity: 100.1 }));
    await assert.rejects(calculatePrice({ ...payload, quantity: 101 }));
    await assert.rejects(calculatePrice({ ...payload, optionalCodes: ['OPT-ROUND-CORNERS'] }));
    console.log(`PASS: 3,577 source prices reconciled; ${tested} published configurations priced; 31 active products; 2,723 available tiers; original 50 postcard SKUs retained; invalid quantities/services rejected.`);
  } finally { await db.end(); }
}
main().then(() => process.exit(0)).catch(error => { console.error(error); process.exit(1); });
