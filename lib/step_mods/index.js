/* eslint-disable no-multi-spaces, prefer-rest-params, no-unused-vars, no-underscore-dangle */
// @flow
const EventEmitter = require('events');
const _ = require('lodash');
const randexp = require('randexp').randexp;
const assert = require('assert');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const cukeapiEmitter = new EventEmitter();
let areStepFunctionsPatched = false;

const assertFail = (msg) => {
  throw new chai.AssertionError(msg);
};

chai.use(chaiAsPromised);

const stepMods = {
  initialize() {
    if (areStepFunctionsPatched) return;

    const origThen = this.Then;
    this.Then = function (...args) {
      const result = origThen.apply(this, args);
      cukeapiEmitter.emit('thenEvent', this, origThen, ...args);
      return result;
    };

    const origGiven = this.Given;
    this.Given = function (...args) {
      const result = origGiven.apply(this, args);
      cukeapiEmitter.emit('givenEvent', this, origGiven, ...args);
      return result;
    };

    const origWhen = this.When;
    this.When = function (...args) {
      const result = origWhen.apply(this, args);
      cukeapiEmitter.emit('whenEvent', this, origWhen, ...args);
      return result;
    };
    areStepFunctionsPatched = true;
  },

  withThenNotSteps(stepDefinitionFn: Function) {
    if (!this.World) {
      throw new Error(
        'withThenNotSteps must be called in the cucumber context that contains this.World'
      );
    }
    stepMods.initialize.call(this);
    cukeapiEmitter.on('thenEvent', stepMods.createNotStep);
    stepDefinitionFn.call(this);
    cukeapiEmitter.removeListener('thenEvent', stepMods.createNotStep);
  },

  withThrowSteps(stepDefinitionFn: Function) {
    if (!this.World) {
      throw new Error(
        'withThrowSteps must be called in the cucumber context that contains this.World'
      );
    }
    stepMods.initialize.call(this);
    cukeapiEmitter.on('thenEvent', stepMods.createThrowStep);
    cukeapiEmitter.on('givenEvent', stepMods.createThrowStep);
    cukeapiEmitter.on('whenEvent', stepMods.createThrowStep);
    stepDefinitionFn.call(this);
    cukeapiEmitter.removeListener('thenEvent', stepMods.createThrowStep);
    cukeapiEmitter.removeListener('givenEvent', stepMods.createThrowStep);
    cukeapiEmitter.removeListener('whenEvent', stepMods.createThrowStep);
  },

  throwStep(fn: Function, errorClassName: string, msg: string) {
    const genericWrap = function (...args) {
      let throwMe = false;
      let result;
      try { // Check synchronous first
        result = fn.call(this, ...args);
        const isPromise = _.isObject(result) && _.isFunction(result.then);
        if (!isPromise) throwMe = true;
      } catch (error) {
        if (errorClassName && error.name !== errorClassName) {
          assertFail(
            `Expected thrown error to be type ${errorClassName} but was ${error.stack || error}`
          );
        }
        return error;
      }
      if (throwMe) assertFail(msg);

      throwMe = true;
      return result.catch((error) => {
        if (errorClassName && error.name !== errorClassName) {
          assertFail(
            `Expected rejected error to be type ${errorClassName} but was ${error.stack || error}`
          );
        }
        throwMe = false;
        return error;
      }).then((resolution) => {
        if (throwMe) {
          assertFail(msg ||
            `Expected promise from ${fn.name} to be rejected but was resolved with ${resolution}`
          );
        }
        return resolution;
      });
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

  // notStep(fn: Function) {
  //   return stepMods.throwStep(fn, chai.AssertionError,
  //     'All assertions succeeded in "Not!" step');
  // },

  createNotStep(self: any, origDefineStep: Function, ...args: Array<any>) {
    const re = args[0];
    const fn = args[args.length - 1];
    if (!(re instanceof RegExp) || typeof fn !== 'function') return;

    if (re.source[re.source.length - 1] !== '$') {
      throw new Error(
        `Can't create a 'Not!' step for the regex /${re.source}/ which doesn't end with '$'`
      );
    }

    if (re.test((`${randexp(re)}!`))) {
      throw new Error(
        `Can't create a 'Not!' step for the regex /${re.source}/ which has an ambiguous ending`
      );
    }

    const notTailRe = /[.\s]+[Nn]ot!$/;
    const notArgs = args.slice(0);
    notArgs[0] = new RegExp(re.source.slice(0, -1) + notTailRe.source);
    // notArgs[notArgs.length - 1] = stepMods.notStep(fn);
    notArgs[notArgs.length - 1] = stepMods.throwStep(fn, 'AssertionError',
      'Unfortunately, all assertions succeeded in "Not!" step');
    origDefineStep(...notArgs);
  },

  createThrowStep(self: any, origDefineStep: Function, ...args: Array<any>) {
    const re = args[0];
    const fn = args[args.length - 1];
    if (!(re instanceof RegExp) || typeof fn !== 'function') return;

    if (re.source[re.source.length - 1] !== '$') {
      throw new Error(
        `Can't create a 'Throws!' step for the regex /${re.source}/ which doesn't end with '$'`
      );
    }

    if (re.test((`${randexp(re)}!`))) {
      throw new Error(
        `Can't create a 'Throws!' step for the regex /${re.source}/ which has an ambiguous ending`
      );
    }

    const throwTailRe = /[.\s]+[Tt]hrows!$/;
    const throwArgs = args.slice(0);
    throwArgs[0] = new RegExp(re.source.slice(0, -1) + throwTailRe.source);
    throwArgs[throwArgs.length - 1] =
      stepMods.throwStep(fn, 'Error', '"Throw!" step did not throw an error as expected');
    origDefineStep(...throwArgs);
  },


  //
  // createThrowStep(
  //   self: any,
  //   origDefineStep: Function,
  //   errorClass: Error,
  //   msg: string,
  //   ...args: Array<any>) {
  //   const re = args[0];
  //   const fn = args[args.length - 1];
  //   const throwTailRe = /[.\s]+[Tt]hrows!$/;
  //   const throwArgs = args.slice(0);
  //   throwArgs[0] = new RegExp(re.source.slice(0, -1) + throwTailRe.source);
  //   throwArgs[throwArgs.length - 1] = stepMods.throwStep(fn, errorClass, msg);
  //   origDefineStep(...throwArgs);
  // },
};


module.exports = stepMods;
