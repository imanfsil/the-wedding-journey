# Iman & Danial — Wedding Planner

This version is connected to the Google Apps Script Web App and reads wedding data from Google Sheets.

## Backend

Google Apps Script Web App:
https://script.google.com/macros/s/AKfycbwu-U9RJ7Rf6xrBoveNEclQWetHP-NlJl9Y36wcjK4q59KuhNYQvS33omGV9mvgS2c/exec

The website is read-only for now. Parents can view the planner without an account.

## Google Sheets tabs used

- Workflow
- Budget
- Guestlist
- Legal
- Personal Prep
- Tunang
- Nikah + Resepsi
- Media (optional; for Google Drive file references)

## Google Drive

The current stable backend does not call DriveApp directly because the Drive folder connection previously produced an Apps Script access error. Drive files can still be used by storing their share/view links in the Media sheet.

Suggested Media columns:

Category | Title | File ID | Drive Link | Type | Notes

## GitHub Pages

Upload the contents of this folder to the GitHub repository. The website can then be published with GitHub Pages.

Do not put an admin secret in app.js. The write API remains protected by the Apps Script Script Property `ADMIN_WRITE_SECRET`.
