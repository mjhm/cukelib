
var db = require('../lib/db');

module.exports = function () {
  this.Given(/^the SQL query$/, db.rawQuery);
  this.Then(/^the query result matched the pattern$/, db.queryMatchPattern);
};
