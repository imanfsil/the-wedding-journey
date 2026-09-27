# Iman & Danial Wedding Planner

Starter web-app frontend based on the agreed requirements:
- Poppins typography
- Responsive mobile/tablet/desktop UI
- View mode for parents
- Private admin mode concept
- Google Sheets + Google Apps Script backend architecture
- Google Drive for media

This ZIP is a frontend starter, not yet connected to a live Google Apps Script endpoint.

## Run locally
Open `index.html` in a browser, or serve the folder with any simple static web server.

## Next backend step
Create a Google Apps Script Web App with read/write endpoints and set the endpoint in `assets/app.js`.

Important: frontend-only hiding of Admin controls is NOT security. The Apps Script write endpoint must enforce the owner/admin authorization server-side.
