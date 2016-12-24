const _ = require('lodash');
const handlebars = require('handlebars');
const { get } = require('../universe').namespaceFactory('_cukeapi');

module.exports = {
  parseStepArg(stepArg) {
    const toCompile = _.isString(stepArg) ? stepArg : ((stepArg.raw || (() => []))()[0] || [])[0];
    return _.isString(toCompile) ? handlebars.compile(toCompile)(get()) : stepArg;
  },
};
