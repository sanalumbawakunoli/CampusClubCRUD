
const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

// Create or open the SQLite database file.
const dbPath = path.join(__dirname, "campus_crud.db");
const db = new Database(dbPath);

// Enable foreign key enforcement.
db.pragma("foreign_keys = ON");

// Execute the database schema and sample records once.
const schemaPath = path.join(__dirname, "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

const existingTable = db
    .prepare(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'clubs'"
    )
    .get();

if (!existingTable) {
    db.exec(schema);
    console.log("Clubs table created and sample records inserted.");
} else {
    console.log("Clubs table already exists. Existing data preserved.");
}

console.log("SQLite database location:", dbPath);

module.exports = db;
