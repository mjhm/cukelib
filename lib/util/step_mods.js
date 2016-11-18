/* eslint no-multi-spaces: "off", prefer-rest-params: "off", no-unused-vars: "off" */

const randexp = require('randexp').randexp;
const assert = require('assert');
const chai = require('chai');

const util = {
  throwStep(fn, errorClass, msg) {
    const genericWrap = function (...args) {
      assert.throws(fn.bind(this, ...args), errorClass, msg);
    };
    const fnTemplates = [
      function () { return genericWrap.apply(this, arguments); },
      function (a1) { return genericWrap.apply(this, arguments); },
      function (a1, a2) { return genericWrap.apply(this, arguments); },
      function (a1, a2, a3) { return genericWrap.apply(this, arguments); },
      function (a1, a2, a3, a4) { return genericWrap.apply(this, arguments); },
      function (a1, a2, a3, a4, a5) { return genericWrap.apply(this, arguments); },
      function (a1, a2, a3, a4, a5, a6) { return genericWrap.apply(this, arguments); },
      function (a1, a2, a3, a4, a5, a6, a7) { return genericWrap.apply(this, arguments); },
      function (a1, a2, a3, a4, a5, a6, a7, a8) { return genericWrap.apply(this, arguments); },
      function (a1, a2, a3, a4, a5, a6, a7, a8, a9) { return genericWrap.apply(this, arguments); },
    ];
    return fnTemplates[fn.length];
  },
  notStep(fn) {
    return util.throwStep(fn, chai.AssertionError,
      'An expectation succeeded that should have failed.');
  },

  createNotStep(self, origDefineStep, ...args) {
    const re = args[0];
    const fn = args[args.length - 1];
    if (!(re instanceof RegExp) || typeof fn !== 'function') return;

    if (re.source[re.source.length - 1] !== '$') {
      throw new Error(
        `Can't create a 'not' step for the regex /${re.source}/ which doesn't end with '$'`
      );
    }

    if (re.test((`${randexp(re)}!`))) {
      throw new Error(
        `Can't create a 'not' step for the regex /${re.source}/ which has an ambiguous ending`
      );
    }

    const notTailRe = /[.\s]+[Nn]ot!$/;
    const notArgs = args.slice(0);
    notArgs[0] = new RegExp(re.source.slice(0, -1) + notTailRe.source);
    notArgs[notArgs.length - 1] = util.notStep(fn);
    origDefineStep(...notArgs);
  },

  createThrowStep(self, origDefineStep, errorClass, msg, ...args) {
    const re = args[0];
    const fn = args[args.length - 1];
    const throwTailRe = /[.\s]+[Tt]hrows!$/;
    const throwArgs = args.slice(0);
    throwArgs[0] = new RegExp(re.source.slice(0, -1) + throwTailRe.source);
    throwArgs[throwArgs.length - 1] = util.throwStep(fn, errorClass, msg);
    origDefineStep(...throwArgs);
  },
};


module.exports = util;
