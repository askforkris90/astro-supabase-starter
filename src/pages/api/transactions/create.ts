import type { APIRoute } from "astro";
import { supabase } from "../../../utils/database";

export const POST: APIRoute = async ({ request }) => {
  if (!supabase) {
    return new Response(JSON.stringify({ error: "Database not available" }), { status: 503 });
  }

  try {
    const body = await request.json();
    const { framework_id, customer_email } = body;

    if (!framework_id) {
      return new Response(JSON.stringify({ error: "Missing framework_id" }), { status: 400 });
    }

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        framework_id,
        customer_email: customer_email || null,
        amount: 49.99, // Fixed price for all frameworks for now
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (e) {
    console.error("Error creating transaction:", e);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};
