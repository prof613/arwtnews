# Debugging Guide for Red, White and True News Website

This guide provides solutions to common issues encountered during setup, deployment, or operation of the Red, White and True News website on DigitalOcean App Platform with Next.js, Strapi, PostgreSQL, SendGrid, and reCAPTCHA.

## 1. "No Component Detected" Error in DigitalOcean
- **Cause**: App Platform cannot detect Next.js or Strapi due to missing `app.yaml` or incorrect repository structure.
- **Solution**:
  - Ensure `app.yaml` is in the root directory with:
    ```yaml
    name: rwtnews
    services:
      - name: web
        github:
          repo: <your-username>/red-white-true-news
          branch: main
        run_command: npm run start
        environment_slug: node-js
        http_port: 3000
      - name: strapi
        github:
          repo: <your-username>/red-white-true-news
          branch: main
        run_command: npm run start
        environment_slug: node-js
        http_port: 1337
        source_dir: strapi
    ```
  - Verify repository structure includes `/pages` (Next.js) and `/strapi`.
  - Re-deploy in DigitalOcean > App > “Deploy.”

## 2. CORS Errors in Strapi
- **Cause**: Strapi API requests blocked due to cross-origin restrictions.
- **Solution**:
  - Edit `/strapi/config/middlewares.js`:
    ```javascript
    module.exports = [
      'strapi::errors',
      {
        name: 'strapi::cors',
        config: {
          origin: ['http://localhost:3000', 'https://redwhiteandtruenews.com'],
          methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
          headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
          keepHeaderOnError: true,
        },
      },
      // Other middlewares
    ];
    ```
  - Restart Strapi (`npm run develop` locally or re-deploy).
  - Check browser DevTools (Network tab) for CORS headers.

## 3. YouTube API Quota Exceeded
- **Cause**: API key (AIzaSyDg1ncGxs4BiGBekGodYQUQI_RDqd3vT8A) exceeds daily quota.
- **Solution**:
  - Verify quota in Google Cloud Console (https://console.cloud.google.com/apis/credentials).
  - Request quota increase or generate a new key.
  - Update `NEXT_PUBLIC_YOUTUBE_API_KEY` in DigitalOcean environment variables.
  - Fallback placeholders (static images/text) should display automatically.
  - Monitor DigitalOcean logs for API errors.

## 4. SendGrid Email Delivery Issues
- **Cause**: Invalid API key, unverified sender, or DNS misconfiguration.
- **Solution**:
  - Verify `SENDGRID_API_KEY` in environment variables.
  - Confirm sender (webpagecontact@redwhiteandtruenews.com) is verified in SendGrid > “Settings” > “Sender Authentication.”
  - Check DNS records for domain authentication in your registrar.
  - Test email locally:
    ```bash
    cd rwtnews
    npm run dev
    ```
    Submit a subscription or comment form and check SendGrid dashboard > “Activity.”
  - Review DigitalOcean logs for SendGrid errors.

## 5. DNS Propagation Delays
- **Cause**: CNAME record for redwhiteandtruenews.com not propagated.
- **Solution**:
  - Verify CNAME in registrar (e.g., name: `www`, value: `<app-name>.ondigitalocean.app`).
  - Check propagation with `dig redwhiteandtruenews.com` or https://dnschecker.org/.
  - Wait up to 48 hours. Test with temporary DigitalOcean URL (e.g., `<app-name>.ondigitalocean.app`).

## 6. Strapi Database Connection Errors
- **Cause**: Incorrect PostgreSQL credentials or network restrictions.
- **Solution**:
  - Verify `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` in `/strapi/config/database.js`.
  - Ensure DigitalOcean database is linked to the Strapi service in App Platform.
  - Check DigitalOcean > “Databases” > “rwtnews-db” > “Connection Details” for correct credentials.
  - Allow Strapi’s IP in PostgreSQL trusted sources (DigitalOcean > “Databases” > “Settings” > “Trusted Sources”).
  - Review Strapi logs (`npm run develop` or DigitalOcean logs).

## 7. reCAPTCHA Validation Fails
- **Cause**: Incorrect site/secret keys or domain mismatch.
- **Solution**:
  - Verify `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY` in environment variables.
  - Ensure reCAPTCHA v2 Checkbox is registered for redwhiteandtruenews.com and localhost (https://www.google.com/recaptcha/admin).
  - Test comment form locally (`npm run dev`) and check browser console for errors.

## 8. Images Not Loading
- **Cause**: Missing or incorrect image paths in `/public/images/core` or `/images/content`.
- **Solution**:
  - Verify images (`rwtn_favicon.jpg`, `mainbanner.jpg`, etc.) in `/public/images/core`.
  - Check sample content images in `/public/images/content/2025/June/11/`.
  - Ensure Strapi Media Library references correct paths (http://localhost:1337/admin > “Media Library”).
  - Re-upload images if missing (e.g., from `rwtnews-sample-content.zip`).

## 9. Node.js Build Errors
- **Cause**: Missing native module tools (Python, make, gcc, or Visual Studio Build Tools).
- **Solution**:
  - Reinstall Node.js v18+ with native module tools (https://nodejs.org/).
  - For Windows, install Visual Studio Build Tools:
    ```bash
    npm install --global windows-build-tools
    ```
  - For Linux/macOS, ensure build essentials:
    ```bash
    sudo apt-get install build-essential python3
    ```
  - Retry `npm install` in `/rwtnews` and `/strapi`.

## 10. Admin App Login Fails
- **Cause**: Incorrect credentials or Strapi configuration.
- **Solution**:
  - Use username: prof613, password: 852Brown! at http://localhost:1337/admin or deployed Strapi URL.
  - Reset password via Strapi admin UI > “Forgot Password” (requires SendGrid setup).
  - Verify `JWT_SECRET` and `ADMIN_JWT_SECRET` in `/strapi/config/server.js`.

## Additional Support
- Check DigitalOcean logs (App > “Logs”) and Strapi logs (`npm run develop`).
- Contact DigitalOcean support via Control Panel > “Support.”
- Refer to Next.js (https://nextjs.org/docs), Strapi (https://docs.strapi.io/), or SendGrid (https://docs.sendgrid.com/) documentation.