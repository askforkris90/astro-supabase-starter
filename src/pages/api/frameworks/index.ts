import type { APIRoute } from "astro";
import { sql } from "../../../utils/db";

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const url = formData.get("url")?.toString();
  const description = formData.get("description")?.toString();
  const logo = formData.get("logo")?.toString();

  if (!name || !url || !description || !logo) {
    return new Response("Missing required fields", { status: 400 });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    await sql`
      INSERT INTO frameworks (name, slug, url, description, logo, likes)
      VALUES (${name}, ${slug}, ${url}, ${description}, ${logo}, 0)
    `;
    return redirect("/");
  } catch (error) {
    console.error(error);
    return new Response(error instanceof Error ? error.message : String(error), { status: 500 });
  }
};
