# Sharpdots Estimator

The Estimator is a local-first prototype for estimating, print quotes, and Standard Products pricing. The Standard Products catalog uses a dedicated local PostgreSQL database with `sdsp_` tables; it does not read or modify the production database.

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
