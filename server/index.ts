// import * as dotenv from "dotenv";
// dotenv.config({ path: ".env.local" });
// import * as schema from "@/server/schema";
// import { drizzle } from "drizzle-orm/neon-http";
// import { neon } from "@neondatabase/serverless";

// const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
// export const db = drizzle(sql, { schema });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/server/schema";

const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
export const db = drizzle(sql, { schema, logger: true });

