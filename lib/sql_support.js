const _ = require('lodash');
const handlebars = require('handlebars');
const ldMatchPattern = require('lodash-match-pattern');

const { get, set, initializeWith } = require('./universe').namespaceFactory('_cukeapi');

module.exports = {
  initialize() {
    return initializeWith.call(this);
  },

  rawQuery(queryStr) {
    // console.log('queryStr', queryStr);
    const currDb = get(`_services.knex.${get('currentDatabase')}`);
    if (!currDb) throw new Error('no "currentDatabase" defined');
    const query = handlebars.compile(queryStr)(get());
    set('sql.responsePromise', currDb.dbConn.raw(query));
    return get('sql.responsePromise');
  },

  queryMatchPattern(targetPattern) {
    const responsePromise = get('sql.responsePromise');
    // responsePromise.then((result) => console.log('result', result));
    return responsePromise.then(
      (result) => {
        const check = ldMatchPattern(result, targetPattern);
        if (check) throw new Error(check);
      }
    );
  },

  listDatabases() {
    console.log(_.keys(get('_services.knex'))); // eslint-disable-line no-console
  },
};
