const path = require("path");
const { spawnSync } = require("child_process");
const { loadLocalEnv } = require("../lib/local-env");

const root = path.resolve(__dirname, "..");
loadLocalEnv(root);

function main() {
  const command = process.argv[2] || "status";
  if (!process.env.SDSP_PG_BIN || !process.env.SDSP_PG_DATA) {
    throw new Error("SDSP_PG_BIN and SDSP_PG_DATA must be configured in .env.local");
  }
  const pgCtl = path.join(process.env.SDSP_PG_BIN, process.platform === "win32" ? "pg_ctl.exe" : "pg_ctl");
  const args = ["-D", process.env.SDSP_PG_DATA];
  if (command === "start") args.push("-l", `${process.env.SDSP_PG_DATA}.log`, "start");
  else if (command === "stop") args.push("stop", "-m", "fast");
  else if (command === "restart") args.push("-l", `${process.env.SDSP_PG_DATA}.log`, "restart", "-m", "fast");
  else args.push("status");

  const result = spawnSync(pgCtl, args, { stdio: "inherit" });
  process.exitCode = result.status || 0;
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
