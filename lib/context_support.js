/* eslint no-underscore-dangle: ["error", { "allow": ["_cucapi"] }]*/
const expect = require('chai').expect;
const _ = require('lodash');
const defaultCucapi = require('./util/default_cucapi');
const { get, set } = require('./util/universe').namespaceFactory('_cucapi');


const cucapiReserved = Object.keys(defaultCucapi());

const checkReserved = (k) => {
  if (_.includes(cucapiReserved, k)) {
    throw new Error(`"${k}" is a reserved cucucumber-api context key`);
  }
  return k;
};

module.exports = {
  set(k, v) { return set(checkReserved(k), v); },
  get(k) { return get(k); },
  setNumber(k, v) { return set(checkReserved(k), _.toNumber(v)); },
  equalString(k, v) { expect(get(k)).to.equal(v); },
  equalNumber(k, v) { expect(get(k)).to.equal(_.toNumber(v)); },
  notEqualString(k, v) { expect(get(k)).to.not.equal(v); },
  notEqualNumber(k, v) { expect(get(k)).to.not.equal(_.toNumber(v)); },
};
