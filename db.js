/** Database setup for BizTime. */

const { Client } = require("pg");

let DB;

// If we're running in test "mode", use our test db
// Make sure to create both databases!
if (process.env.NODE_ENV === "test") {
  DB = "biztime_test";
} else {
  DB= "biztime";
}


let db = new Client({
  host: "/var/run/postgresql",
  database: DB
});

db.connect();

module.exports = db;