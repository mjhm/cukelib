/* eslint-disable global-require, import/no-dynamic-require */
const _ = require('lodash');

// Wrapper for "require" that provides more useful error messages when certain
// service specific modules aren't installed.
module.exports = (id, stubs = []) => {
  try {
    return require(id);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      const newMsg = `Need to "npm install ${id}" to use this cukelib functionality`;
      const thrower = () => {
        throw new Error(newMsg);
      };
      stubs.forEach((stubPath) => _.set(thrower, stubPath, thrower));
      return thrower;
    }
    throw err;
  }
};
