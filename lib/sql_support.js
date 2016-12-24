const _ = require('lodash');
const { expect, AssertionError } = require('chai');
const { parseStepArg } = require('./utilities');
const ldMatchPattern = require('lodash-match-pattern');

const { get, set, initializeWith } = require('./universe').namespaceFactory('_cukeapi');

module.exports = {
  initialize() {
    return initializeWith.call(this);
  },

  rawQuery(queryStr) {
    const currDb = get(`_services.knex.${get('currentDatabase')}`);
    if (!currDb) throw new Error('no "currentDatabase" defined');
    const query = parseStepArg(queryStr);
    set('sql.responsePromise', currDb.dbConn.raw(query));
    return get('sql.responsePromise');
  },

  queryMatchPattern(targetPatternStr) {
    const targetPattern = parseStepArg(targetPatternStr);
    return get('sql.responsePromise').then((result) => {
      const resultToMatch = result.rows || result;
      const check = ldMatchPattern(resultToMatch, targetPattern);
      if (check) throw new AssertionError(check);
    });
  },

  queryRowCount(targetCountStr) {
    return get('sql.responsePromise').then((result) => {
      let rowCount;
      if (!result) rowCount = 0;
      else if (_.isInteger(result.rowCount)) rowCount = result.rowCount; // postgres
      else if (_.isArray(result)) rowCount = result.length; // sqlite
      else throw new Error(`Don't know how to parse row count from query result ${result}`);
      expect(rowCount).to.equal(_.toInteger(targetCountStr));
    });
  },

  listDatabases() {
    console.log(_.keys(get('_services.knex'))); // eslint-disable-line no-console
  },
};
