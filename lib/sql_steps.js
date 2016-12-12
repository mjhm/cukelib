
const dbSupport = require('./sql_support');

module.exports = function () {
  this.Given(/^SQL query$/, dbSupport.rawQuery);
  this.Then(/^query result matched pattern$/, dbSupport.queryMatchPattern);
};
