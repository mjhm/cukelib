// @flow
const sqlSupport = require('./sql_support');

module.exports = function () {
  sqlSupport.initialize.call(this);
  this.Given(/^SQL query$/, sqlSupport.rawQuery);
  this.Then(/^SQL query result matched pattern$/, sqlSupport.queryMatchPattern);
  this.Then(/^SQL query had (\d+) rows?$/, sqlSupport.queryRowCount);
  this.Given(/^list databases$/, sqlSupport.listDatabases);
};
