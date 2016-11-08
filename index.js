/* eslint global-require: "off"*/
const EventEmitter = require('events');
const _ = require('lodash');
const { createNotStep, createThrowStep } = require('./lib/util');

const hooks = require('./lib/hooks');

const stepsDict = {
  diagnosticSteps: require('./lib/diagnostic_steps'),
  contextSteps: require('./lib/context_steps'),
  shellSteps: require('./lib/shell_steps'),
  requestSteps: require('./lib/request_steps'),
};

const initStepCreationEvents = function () {
  if (this.cucapiEmitter) return;
  this.cucapiEmitter = new EventEmitter();

  const origThen = this.Then;
  this.Then = function (...args) {
    origThen.apply(this, args);
    this.cucapiEmitter.emit('thenEvent', this, origThen, ...args);
  };

  const origGiven = this.Given;
  this.Given = function (...args) {
    origGiven.apply(this, args);
    this.cucapiEmitter.emit('givenEvent', this, origGiven, ...args);
  };

  const origWhen = this.When;
  this.When = function (...args) {
    origWhen.apply(this, args);
    this.cucapiEmitter.emit('whenEvent', this, origWhen, ...args);
  };
};

const notThenSteps = function (stepDefinitionFn) {
  return function () {
    initStepCreationEvents.call(this);
    this.cucapiEmitter.on('thenEvent', createNotStep);
    stepDefinitionFn.call(this);
    this.cucapiEmitter.removeListener('thenEvent', createNotStep);
  };
};

const allSteps = notThenSteps(function () {
  _.forIn(stepsDict, v => v.call(this));
});

module.exports = Object.assign(
  { hooks, initStepCreationEvents, notThenSteps, createThrowStep, allSteps },
  stepsDict
);
