/**
 * ============================================================
 * IMAN & DANIAL WEDDING PLANNER
 * GOOGLE APPS SCRIPT BACKEND
 * ============================================================
 *
 * Architecture:
 *
 * Web App
 *    ↓
 * Google Apps Script
 *    ↓
 * ┌──────────────────┬──────────────────┐
 * ↓                  ↓                  ↓
 * Google Sheets    Google Drive      Admin Control
 *
 *
 * IMPORTANT:
 * This is the backend foundation.
 *
 * Before using it:
 * 1. Create your Wedding Google Sheet.
 * 2. Create your Wedding Google Drive folder.
 * 3. Put their IDs into CONFIG.
 * 4. Set the ADMIN_SECRET in Script Properties.
 *
 * DO NOT put your real admin secret inside this file.
 *
 * ============================================================
 */


// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {

  // Your Google Spreadsheet ID.
  //
  // Example:
  // https://docs.google.com/spreadsheets/d/ABC123456/edit
  //
  // Spreadsheet ID = ABC123456
  //
  SPREADSHEET_ID: "PUT_YOUR_GOOGLE_SHEET_ID_HERE",


  // Your main Google Drive wedding folder ID.
  //
  // Example:
  // https://drive.google.com/drive/folders/ABC123456
  //
  // Folder ID = ABC123456
  //
  DRIVE_FOLDER_ID: "PUT_YOUR_WEDDING_DRIVE_FOLDER_ID_HERE",


  // Name of the Script Property that will contain
  // the private admin secret.
  //
  // DO NOT put the actual secret here.
  //
  ADMIN_SECRET_PROPERTY: "ADMIN_WRITE_SECRET"
};


// ============================================================
// GET REQUEST
// ============================================================
//
// This is used by the public website.
//
// Parents can access the website without logging in.
//
// The website will request data from this function.
//
// Example:
//
// Website
//    ↓
// GET
//    ↓
// doGet()
//    ↓
// Google Sheet
//
// ============================================================

function doGet(e) {

  try {

    const action =
      e &&
      e.parameter &&
      e.parameter.action
        ? e.parameter.action
        : "dashboard";


    switch (action) {

      case "dashboard":
        return jsonResponse(
          getDashboardData()
        );


      case "workflow":
        return jsonResponse(
          getSheetData("Workflow")
        );


      case "budget":
        return jsonResponse(
          getSheetData("Budget")
        );


      case "guests":
        return jsonResponse(
          getSheetData("Guest List")
        );


      case "legal":
        return jsonResponse(
          getSheetData("Legal")
        );


      case "prep":
        return jsonResponse(
          getSheetData("Personal Prep")
        );


      case "tunang":
        return jsonResponse(
          getSheetData("Tunang")
        );


      case "nikah":
        return jsonResponse(
          getSheetData("Nikah + Resepsi")
        );


      default:

        return jsonResponse({
          ok: false,
          error: "Unknown action."
        });

    }

  } catch (error) {

    return jsonResponse({
      ok: false,
      error: error.message
    });

  }

}


// ============================================================
// POST REQUEST
// ============================================================
//
// IMPORTANT:
//
// This is where editing will happen.
//
// The public website should NEVER be able to modify
// your wedding data without authorization.
//
// We will validate an admin secret here.
//
// Parents/viewers should only use GET.
//
// ============================================================

function doPost(e) {

  try {

    if (!e || !e.postData) {

      return jsonResponse({
        ok: false,
        error: "No request data."
      });

    }


    const request =
      JSON.parse(
        e.postData.contents
      );


    // --------------------------------------------------------
    // ADMIN AUTHORIZATION
    // --------------------------------------------------------

    if (
      !request.adminSecret ||
      !isValidAdminSecret(
        request.adminSecret
      )
    ) {

      return jsonResponse({
        ok: false,
        error: "Unauthorized."
      });

    }


    // --------------------------------------------------------
    // ACTION
    // --------------------------------------------------------

    const action =
      request.action;


    switch (action) {


      case "update":

        return jsonResponse(
          updateSheetRow(request)
        );


      case "add":

        return jsonResponse(
          addSheetRow(request)
        );


      case "delete":

        return jsonResponse(
          deleteSheetRow(request)
        );


      default:

        return jsonResponse({
          ok: false,
          error: "Unknown write action."
        });

    }


  } catch (error) {

    return jsonResponse({

      ok: false,

      error:
        error.message

    });

  }

}


// ============================================================
// ADMIN SECRET VALIDATION
// ============================================================

function isValidAdminSecret(secret) {

  const storedSecret =
    PropertiesService
      .getScriptProperties()
      .getProperty(
        CONFIG.ADMIN_SECRET_PROPERTY
      );


  if (!storedSecret) {

    return false;

  }


  return (
    secret === storedSecret
  );

}


// ============================================================
// DASHBOARD DATA
// ============================================================
//
// This combines information from different sheets.
//
// Eventually this will provide:
//
// - Total Budget
// - Paid
// - Balance
// - Task Progress
// - Upcoming Tasks
// - Guest Count
//
// ============================================================

function getDashboardData() {

  const budget =
    getSheetData("Budget");


  const workflow =
    getSheetData("Workflow");


  const guests =
    getSheetData("Guest List");


  return {

    ok: true,

    budget:
      calculateBudgetSummary(
        budget
      ),

    workflow:
      calculateWorkflowSummary(
        workflow
      ),

    guests:
      calculateGuestSummary(
        guests
      )

  };

}


// ============================================================
// READ SHEET DATA
// ============================================================
//
// Converts a Google Sheet into JSON.
//
// First row = column names.
//
// Example:
//
// Name | Event | Status
//
// becomes:
//
// {
//   Name: "...",
//   Event: "...",
//   Status: "..."
// }
//
// ============================================================

function getSheetData(sheetName) {

  const spreadsheet =
    SpreadsheetApp.openById(
      CONFIG.SPREADSHEET_ID
    );


  const sheet =
    spreadsheet.getSheetByName(
      sheetName
    );


  if (!sheet) {

    return {

      ok: false,

      error:
        "Sheet not found: " +
        sheetName,

      rows: []

    };

  }


  const values =
    sheet
      .getDataRange()
      .getValues();


  if (
    values.length === 0
  ) {

    return {

      ok: true,

      headers: [],

      rows: []

    };

  }


  const headers =
    values[0];


  const rows =
    values
      .slice(1)
      .filter(
        row =>
          row.some(
            cell =>
              cell !== ""
          )
      )
      .map(
        row => {

          const object = {};


          headers.forEach(
            (header, index) => {

              object[
                header
              ] =
                row[index];

            }
          );


          return object;

        }
      );


  return {

    ok: true,

    sheet:
      sheetName,

    headers:
      headers,

    rows:
      rows

  };

}


// ============================================================
// BUDGET CALCULATION
// ============================================================

function calculateBudgetSummary(
  response
) {

  if (
    !response ||
    !response.rows
  ) {

    return {

      budget: 0,
      paid: 0,
      balance: 0

    };

  }


  let budget = 0;
  let paid = 0;


  response.rows.forEach(
    row => {

      budget +=
        toNumber(
          row["Budget (RM)"]
        );


      paid +=
        toNumber(
          row["Paid (RM)"]
        );

    }
  );


  return {

    budget:
      budget,

    paid:
      paid,

    balance:
      budget - paid

  };

}


// ============================================================
// WORKFLOW CALCULATION
// ============================================================

function calculateWorkflowSummary(
  response
) {

  if (
    !response ||
    !response.rows
  ) {

    return {

      total: 0,
      completed: 0,
      percentage: 0

    };

  }


  const rows =
    response.rows;


  const total =
    rows.length;


  const completed =
    rows.filter(
      row =>
        row["Status"] ===
        "✅ Done"
    ).length;


  const percentage =
    total > 0
      ? Math.round(
          (completed / total) *
          100
        )
      : 0;


  return {

    total:
      total,

    completed:
      completed,

    percentage:
      percentage

  };

}


// ============================================================
// GUEST CALCULATION
// ============================================================

function calculateGuestSummary(
  response
) {

  if (
    !response ||
    !response.rows
  ) {

    return {

      total: 0,
      attending: 0

    };

  }


  let total = 0;
  let attending = 0;


  response.rows.forEach(
    row => {

      const pax =
        toNumber(
          row["Pax"]
        );


      total +=
        pax;


      if (
        row["RSVP"] ===
        "Attending"
      ) {

        attending +=
          pax;

      }

    }
  );


  return {

    total:
      total,

    attending:
      attending

  };

}


// ============================================================
// ADD ROW
// ============================================================
//
// Used by Admin Mode.
//
// Example request:
//
// {
//   "action": "add",
//   "adminSecret": "...",
//   "sheet": "Budget",
//   "data": {
//      "Event": "Tunang",
//      "Item": "MUA"
//   }
// }
//
// ============================================================

function addSheetRow(request) {

  if (
    !request.sheet ||
    !request.data
  ) {

    return {

      ok: false,

      error:
        "Missing sheet or data."

    };

  }


  const spreadsheet =
    SpreadsheetApp.openById(
      CONFIG.SPREADSHEET_ID
    );


  const sheet =
    spreadsheet.getSheetByName(
      request.sheet
    );


  if (!sheet) {

    return {

      ok: false,

      error:
        "Sheet not found."

    };

  }


  const headers =
    sheet
      .getRange(
        1,
        1,
        1,
        sheet.getLastColumn()
      )
      .getValues()[0];


  const row =
    headers.map(
      header =>
        request.data[
          header
        ] ?? ""
    );


  sheet.appendRow(
    row
  );


  return {

    ok: true,

    message:
      "Row added."

  };

}


// ============================================================
// UPDATE ROW
// ============================================================

function updateSheetRow(request) {

  if (
    !request.sheet ||
    !request.rowNumber ||
    !request.data
  ) {

    return {

      ok: false,

      error:
        "Missing sheet, rowNumber or data."

    };

  }


  const spreadsheet =
    SpreadsheetApp.openById(
      CONFIG.SPREADSHEET_ID
    );


  const sheet =
    spreadsheet.getSheetByName(
      request.sheet
    );


  if (!sheet) {

    return {

      ok: false,

      error:
        "Sheet not found."

    };

  }


  const headers =
    sheet
      .getRange(
        1,
        1,
        1,
        sheet.getLastColumn()
      )
      .getValues()[0];


  headers.forEach(
    (header, index) => {

      if (
        Object.prototype.hasOwnProperty.call(
          request.data,
          header
        )
      ) {

        sheet
          .getRange(
            request.rowNumber,
            index + 1
          )
          .setValue(
            request.data[
              header
            ]
          );

      }

    }
  );


  return {

    ok: true,

    message:
      "Row updated."

  };

}


// ============================================================
// DELETE ROW
// ============================================================

function deleteSheetRow(request) {

  if (
    !request.sheet ||
    !request.rowNumber
  ) {

    return {

      ok: false,

      error:
        "Missing sheet or rowNumber."

    };

  }


  const spreadsheet =
    SpreadsheetApp.openById(
      CONFIG.SPREADSHEET_ID
    );


  const sheet =
    spreadsheet.getSheetByName(
      request.sheet
    );


  if (!sheet) {

    return {

      ok: false,

      error:
        "Sheet not found."

    };

  }


  sheet.deleteRow(
    request.rowNumber
  );


  return {

    ok: true,

    message:
      "Row deleted."

  };

}


// ============================================================
// GOOGLE DRIVE
// ============================================================
//
// This function returns information about the wedding
// media folder.
//
// Later we can expand this to:
//
// - Upload images
// - Create folders
// - List inspiration images
// - Delete media
//
// ============================================================

function getWeddingDriveFolder() {

  const folder =
    DriveApp.getFolderById(
      CONFIG.DRIVE_FOLDER_ID
    );


  return {

    id:
      folder.getId(),

    name:
      folder.getName(),

    url:
      folder.getUrl()

  };

}


// ============================================================
// UTILITY: NUMBER
// ============================================================

function toNumber(value) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {

    return 0;

  }


  if (
    typeof value ===
    "number"
  ) {

    return value;

  }


  const cleaned =
    String(value)
      .replace(
        /RM/g,
        ""
      )
      .replace(
        /,/g,
        ""
      )
      .trim();


  const number =
    parseFloat(
      cleaned
    );


  return isNaN(number)
    ? 0
    : number;

}


// ============================================================
// UTILITY: JSON RESPONSE
// ============================================================

function jsonResponse(data) {

  return ContentService

    .createTextOutput(
      JSON.stringify(
        data
      )
    )

    .setMimeType(
      ContentService
        .MimeType
        .JSON
    );

}
