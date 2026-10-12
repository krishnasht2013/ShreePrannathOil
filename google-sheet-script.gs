/**
 * Saves email sign-ups and orders from shreeprannathoil.com.np into a Google Sheet.
 * Setup steps are in SETUP-EMAIL-LIST.txt.
 */
var SHEET_NAME = "Leads";
var HEADERS = ["Time", "Source", "Name", "Email", "Phone", "Item", "Pack", "Amount", "Note", "Email consent"];

// Stops spreadsheet formulas typed into the form from running (for example =HYPERLINK(...)).
function clean(value) {
  var text = String(value || "").slice(0, 500);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function doPost(e) {
  var p = (e && e.parameter) || {};
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var book = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }
    // Only save people who agreed to email and gave a real-looking address.
    if (p.consent === "yes" && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(p.email || "")) {
      sheet.appendRow([
        new Date(), clean(p.source), clean(p.name), clean(p.email), clean(p.phone),
        clean(p.item), clean(p.pack), clean(p.amount), clean(p.note), "yes"
      ]);
    }
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput("ok");
}

// Lets you open the web app URL in a browser to check it is running.
function doGet() {
  return ContentService.createTextOutput("Shree Prannath Oil email list is running.");
}
