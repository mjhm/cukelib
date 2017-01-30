const { requestSupport } = require('cukelib');

module.exports = function () {
  this.Given(/^user "([^"]*)" logs in using password "([^"]*)"$/, (email, password) => {
    requestSupport.requestPOST({ email, password });
  });
};
