const expect = require('chai').expect;
const _ = require('lodash');
const { get, set, universeGet } = require('./universe').namespaceFactory('_cukeapi');

const checkReserved = (k) => {
  const cukeapiReserved = Object.keys(get('_reserved'));
  if (_.includes(cukeapiReserved, k)) {
    throw new Error(`"${k}" is a reserved cucucumber-api get/set key`);
  }
  return k;
};

module.exports = {
  setString(k, v) { return set(checkReserved(k), _.toString(v)); },
  setNumber(k, v) { return set(checkReserved(k), _.toNumber(v)); },
  equalString(k, v) { console.log(k, v, universeGet()); expect(get(k)).to.equal(v); },
  equalNumber(k, v) { expect(get(k)).to.equal(_.toNumber(v)); },
  // notEqualString(k, v) { expect(get(k)).to.not.equal(v); },
  // notEqualNumber(k, v) { expect(get(k)).to.not.equal(_.toNumber(v)); },
};
