# Iman & Danial Wedding Planner — Architecture

## 1. Website

The website is hosted through GitHub.

Frontend files:

- index.html
- assets/app.js
- assets/style.css

The website connects to Google Apps Script through the deployed Web App URL.

---

## 2. Backend

Google Apps Script acts as the API between the website and Google Sheets.

Flow:

Google Sheets
↓
Google Apps Script Web App
↓
GitHub Website

---

## 3. Google Sheets

The wedding planning database currently contains:

- Workflow
- Budget
- Guestlist
- Legal
- Personal Prep
- Tunang
- Nikah + Resepsi

The website reads these sheets through Apps Script.

---

## 4. Google Drive

Google Drive is used for wedding media and files.

Examples:

- Wedding inspiration
- Venue photos
- Dress references
- Decoration references
- Vendor files
- Receipts
- Documents
- Other wedding media

The current backend does NOT directly access DriveApp.

Instead, Drive file links can be stored in a Google Sheets Media sheet.

Example:

Category | Title | Drive Link | Type

---

## 5. Users

### Iman

Iman is the owner/admin of the wedding planner.

A secure editing system will be added later.

### Parents / Family

Parents and family are view-only.

They do not need to log in.

They must not be able to edit the wedding database.

---

## 6. Security

The public frontend must never contain the admin secret.

The current website only uses the public read API.

Admin editing will be implemented separately with server-side authorization.

---

## 7. Current API Actions

The Apps Script Web App supports:

- dashboard
- workflow
- budget
- guests
- legal
- prep
- tunang
- nikah
- files
- health

---

## 8. Main Wedding Dates

### Majlis Tunang

1 May 2027

### Akad Nikah

28 August 2027

### Venue

JIWA Damansara
