const CONFIG = {
  SPREADSHEET_ID:
    "1HJkQnMX2bE3pxbcN7g6LxTVcDowbgz8Yrxeo6Gfa4cw",

  ADMIN_SECRET_PROPERTY:
    "ADMIN_WRITE_SECRET"
};


// ============================================================
// TEST CONNECTION
// ============================================================

function testConnection() {

  const spreadsheet =
    SpreadsheetApp.openById(
      CONFIG.SPREADSHEET_ID
    );

  Logger.log(
    "GOOGLE SHEET CONNECTED"
  );

  Logger.log(
    "Spreadsheet: " +
    spreadsheet.getName()
  );

  spreadsheet
    .getSheets()
    .forEach(
      sheet => {

        Logger.log(
          "Sheet: " +
          sheet.getName()
        );

      }
    );

  return {

    ok: true,

    spreadsheet:
      spreadsheet.getName()

  };

}


// ============================================================
// WEBSITE GET
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
          getDashboard()
        );


      case "workflow":

        return jsonResponse(
          getSheetData(
            ["Workflow"]
          )
        );


      case "budget":

        return jsonResponse(
          getSheetData(
            ["Budget"]
          )
        );


      case "guests":

        return jsonResponse(
          getSheetData(
            [
              "Guestlist",
              "Guest List"
            ]
          )
        );


      case "legal":

        return jsonResponse(
          getSheetData(
            ["Legal"]
          )
        );


      case "prep":

        return jsonResponse(
          getSheetData(
            ["Personal Prep"]
          )
        );


      case "tunang":

        return jsonResponse(
          getSheetData(
            ["Tunang"]
          )
        );


      case "nikah":

        return jsonResponse(
          getSheetData(
            ["Nikah + Resepsi"]
          )
        );


      case "inspiration":

        return jsonResponse(
          getSheetData(
            ["Inspiration"]
          )
        );


      case "files":

        return jsonResponse(
          getSheetData(
            [
              "Files",
              "Media"
            ]
          )
        );


      case "health":

        return jsonResponse(
          healthCheck()
        );


      default:

        return jsonResponse({

          ok: false,

          error:
            "Unknown action."

        });

    }

  }

  catch (error) {

    return jsonResponse({

      ok: false,

      error:
        error.message

    });

  }

}


// ============================================================
// DASHBOARD
// ============================================================

function getDashboard() {

  return {

    ok: true,

    budget:
      calculateBudget(
        getSheetData(
          ["Budget"]
        )
      ),

    workflow:
      calculateWorkflow(
        getSheetData(
          ["Workflow"]
        )
      ),

    guests:
      calculateGuests(
        getSheetData(
          [
            "Guestlist",
            "Guest List"
          ]
        )
      )

  };

}


// ============================================================
// GET SHEET DATA
// ============================================================

function getSheetData(
  possibleNames
) {

  const spreadsheet =
    SpreadsheetApp.openById(
      CONFIG.SPREADSHEET_ID
    );


  let sheet = null;


  for (
    let i = 0;
    i < possibleNames.length;
    i++
  ) {

    sheet =
      spreadsheet.getSheetByName(
        possibleNames[i]
      );


    if (sheet) {

      break;

    }

  }


  if (!sheet) {

    return {

      ok: false,

      headers: [],

      rows: [],

      error:
        "Sheet not found."

    };

  }


  const values =
    sheet
      .getDataRange()
      .getValues();


  if (!values.length) {

    return {

      ok: true,

      sheet:
        sheet.getName(),

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
        (
          row,
          index
        ) => {

          const object = {

            _rowNumber:
              index + 2

          };


          headers.forEach(
            (
              header,
              column
            ) => {

              object[header] =
                cleanValue(
                  row[column]
                );

            }
          );


          return object;

        }
      );


  return {

    ok: true,

    sheet:
      sheet.getName(),

    headers:
      headers,

    rows:
      rows

  };

}


// ============================================================
// CLEAN VALUES
// ============================================================

function cleanValue(
  value
) {

  if (
    value instanceof Date
  ) {

    return Utilities
      .formatDate(
        value,
        Session.getScriptTimeZone(),
        "yyyy-MM-dd"
      );

  }


  return value;

}


// ============================================================
// BUDGET
// ============================================================

function calculateBudget(
  response
) {

  let budget = 0;

  let paid = 0;


  if (
    response &&
    response.rows
  ) {

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

  }


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
// WORKFLOW
// ============================================================

function calculateWorkflow(
  response
) {

  const rows =
    response &&
    response.rows
      ? response.rows
      : [];


  const total =
    rows.length;


  let completed = 0;


  rows.forEach(
    row => {

      const status =
        String(
          row["Status"] ||
          ""
        )
        .toLowerCase()
        .trim();


      if (
        status === "done" ||
        status === "✅ done" ||
        status === "completed"
      ) {

        completed++;

      }

    }
  );


  return {

    total:
      total,

    completed:
      completed,

    percentage:
      total > 0
        ? Math.round(
            (
              completed /
              total
            ) * 100
          )
        : 0

  };

}


// ============================================================
// GUESTS
// ============================================================

function calculateGuests(
  response
) {

  const rows =
    response &&
    response.rows
      ? response.rows
      : [];


  let total = 0;

  let attending = 0;


  rows.forEach(
    row => {

      const pax =
        toNumber(
          row["Pax"]
        );


      total +=
        pax;


      if (
        String(
          row["RSVP"] ||
          ""
        )
        .toLowerCase()
        .trim() ===
        "attending"
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
// ADMIN WRITE
// ============================================================

function doPost(e) {

  try {

    const request =
      JSON.parse(
        e.postData.contents
      );


    if (
      !request.adminSecret ||
      !isValidAdminSecret(
        request.adminSecret
      )
    ) {

      return jsonResponse({

        ok: false,

        error:
          "Unauthorized."

      });

    }


    switch (
      request.action
    ) {

      case "add":

        return jsonResponse(
          addRow(request)
        );


      case "update":

        return jsonResponse(
          updateRow(request)
        );


      case "delete":

        return jsonResponse(
          deleteRow(request)
        );


      default:

        return jsonResponse({

          ok: false,

          error:
            "Unknown action."

        });

    }

  }

  catch (error) {

    return jsonResponse({

      ok: false,

      error:
        error.message

    });

  }

}


// ============================================================
// ADD ROW
// ============================================================

function addRow(
  request
) {

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

    ok: true

  };

}


// ============================================================
// UPDATE ROW
// ============================================================

function updateRow(
  request
) {

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
    (
      header,
      index
    ) => {

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

    ok: true

  };

}


// ============================================================
// DELETE ROW
// ============================================================

function deleteRow(
  request
) {

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

    ok: true

  };

}


// ============================================================
// ADMIN SECRET
// ============================================================

function isValidAdminSecret(
  secret
) {

  const saved =
    PropertiesService
      .getScriptProperties()
      .getProperty(
        CONFIG.ADMIN_SECRET_PROPERTY
      );


  return (
    saved &&
    secret === saved
  );

}


// ============================================================
// HEALTH CHECK
// ============================================================

function healthCheck() {

  try {

    const spreadsheet =
      SpreadsheetApp.openById(
        CONFIG.SPREADSHEET_ID
      );


    return {

      ok: true,

      spreadsheet:
        spreadsheet.getName(),

      status:
        "Backend connected."

    };

  }

  catch (error) {

    return {

      ok: false,

      error:
        error.message

    };

  }

}


// ============================================================
// NUMBER
// ============================================================

function toNumber(
  value
) {

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


  const number =
    parseFloat(
      String(value)
        .replace(
          /RM/gi,
          ""
        )
        .replace(
          /,/g,
          ""
        )
        .trim()
    );


  return isNaN(
    number
  )
    ? 0
    : number;

}


// ============================================================
// JSON RESPONSE
// ============================================================

function jsonResponse(
  data
) {

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
