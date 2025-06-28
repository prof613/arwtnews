markdown

# Red, White and True News Website Setup Guide

This guide provides step-by-step instructions to set up and deploy the Red, White and True News website on DigitalOcean App Platform with a PostgreSQL database, SendGrid for email, and reCAPTCHA for comment forms. The site is built with Next.js (frontend), Strapi (CMS), and Tailwind CSS (styling), designed for deployment at https://redwhiteandtruenews.com/.

## Prerequisites
1. **DigitalOcean Account**: Sign up at https://cloud.digitalocean.com/. Add a payment method for verification.
2. **GitHub Account**: Create at https://github.com/. Verify your email.
3. **SendGrid Account**: Sign up for free tier (100 emails/day) at https://sendgrid.com/.
4. **reCAPTCHA Keys**: Register at https://www.google.com/recaptcha/admin/create (v2 Checkbox, domains: redwhiteandtruenews.com, localhost).
5. **Node.js**: Install v18+ with native module tools (Python, make, gcc for Linux/macOS; Visual Studio Build Tools for Windows) from https://nodejs.org/.
6. **Git**: Install from https://git-scm.com/downloads.
7. **Code Editor**: Use Visual Studio Code (https://code.visualstudio.com/).
8. **Domain**: Ensure redwhiteandtruenews.com is managed via your registrar (e.g., GoDaddy).

## Step 1: Prepare Local Environment
1. **Extract Code**: Unzip `rwtnews.zip` to a local folder (e.g., `rwtnews`).
2. **Install Dependencies**:
   ```bash
   cd rwtnews
   npm install
   cd strapi
   npm install

Test Locally:
bash

cd rwtnews
npm run dev
cd strapi
npm run develop

Access frontend at http://localhost:3000 and Strapi at http://localhost:1337/admin (username: prof613, password: 852Brown!).

Step 2: Set Up DigitalOcean
Create Managed PostgreSQL:
Go to DigitalOcean > “Databases” > “Create Database Cluster.”

Select PostgreSQL 16, Basic Shared, Premium AMD CPU, 10 GB storage, NYC1 region, name “rwtnews-db.”

Create a database user/password. Save connection details (host, port, username, password, database name).

Create App Platform App:
Go to “Apps” > “Create App.”

Select GitHub as source (connect your account, select red-white-true-news repo after pushing code).

Configure:
Name: “rwtnews”

Region: NYC1

Resources: Web Service (/) for Next.js, Service (/strapi) for Strapi

Plan: Basic ($5/month shared container)

Autodeploy: Enabled

Environment Variables:
Next.js (/):

NEXT_PUBLIC_STRAPI_URL=https://<strapi-app-domain>
NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSyDg1ncGxs4BiGBekGodYQUQI_RDqd3vT8A
NEXT_PUBLIC_SENDGRID_API_KEY=<sendgrid-api-key>
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<recaptcha-site-key>
RECAPTCHA_SECRET_KEY=<recaptcha-secret-key>

Strapi (/strapi):

DATABASE_HOST=<postgres-host>
DATABASE_PORT=5432
DATABASE_NAME=rwtnews
DATABASE_USERNAME=<postgres-username>
DATABASE_PASSWORD=<postgres-password>
JWT_SECRET=<random-32-chars>
ADMIN_JWT_SECRET=<random-32-chars>
APP_KEYS=<random-32-chars>
API_TOKEN_SALT=<random-32-chars>
SENDGRID_API_KEY=<sendgrid-api-key>

Generate random strings at https://randomkeygen.com/.

Add domain: redwhiteandtruenews.com

Link Database: In App settings, add the “rwtnews-db” PostgreSQL database to the Strapi service.

Step 3: Configure SendGrid
Generate API Key: In SendGrid dashboard > “Settings” > “API Keys” > “Create API Key” (Full Access, name: “RWTNews”).

Sender Authentication:
Verify single sender (webpagecontact@redwhiteandtruenews.com) at “Settings” > “Sender Authentication.”

Add DNS records for domain authentication (redwhiteandtruenews.com) in your registrar.

Add API key to environment variables above.

Step 4: Configure reCAPTCHA
Use site/secret keys from reCAPTCHA registration.

Add to environment variables above.

Step 5: Push Code to GitHub
Create Repository:
Go to https://github.com/new, name: red-white-true-news, public, initialize with README.

Add .gitignore: Node, License: MIT.

Push Code:
bash

git init
git add .
git commit -m "Initial site code"
git remote add origin https://github.com/<your-username>/red-white-true-news.git
git push -u origin main

Step 6: Deploy to DigitalOcean
Deploy App:
In DigitalOcean App settings, click “Deploy.”

Monitor logs for errors (e.g., missing environment variables).

Test Deployment:
Access https://redwhiteandtruenews.com/.

Verify pages, Strapi admin (https://<strapi-app-domain>/admin) (https://<strapi-app-domain>/admin), forms (SendGrid), YouTube videos, search, comments.

Check browser DevTools and DigitalOcean logs for issues.

DNS Setup:
In your registrar, add a CNAME record for redwhiteandtruenews.com pointing to <app-name>.ondigitalocean.app.

Wait for propagation (up to 48 hours).

Step 7: Import Sample Content
Extract rwtnews-sample-content.zip.

In Strapi admin (http://localhost:1337/admin or deployed URL):
Go to “Content Manager” > “Article” > “Create new entry” to manually add articles from articles.json.

Repeat for memes (memes.json) under “Meme.”

Upload images from /images/content/2025/June/11/ to Strapi’s Media Library.

Alternatively, use Strapi’s API to import (see README-sample-content.md).

Step 8: Debugging
Refer to DEBUGGING.md for fixes (e.g., “no component detected,” CORS, API quota, SendGrid issues).

Step 9: Post-Deployment
Follow POST-DEPLOYMENT.md for tasks (e.g., enable daily database backups, set alerts, rotate API keys).

