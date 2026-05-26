import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: connectionString,
    // TiDB Cloud Serverless requires TLS. drizzle-kit forwards this to mysql2.
    ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true },
  },
});
