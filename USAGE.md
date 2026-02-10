# Set up Netlify DB with Astro template

In this guide we’re going to set up Netlify DB (powered by Neon) for your Astro project.

## Set up Netlify DB

Netlify DB provides a seamless, passwordless Postgres database integration for your Netlify sites.

1. **Install the @netlify/neon package**: This has already been done for you in this template.
2. **Connect a Database**: In the Netlify UI, go to your site's **Connect** tab and select **Database**. Click **Connect a database** and choose **Netlify DB**.
3. **Automatic Table Creation**: The template is configured to automatically create the `frameworks` table and seed it with initial data on the first request.

## Local Development

To develop locally with Netlify DB:

1. Link your local repository to your Netlify site:
   ```bash
   netlify link
   ```
2. Initialize the database locally:
   ```bash
   netlify db init
   ```
3. Run the development server:
   ```bash
   netlify dev
   ```

The application will use the `NETLIFY_DATABASE_URL` environment variable to connect to your Postgres database.

## Deploy the site

Once you've connected the database in the Netlify UI, any new deployment will automatically have access to the database. The `frameworks` table will be created and seeded automatically when you first visit the site.

![Template with data](/images/guides/web-frameworks.png)
