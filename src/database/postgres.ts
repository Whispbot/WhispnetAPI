import pkg from "pg";
import productionValue from "../modules/production.js";
const { Pool } = pkg;

const databaseUrl = productionValue(
  process.env.DATABASE_URL,
  process.env.DATABASE_PUBLIC_URL
);

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

const start = Date.now();
console.log("Connecting to database...");
const pool = new Pool({
  connectionString: databaseUrl,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false
});

pool.on("error", (err: any) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

const client = await pool.connect();
client.query("SELECT 1");
client.release();

console.log(`Connected to database in ${Date.now() - start}ms`);

export default pool;
