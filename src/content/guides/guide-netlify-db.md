---
title: Set up Netlify DB
---

Netlify DB (powered by Neon) provides a seamless, passwordless Postgres database integration for your Netlify sites.

## 1. Connect a Database

In the Netlify UI, go to your site's **Connect** tab and select **Database**. Click **Connect a database** and choose **Netlify DB**. This will automatically provision a Postgres database and set the `NETLIFY_DATABASE_URL` environment variable for your site.

## 2. Local Development

To develop locally, you'll need the Netlify CLI. Run the following commands in your project root:

```bash
netlify link
netlify db init
```

This will link your local environment to your Netlify site and set up the local database connection.

## 3. Automatic Seeding

This template includes logic to automatically create the `frameworks` table and seed it with initial data if it doesn't exist. This happens during the first request to the application.

## 4. Use in Code

You can use the `@netlify/neon` package to interact with your database:

```typescript
import { neon } from "@netlify/neon";

const sql = neon();
const frameworks = await sql`SELECT * FROM frameworks`;
```

No connection strings or passwords are needed in your code!
