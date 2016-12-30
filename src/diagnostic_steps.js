const util = require('util');
const { get, featureGet, universeGet } = require('./universe').namespaceFactory('_cukeapi');

module.exports = function () {
  this.Then(/^inspect "([^"]+)"$/, (path) =>
      console.log(path, util.inspect(get(path), { depth: 3 }))); // eslint-disable-line no-console

  this.Then(/^inspect scenario$/, () =>
    console.log(util.inspect(get(), { depth: 3 }))); // eslint-disable-line no-console

  this.Then(/^inspect feature$/, () =>
    console.log(util.inspect(featureGet(), { depth: 3 }))); // eslint-disable-line no-console

  this.Then(/^inspect universe$/, () =>
    console.log(util.inspect(universeGet(), { depth: 3 }))); // eslint-disable-line no-console

  this.Then(/^inspect "([^"]+)" to depth (\d+)$/, (path, depth) =>
      console.log(path, util.inspect(get(path), { depth }))); // eslint-disable-line no-console

  this.Then(/^inspect scenario to depth (\d+)$/, (depth) =>
      console.log(util.inspect(get(), { depth }))); // eslint-disable-line no-console

  this.Then(/^inspect feature to depth (\d+)$/, (depth) =>
    console.log(util.inspect(featureGet(), { depth }))); // eslint-disable-line no-console

  this.Then(/^inspect universe to depth (\d+)$/, (depth) =>
    console.log(util.inspect(universeGet(), { depth }))); // eslint-disable-line no-console
};
