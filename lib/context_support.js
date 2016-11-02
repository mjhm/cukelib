/* eslint no-underscore-dangle: ["error", { "allow": ["_cucapi"] }]*/
const expect = require('chai').expect;
const _ = require('lodash');

const checkReserved = (k) => {
  const reserved = ['shell', 'request'];
  if (_.includes(reserved, k)) throw new Error(`"${k}" is a reserved cucucumber-api context key`);
  return k;
};

module.exports = {
  assignString(k, v) { this._cucapi[checkReserved(k)] = v; },
  assignNumber(k, v) { this._cucapi[checkReserved(k)] = _.toNumber(v); },
  equalString(k, v) { expect(this._cucapi[k]).to.equal(v); },
  equalNumber(k, v) { expect(this._cucapi[k]).to.equal(_.toNumber(v)); },
  notEqualString(k, v) { expect(this._cucapi[k]).to.not.equal(v); },
  notEqualNumber(k, v) { expect(this._cucapi[k]).to.not.equal(_.toNumber(v)); },
};
