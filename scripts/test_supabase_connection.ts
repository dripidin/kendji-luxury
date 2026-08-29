import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function checkSupabaseConnection() {
  console.log("Testing Supabase Connection to:", supabaseUrl);
  
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  
  try {
    const { data, error } = await supabase.from("products").select("count").limit(1);
    if (error) {
      console.log("Query response (table status):", error.message);
    } else {
      console.log("Successfully queried products table! Data:", data);
    }
  } catch (err) {
    console.error("Connection failed:", err);
  }
}

checkSupabaseConnection();
