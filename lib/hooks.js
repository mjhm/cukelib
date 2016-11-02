
const shellSupport = require('./shell_support');
const requestSupport = require('./request_support');

module.exports = function () {
  this.Before(function () {
    this._cucapi = {};
    shellSupport.resetShell.call(this);
    requestSupport.resetRequest.call(this);
  });


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
