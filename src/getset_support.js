const expect = require('chai').expect;
const _ = require('lodash');
const { get, set, initializeWith } = require('./universe').namespaceFactory('_cukeapi');

const checkReserved = (k) => {
  if (/^_/.test(k)) {
    throw new Error('"_" prefix is not allowed on a cucucumber-api get/set key');
  }
  return k;
};

module.exports = {
  initialize() {
    return initializeWith.call(this);
  },

  setString(k, v) {
    return set(checkReserved(k), _.toString(v));
  },

  setNumber(k, v) {
    return set(checkReserved(k), _.toNumber(v));
  },

  equalString(k, v) {
    expect(get(k)).to.equal(v);
  },

  equalNumber(k, v) {
    expect(get(k)).to.equal(_.toNumber(v));
  },
};
