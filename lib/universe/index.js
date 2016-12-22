// @flow

const _ = require('lodash');
const util = require('util');

const universe = {};
let currentFeature = {};
let currentScenario = {};
let universeInitialized = false;
let cukeContext = 'universe';


const initialize = function () {
  if (universeInitialized) return;
  this.registerHandler('BeforeFeature', () => {
    cukeContext = 'feature';
    currentFeature = _.assign({}, universe);
  });
  this.registerHandler('AfterFeature', () => (currentFeature = {}));
  this.Before(() => {
    cukeContext = 'scenario';
    currentScenario = _.assign({}, currentFeature);
  });
  this.After(() => (currentScenario = {}));
  universeInitialized = true;
};

const getContextObject = (namespace) =>
  (currentScenario || {})[namespace] || (currentFeature || {})[namespace] || universe[namespace];


module.exports = {
  namespaceFactory(namespace: string) {
    if (!universe[namespace]) {
      // Set up the universe with some basic global settings. These are protected from being
      // accidentally overwritten in the contest_support methods, but can still be affected
      // directly via this modules "set" methods.
      universe[namespace] = {
        _verbose: false,
        _reserved: {
          _reserved: true,
          _verbose: true,
        }
      };
    }

    const namespaceFunctions = {
      get(key: ?string) {
        const contextObject = getContextObject(namespace);
        return _.isNil(key) ? contextObject : _.get(contextObject, key);
      },

      set(key: string, val: any) {
        return _.set(getContextObject(namespace), key, val);
      },

      unset(key: string) {
        return _.unset(getContextObject(namespace), key);
      },

      featureGet(key: ?string) {
        return _.isNil(key) ? currentFeature[namespace] : _.get(currentFeature[namespace], key);
      },

      universeGet(key: ?string) {
        return _.isNil(key) ? universe[namespace] : _.get(universe[namespace], key);
      },

      getCukeContext() {
        return cukeContext;
      },

      inspect(a1: any, a2: ?Object) {
        const what = namespaceFunctions.get(_.isString(a1) ? a1 : null);
        const options = _.isString(a1) ? a2 : a1;
        return util.inspect(what, _.defaults(options, { depth: 3 }));
      },

      log(...args: any) {
        if (namespaceFunctions.get('_verbose')) {
          // eslint-disable-next-line no-console
          console.log(...args);
        }
      },

      // TODO tests needed
      initializeWith(initObj: Object) {
        if (!this.World) {
          throw new Error(
          `this.World" is not defined.
          "initializeThis" should be called with context from registerHandler('BeforeFeatures'...)`
          );
        }
        initialize.call(this);
        _.forIn(initObj, (v, k) => {
          namespaceFunctions.set(`_reserved.${k}`, true);
          namespaceFunctions.set(k, v);
        });
      },
    };
    return namespaceFunctions;
  },
  initialize,
};
