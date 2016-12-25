const _ = require('lodash');
const handlebars = require('handlebars');
const { get } = require('../universe').namespaceFactory('_cukeapi');

module.exports = {
  parseStepArg(stepArg) {
    let toCompile = stepArg;
    if (stepArg.raw) {
      const dataTable = stepArg.raw();
      if (dataTable.length === 1 && dataTable[0].length === 1) {
        toCompile = dataTable[0][0];
      } else {
        return stepArg;
      }
    }
    return _.isString(toCompile) ? handlebars.compile(toCompile.trim())(get()) : stepArg;
  },
};
