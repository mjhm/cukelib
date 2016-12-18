/* eslint global-require: "off"*/
const EventEmitter = require('events');
const _ = require('lodash');
const { createNotStep, createThrowStep } = require('./lib/util/step_mods');

const hooks = require('./lib/hooks');
const getsetSupport = require('./lib/getset_support');

const stepsDict = {
  diagnosticSteps: require('./lib/diagnostic_steps'),
  getsetSteps: require('./lib/getset_steps'),
  shellSteps: require('./lib/shell_steps'),
  requestSteps: require('./lib/request_steps'),
  responseSteps: require('./lib/response_steps'),
  dbSteps: require('./lib/db_steps'),
};

const initStepCreationEvents = function () {
  if (this.cukeapiEmitter) return;
  this.cukeapiEmitter = new EventEmitter();

  const origThen = this.Then;
  this.Then = function (...args) {
    origThen.apply(this, args);
    this.cukeapiEmitter.emit('thenEvent', this, origThen, ...args);
  };

  const origGiven = this.Given;
  this.Given = function (...args) {
    origGiven.apply(this, args);
    this.cukeapiEmitter.emit('givenEvent', this, origGiven, ...args);
  };

  const origWhen = this.When;
  this.When = function (...args) {
    origWhen.apply(this, args);
    this.cukeapiEmitter.emit('whenEvent', this, origWhen, ...args);
  };
};

const notThenSteps = function (stepDefinitionFn) {
  return function () {
    initStepCreationEvents.call(this);
    this.cukeapiEmitter.on('thenEvent', createNotStep);
    stepDefinitionFn.call(this);
    this.cukeapiEmitter.removeListener('thenEvent', createNotStep);
  };
};

const allSteps = notThenSteps(function () {
  _.forIn(stepsDict, (v) => v.call(this));
});

module.exports = Object.assign(
  { hooks, initStepCreationEvents, notThenSteps, createThrowStep, allSteps },
  stepsDict
);
