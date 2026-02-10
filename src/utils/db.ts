
import { neon } from "@netlify/neon";

export const sql = neon();

export async function ensureTables() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS frameworks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT UNIQUE,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        description TEXT NOT NULL,
        logo TEXT NOT NULL,
        likes INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    
    // Check if slug column exists, if not add it (for migration)
    try {
      await sql`ALTER TABLE frameworks ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE`;
    } catch (e) {
      // column might already exist or table doesn't exist yet
    }
    
    const result = await sql`SELECT count(*) FROM frameworks`;
    if (parseInt(result[0].count) === 0) {
      await sql`
        INSERT INTO frameworks (name, slug, url, logo, likes, description) VALUES
        ('Astro', 'astro', 'https://astro.build/', 'astro.svg', 0, 'Astro is a fresh but familiar approach to building websites. Astro combines decades of proven performance best practices with the DX improvements of the component-oriented era.'),
        ('Eleventy', 'eleventy', 'https://svelte.dev/', 'eleventy.svg', 0, 'Eleventy (11ty) is a flexible, minimalist static site generator that builds fast, content-driven websites using multiple templating languages and a zero-client-JavaScript philosophy.'),
        ('Gatsby', 'gatsby', 'https://www.gatsbyjs.com/', 'gatsby.svg', 0, 'Gatsby.js is a React-based framework for building fast, SEO-friendly websites and applications with powerful data integration and static site generation capabilities.'),
        ('Next', 'next', 'https://nextjs.org/', 'next.svg', 0, 'Next.js enables you to create high-quality web applications with the power of React components.'),
        ('Nuxt', 'nuxt', 'https://nuxt.com/', 'nuxt.svg', 0, 'Nuxt is an open source framework that makes web development intuitive and powerful. Create performant and production-grade full-stack web apps and websites with confidence.'),
        ('Remix', 'remix', 'https://remix.run/', 'remix.svg', 0, 'Remix is a React framework designed for server-side rendering (SSR). Is a full-stack web framework, allowing developers to build both backend and frontend within a single app.'),
        ('Svelte', 'svelte', 'https://svelte.dev/', 'svelte.svg', 0, 'Svelte is a UI framework that uses a compiler to let you write breathtakingly concise components that do minimal work in the browser, using languages you already know — HTML, CSS and JavaScript.')
      `;
    }

    // Ensure additional frameworks exist (Vue, React, Angular)
    const extraFrameworks = [
      {
        name: 'Vue',
        slug: 'vue',
        url: 'https://vuejs.org/',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg',
        description: 'Vue is a JavaScript framework for building user interfaces. It builds on top of standard HTML, CSS, and JavaScript and provides a declarative and component-based programming model.'
      },
      {
        name: 'React',
        slug: 'react',
        url: 'https://react.dev/',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
        description: 'The library for web and native user interfaces. React lets you build user interfaces out of individual pieces called components.'
      },
      {
        name: 'Angular',
        slug: 'angular',
        url: 'https://angular.dev/',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Angular_full_color_logo.svg',
        description: 'Angular is a web framework that empowers developers to build fast, reliable applications. Maintained by Google and a community of individuals and corporations.'
      }
    ];

    for (const fw of extraFrameworks) {
      await sql`
        INSERT INTO frameworks (name, slug, url, logo, description, likes)
        VALUES (${fw.name}, ${fw.slug}, ${fw.url}, ${fw.logo}, ${fw.description}, 0)
        ON CONFLICT (slug) DO NOTHING
      `;
    }
    
    // Backfill slugs for existing records if any
    const missingSlugs = await sql`SELECT id, name FROM frameworks WHERE slug IS NULL`;
    for (const row of missingSlugs) {
      const slug = row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await sql`UPDATE frameworks SET slug = ${slug} WHERE id = ${row.id}`;
    }
  } catch (e) {
    console.error("Failed to ensure tables:", e);
  }
}
