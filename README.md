# Sharpdots Estimator

Pipeline separates **Services** and **Print / Production** opportunities. See
[pipeline selection, reassignment and compatibility](docs/sales-pipelines.md).

The Estimator is a local-first prototype for estimating, print quotes, and Standard Products pricing. The Standard Products catalog uses a dedicated local PostgreSQL database with `sdsp_` tables; it does not read or modify the production database.

In **Proposals > Services**, choose **Start from scratch** to price a custom service without SalesMachine components. The initial line is blank; name it, enter costs and markups or a direct startup/monthly price, and add or remove lines as needed. Save the Service Calc record to retain the scenario and its custom lines.

The **Living Ops engagement** service model selects product snapshots,
costs components, estimates team capacity, and rolls the resulting engagement into
a proposal. The legacy JSON import remains available separately from the CE reader.
See [Services builder and integration boundary](docs/living-ops-services.md).

The CE catalog reader is live in Estimator v52 / CE v28, and the user has confirmed
the real products appear. Configured CE products remain internal-review drafts;
selection does not approve pricing, delivery or client sending. See the
[read-only connection and release record](docs/ce-catalog-connection.md).

The [closed-proposal CE handoff](docs/ce-proposal-handoff.md) is deployed and its
separate write connection enabled in Estimator v54 / CE v30. It provides durable
preparation, pinned saved versions, retry and receipt tracking. An operator must
explicitly send each intake; receipt does not authorize delivery or invoicing.
The first controlled signed-in production transfer remains unverified. See the
[release and activation record](docs/ce-handoff-release-2026-10-01.md).

## Local Standard Products setup

The local environment is configured in the ignored `.env.local` file. It requires:

- `SDSP_DATABASE_URL`
- `SDSP_PG_BIN`
- `SDSP_PG_DATA`
- `PORT=4330`
- `HOST=127.0.0.1`

Run the local catalog and app:

```powershell
npm install
npm run db:start
npm run db:setup
npm start
```

Open [http://127.0.0.1:4330/](http://127.0.0.1:4330/). Use **Print Quote > Add Standard Product** to build a priced postcard quote. Use **Ecomm > Price list** to review and edit product and option price tiers.

Useful database commands:

```powershell
npm run db:status
npm run db:migrate
npm run db:import
npm run db:stop
```

`db:setup` runs the schema migration and the repeatable bootstrap import. The importer uses structured XML and CSV parsers, checks expected source counts, and can be rerun safely.

## Bootstrap sources

The files in `data/bootstrap/` are one-time migration sources:

- `postcard-65969.xml`: 50 valid postcard configurations and 250 quantity-price tiers.
- `optional-prices.csv`: 15 option/service definitions and 59 price tiers.

Every sellable postcard configuration receives a stable provisional SKU. Final SKU naming can be changed later without changing the configuration identity. Options use independent add-on codes and do not alter the base product SKU.

After bootstrap, prices are managed through the Ecomm Price List surface. XML and CSV are not the ongoing source of truth.

## Local catalog API

- `GET /api/sdsp/status`: local database health and record counts.
- `GET /api/sdsp/catalog`: published catalog used by the quote builder.
- `GET /api/sdsp/admin/catalog`: local admin catalog, including draft option definitions.
- `POST /api/sdsp/price`: authoritative configuration and optional pricing.
- `PUT /api/sdsp/admin/configurations/:id/prices`: update a SKU price grid.
- `PUT /api/sdsp/admin/optionals/:id/prices`: update an option/service price grid.

Admin catalog routes are limited to localhost in this pilot.

## Phase boundary

Phases 1-6 provide the local schema, bootstrap import, catalog API, authoritative pricing, quote-builder integration, and Ecomm price management interface. Phase 7 is production planning: it must cover production PostgreSQL provisioning, migration review, authentication and authorization, backups, deployment, and rollback. No production migration or deployment is part of the local pilot.

## Verification

```powershell
npm test
node --check server.js
node --check app.js
```
