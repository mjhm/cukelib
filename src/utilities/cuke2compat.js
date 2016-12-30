const cucumber = require('cucumber');

module.exports = function (modexp) {
  if (cucumber.defineSupportCode) {
    cucumber.defineSupportCode((context) => {
      modexp.call(context);
    });
  }
};
