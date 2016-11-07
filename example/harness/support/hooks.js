/* eslint import/no-unresolved: off */
const { hooks } = require('cucumber-api');

module.exports = function () {
  hooks.call(this);
};
