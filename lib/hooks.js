
const shellSupport = require('./shell_support');

module.exports = function () {
  this.Before(function () {
    this.context = {};
    shellSupport.resetShell.call(this);
  });
};
