var matchPattern = require('lodash-match-pattern');
var expect = require('chai').expect;

module.exports = {
  truncateTables: function () {
    var self = this;
    var dbConn = self._capi.dbConnection;
    var tableListSql = {
      pg: "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public'",
      mysql: 'SELECT * FROM information_schema.tables',
      sqlite3: "SELECT name FROM sqlite_master WHERE type='table'"
    }
    return dbConn.raw(tableListSql[self._capi.options.db.client])
    .then(function (tableList) {
      return Promise.mapSeries(tableList, function (table) {
        return table.truncate();
      });
    });
  },

  rawQuery: function (query) {
    var capi = this._capi;
    var dbConn = capi.dbConnection;
    capi.db.queryPromise = dbConn.raw(query);
    return capi.db.queryPromise;
  },

  queryMatchPattern: function (targetPattern) {
    return this._capi.db.queryPromise.then(function (result) {
      var check = matchPattern(result, targetPattern);
      if (check) {
        throw new Error(check);
      }
    });
  }

};
