# Ankate Consulting website (GitHub Pages version)

Static website for Ankate Consulting Ltd, ready to host on GitHub Pages. No server code is needed.

## Publish
1. Create a repository and upload the contents of this folder (keep the folders and the hidden `.github` and `.nojekyll` items). Alternatively upload `site.zip` with the workflow from the repair package.
2. In **Settings > Pages**, set **Source** to **GitHub Actions**. The included workflow publishes the site on every change.
3. The site is live at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

## Make the forms work
GitHub Pages cannot run PHP, so the forms send to [Formspree](https://formspree.io). Create four forms (enquiry, newsletter, job applications and call bookings) and replace `YOUR_CONTACT_FORM_ID`, `YOUR_NEWSLETTER_FORM_ID`, `YOUR_APPLICATION_FORM_ID` and `YOUR_BOOKING_FORM_ID` in every page that contains them. Search the files for `YOUR_` to find them all (they are in `index.html`, `contact.html`, `insights.html`, `jobs.html`, `resources.html`, `unsubscribed.html` and the files in `jobs/`).
Until you do, visitors see a message with the email, phone and WhatsApp details.

## Custom domain
Add a file named `CNAME` containing `www.ankateconsulting.co.ke`, set the DNS records GitHub lists under Settings > Pages, and tick Enforce HTTPS.

## Differences from the cPanel version
The cPanel version adds server-side email templates, double opt-in newsletter, first-party analytics and the dashboard, and server-side spam checks. On GitHub Pages, spam filtering and email are handled by Formspree, and analytics can be added with Plausible in the source package settings.

## Job applications on GitHub Pages
Because GitHub Pages cannot store files, applicants share a link to their CV (Google Drive, Dropbox or OneDrive) or email it using the button on each vacancy. The cPanel version accepts direct CV uploads.

## What the GitHub version does not include
GitHub Pages cannot run server code, so the employer portal, applicant status tracking and live booking availability are available on the cPanel version only. On GitHub the booking page works as a request form that follows your office hours, and your team confirms the time by email.
