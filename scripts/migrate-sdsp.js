const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const { loadLocalEnv } = require("../lib/local-env");

const root = path.resolve(__dirname, "..");
loadLocalEnv(root);

function localSsl(connectionString) {
  return /@(127\.0\.0\.1|localhost)(:\d+)?\//i.test(connectionString || "")
    ? false
    : { rejectUnauthorized: false };
}

async function main() {
  const connectionString = String(process.env.SDSP_DATABASE_URL || "").trim();
  if (!connectionString) throw new Error("SDSP_DATABASE_URL is not configured");
  const pool = new Pool({ connectionString, ssl: localSsl(connectionString) });
  const migrationDirectory = path.join(root, "db", "sdsp");
  const files = fs.readdirSync(migrationDirectory).filter((name) => name.endsWith(".sql")).sort();
  try {
    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationDirectory, file), "utf8");
      await pool.query(sql);
      console.log(`Applied ${file}`);
    }
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = { main };
