const _ = require('lodash');
const handlebars = require('handlebars');
const { get } = require('../universe').namespaceFactory('_cukelib');

// Parses a step argument so that it treats a single cell cucumber table as plain text,
// and then evaluates it as a handlebars template using the cucumber _cukelib namespace object.
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
