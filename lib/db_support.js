
const handlebars = require('handlebars');
const ldMatchPattern = require('lodash-match-pattern');

const { get, set } = require('./util/universe').namespaceFactory('_cucapi');

module.exports = {
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
