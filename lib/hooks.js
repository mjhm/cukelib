
const shellSupport = require('./shell_support');

module.exports = function () {
  this.Before(function () {
    this.context = {};
    shellSupport.resetShell.call(this);
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
