# Post-Deployment Checklist for Red, White and True News Website

This checklist outlines tasks to ensure the Red, White and True News website (https://redwhiteandtruenews.com/) remains secure, performant, and maintainable after deployment on DigitalOcean App Platform.

## 1. Enable Database Backups
- **Task**: Set up daily backups for the PostgreSQL database.
- **Steps**:
  - Go to DigitalOcean > “Databases” > “rwtnews-db” > “Settings” > “Backups.”
  - Enable “Daily Backups” (included in $15/month plan).
  - Verify backups in “Backups” tab (7-day retention).
- **Frequency**: Once, check monthly.

## 2. Set Up Monitoring Alerts
- **Task**: Configure alerts for CPU/memory usage or downtime.
- **Steps**:
  - Go to DigitalOcean > App > “rwtnews” > “Settings” > “Alerts.”
  - Add alerts for:
    - CPU Usage > 80%
    - Memory Usage > 80%
    - App Down (HTTP 5xx errors)
  - Set notifications to email (tp_flynn@hotmail.com).
- **Frequency**: Once, review quarterly.

## 3. Rotate API Keys and Secrets
- **Task**: Rotate sensitive credentials for security.
- **Steps**:
  - **Strapi Secrets**:
    - Generate new `JWT_SECRET`, `ADMIN_JWT_SECRET`, `APP_KEYS`, `API_TOKEN_SALT` (https://randomkeygen.com/).
    - Update in DigitalOcean > App > “Settings” > “Environment Variables” for Strapi service.
  - **SendGrid API Key**:
    - Create new key in SendGrid > “Settings” > “API Keys.”
    - Update in DigitalOcean environment variables.
  - **reCAPTCHA Keys**:
    - Regenerate at https://www.google.com/recaptcha/admin.
    - Update in DigitalOcean environment variables.
- **Frequency**: Every 3-6 months.

## 4. Verify DNS and SSL
- **Task**: Ensure domain and HTTPS are active.
- **Steps**:
  - Confirm CNAME record (redwhiteandtruenews.com to `<app-name>.ondigitalocean.app`) in registrar.
  - Verify SSL (HTTPS) at https://redwhiteandtruenews.com/ (DigitalOcean auto-provisions).
  - Check propagation: https://dnschecker.org/.
- **Frequency**: Once, recheck after DNS changes.

## 5. Test Site Functionality
- **Task**: Validate all features post-deployment.
- **Steps**:
  - Access https://redwhiteandtruenews.com/.
  - Test:
    - Page loads (index, articles, archives, search, support, about, terms, privacy, 404).
    - Strapi admin (https://<strapi-app-domain>/admin, prof613/852Brown!).
    - Forms: Subscription, author contact, comment (SendGrid delivery).
    - YouTube videos (placeholders if API quota fails).
    - Search, pagination, responsive design (sidebar toggle at 768px).
    - Sample content (3 articles, 3 memes) display.
  - Check browser DevTools and DigitalOcean logs for errors.
- **Frequency**: After deployment, then monthly.

## 6. Enable Analytics (Optional)
- **Task**: Add Google Analytics for traffic tracking.
- **Steps**:
  - Sign up at https://analytics.google.com/, get tracking ID (G-XXXXXXXXXX).
  - Uncomment script in `/components/Footer.js`:
    ```javascript
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    </script>
    ```
  - Push changes to GitHub (`git commit`, `git push`) for auto-deploy.
- **Frequency**: When ready.

## 7. Enable Google AdSense (Optional)
- **Task**: Monetize with ads.
- **Steps**:
  - Sign up at https://www.google.com/adsense/, get ad client ID (ca-pub-XXXXXXXXXXXXXXXX).
  - Uncomment AdSense scripts in:
    - Above banner (`/components/MainBanner.js`)
    - After first paragraph (`/pages/articles/[slug].js`)
    - Sidebar (`/components/Sidebar.js`)
  - Push changes to GitHub for auto-deploy.
- **Frequency**: When ready.

## 8. Monitor Logs
- **Task**: Check for errors or performance issues.
- **Steps**:
  - Go to DigitalOcean > App > “rwtnews” > “Logs.”
  - Review Strapi logs (http://localhost:1337/admin or deployed URL > “Logs”).
  - Optionally integrate with Papertrail/Datadog (App Platform > “Integrations”).
- **Frequency**: Weekly or after updates.

## 9. Update Content
- **Task**: Replace sample content and add new articles/memes.
- **Steps**:
  - In Strapi admin, update articles (`articles.json`) and memes (`memes.json`).
  - Upload new images to `/public/images/content/yyyy/mm/dd/` via Strapi Media Library.
- **Frequency**: As needed.

## Support
- Contact DigitalOcean support (Control Panel > “Support”).
- Refer to `DEBUGGING.md` for common fixes.
- Check Next.js (https://nextjs.org/docs), Strapi (https://docs.strapi.io/), SendGrid (https://docs.sendgrid.com/) documentation.