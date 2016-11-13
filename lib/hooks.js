const _ = require('lodash');
const { exec } = require('child_process');

const shellSupport = require('./shell_support');
const requestSupport = require('./request_support');

module.exports = {
  resetScenarioEnvironment() {
    this.Before(function () {
      this._cucapi = {};
      shellSupport.resetShell.call(this);
      requestSupport.resetRequest.call(this);
    });
  },

  execServer(...args) {
    const execArgs = _.defaults(args);
    exec.apply(this, execArgs);


  },


  // this.registerHandler('BeforeFeatures', (payload, callback) => {
  //   console.log('BeforeFeatures payload', payload);
  //   callback()
  // });
  //
  // this.registerHandler('StepResult', (payload, callback) => {
  //   console.log('StepResult payload', payload);
  //   console.log('getFailureException', payload.getFailureException());
  //   console.log('getStatus', payload.getStatus());
  //   callback();
  // });
};
