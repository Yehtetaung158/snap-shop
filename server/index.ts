import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import * as schema from "@/server/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
