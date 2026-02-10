import type { APIRoute } from "astro";
import { sql } from "../../../../utils/db";

export const prerender = false;

export const POST: APIRoute = async ({ params, redirect }) => {
  const { id } = params;
  if (!id) {
    return new Response("No framework id provided", { status: 400 });
  }

  try {
    const result = await sql`UPDATE frameworks SET likes = likes + 1 WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return new Response(`Where'd that framework go?`, { status: 404 });
    }

    const framework = result[0];
    return redirect(`/frameworks/${framework.slug}`, 303);
  } catch (error) {
    console.error(error);
    return new Response(error instanceof Error ? error.message : String(error), { status: 500 });
  }
};
