/* eslint global-require: "off"*/
const _ = require('lodash');
const { notStep } = require('./lib/util');

const hooks = require('./lib/hooks');

const stepsDict = {
  diagnosticSteps: require('./lib/diagnostic_steps'),
  contextSteps: require('./lib/context_steps'),
  shellSteps: require('./lib/shell_steps'),
  requestSteps: require('./lib/request_steps'),
};

const allSteps = function () {
  // Monkey patch this.Then so that it creates extra "...Not!' steps.
  const origThen = this.Then;
  this.Then = function (...args) {
    const re = args[0];
    const fn = args[args.length - 1];
    if (!(re instanceof RegExp) || typeof fn !== 'function') {
      origThen.apply(this, args);
      return;
    }
    const notTailRe = /[\.\s]+[Nn]ot!$/;
    const notArgs = args.slice(0);
    let notRe;
    if (re.source[re.source.length - 1] === '$') {
      // if regex ends in '$' just splice in the notTailRe for the "...Not!' step.
      origThen.apply(this, args);
      notRe = new RegExp(re.source.slice(0, -1) + notTailRe.source);
    } else {
      // otherwise the original step needs to be altered to distinguish from the "...Not!" step
      const newArgs = args.slice(0);
      newArgs[0] = new RegExp(re.source + /(?:|.*[^!])$/.source);
      origThen.apply(this, newArgs);
      notRe = new RegExp(re.source + /.*/.source + notTailRe.source);
    }
    notArgs[0] = notRe;
    notArgs[notArgs.length - 1] = notStep(fn);
    origThen.apply(this, notArgs);
  };
  // Add all the steps
  _.forIn(stepsDict, v => v.call(this));
};

module.exports = Object.assign({ hooks, allSteps }, stepsDict);
