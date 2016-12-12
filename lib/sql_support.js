const _ = require('lodash');
const handlebars = require('handlebars');
const ldMatchPattern = require('lodash-match-pattern');

const { get, set } = require('./universe').namespaceFactory('_cucapi');

module.exports = {
  initialize(options) {
    set('_reserved', 'sqlDatabases');
    set('sqlDatabases.defaultDatabase', _.defaults(options, {
      sqlDatabase: '_cucapi'
    }));
  },

  rawQuery(queryStr) {
    const dbConn = get(`databases.${get('currentDatabase')}.dbConn`);
    const query = handlebars.compile(queryStr)(get());
    set('db.responsePromise', dbConn.raw(query));
  },

  queryMatchPattern(targetPattern) {
    const responsePromise = get('db.responsePromise');
    // responsePromise.then((result) => console.log('result', result));
    responsePromise.then(
      (result) => {
        const check = ldMatchPattern(result, targetPattern);
        if (check) throw new Error(check);
      }
    );
  },
};
