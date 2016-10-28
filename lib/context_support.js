const expect = require('chai').expect;
const _ = require('lodash');

module.exports = {
  assignString(k, v) { this.context[k] = v; },
  assignNumber(k, v) { this.context[k] = _.toNumber(v); },
  equalString(k, v) { expect(this.context[k]).to.equal(v); },
  equalNumber(k, v) { expect(this.context[k]).to.equal(_.toNumber(v)); },
  notEqualString(k, v) { expect(this.context[k]).to.not.equal(v); },
  notEqualNumber(k, v) { expect(this.context[k]).to.not.equal(_.toNumber(v)); },
};
