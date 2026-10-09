# Ankate Consulting website (GitHub Pages version)

Static website for Ankate Consulting Ltd, ready to host on GitHub Pages. No build step and no server code.

## Publish on GitHub Pages
1. Create a new GitHub repository (for example `ankate-consulting`) and upload **the contents of this folder** (not the folder itself), including the hidden `.nojekyll` file.
2. In the repository go to **Settings > Pages**. Under **Build and deployment** choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
3. After a minute the site is live at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

## Make the forms work (required)
GitHub Pages cannot run PHP, so both forms send to [Formspree](https://formspree.io) (free plan available).
1. Create two Formspree forms (contact and newsletter) that deliver to `info@ankateconsulting.co.ke`.
2. In the three files `index.html`, `contact.html` and `insights.html`, find and replace:
   - `YOUR_CONTACT_FORM_ID` with the contact form's ID
   - `YOUR_NEWSLETTER_FORM_ID` with the newsletter form's ID
3. Until you do this, the forms show an error message with the email, phone and WhatsApp details.

## Use the real domain (optional)
- Add a file named `CNAME` containing `www.ankateconsulting.co.ke`, then set the DNS records GitHub lists under **Settings > Pages > Custom domain** and tick **Enforce HTTPS**.
- Canonical tags, the sitemap and social tags already point to `https://www.ankateconsulting.co.ke`. If the site stays on `github.io`, change that address in the HTML files and in `sitemap.xml` and `robots.txt`.

## Differences from the cPanel version
- No PHP handlers, `.htaccess`, server-side logging or security headers (GitHub Pages does not support them). GitHub provides HTTPS.
- Forms use Formspree, and the privacy policy says so. Have the policy reviewed for the Kenya Data Protection Act 2019.
- `404.html` works on both `github.io/REPOSITORY-NAME/` and a custom domain.

## Still to replace before launch
- Founder certificate no. `CHRP-XXXX-XXXX` and IHRM membership no. `IHRM-XXXXX` (placeholders on `about.html`), and the sample "10+ years" and expertise list.
- Phone calls: +254 705 914 714. WhatsApp: +254 728 907 973. Office hours: Mon to Fri and Sat, 8:00 am to 5:00 pm.
- A high-resolution or vector version of the J.K. Mugo & Associates logo (current file is a cleaned-up redraw of a 200px original).

## Interactive features
The site includes a free HR health check (`hr-health-check.html`), scroll animations, inline form validation and a mobile-friendly menu. These work on GitHub Pages without any setup. Optional analytics and a pricing section are switched on in `config.json` of the source package, then rebuild.
