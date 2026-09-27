# Iman & Danial Wedding Planner — Architecture

## 1. Project Overview

The Iman & Danial Wedding Planner is a private personal wedding planning web app designed to manage the preparation for:

- 💍 Tunang — 1 May 2027
- 🤍 Akad Nikah — 28 August 2027
- 🤍 Nikah + Resepsi

The application is designed for two types of users:

### Owner / Admin — Iman

Iman can:

- Add tasks
- Edit tasks
- Complete tasks
- Manage the wedding timeline
- Add and edit budget items
- Track payments
- Manage guests
- Manage vendors
- Manage fitting dates
- Manage legal preparation
- Manage personal preparation
- Upload wedding media
- Add inspiration
- Edit wedding information

### Viewers — Parents / Family

Parents and family can:

- Open the web app
- View the dashboard
- View the timeline
- View budget information
- View guest information
- View wedding preparation
- View inspiration
- View media

Viewers must NOT be able to:

- Edit information
- Delete information
- Add information
- Change budget
- Change guest information
- Upload media
- Modify the database

No viewer login system is required.

---

# 2. Main Architecture

The application uses four main components:

```text
                    💍 WEDDING WEB APP
                           │
                           │
                    HTML / CSS / JS
                           │
                           ↓
                 Google Apps Script API
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ↓                           ↓
       Google Sheets               Google Drive
        DATABASE                     MEDIA
             │                           │
             └─────────────┬─────────────┘
                           ↓
                    Wedding Dashboard
