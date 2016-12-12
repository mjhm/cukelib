const expect = require('chai').expect;
const _ = require('lodash');
const { get, set } = require('./universe').namespaceFactory('_cucapi');

const checkReserved = (k) => {
  const cucapiReserved = Object.keys(get('_reserved'));
  if (_.includes(cucapiReserved, k)) {
    throw new Error(`"${k}" is a reserved cucucumber-api context key`);
  }
  return k;
};

module.exports = {
  setString(k, v) { return set(checkReserved(k), _.toString(v)); },
  setNumber(k, v) { return set(checkReserved(k), _.toNumber(v)); },
  equalString(k, v) { expect(get(k)).to.equal(v); },
  equalNumber(k, v) { expect(get(k)).to.equal(_.toNumber(v)); },
  notEqualString(k, v) { expect(get(k)).to.not.equal(v); },
  notEqualNumber(k, v) { expect(get(k)).to.not.equal(_.toNumber(v)); },
};
