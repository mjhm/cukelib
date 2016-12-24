// @flow

const _ = require('lodash');
const util = require('util');

const universe = {};
let currentFeature = {};
let currentScenario = {};
let isInitialized = false;
let cukeContext = 'universe';

const verbosity = _.clamp(_.toInteger(process.env.CUKEAPI_VERBOSITY), 0, 3);

/* eslint-disable no-console */
const log3 = (verbosity >= 3) ? console.log.bind(console) : () => undefined;
const log2 = (verbosity >= 2) ? console.log.bind(console) : () => undefined;
const log = (verbosity >= 1) ? console.log.bind(console) : () => undefined;
/* eslint-enable no-console */


const initialize = function () {
  if (!this.World) {
    throw new Error(
      'universe.initialize must be called in the cucumber context that contains this.World'
    );
  }
  if (isInitialized) return;
  this.registerHandler('BeforeFeature', () => {
    cukeContext = 'feature';
    currentFeature = {};
    _.forIn(universe, (v, k) => (currentFeature[k] = _.clone(v)));
  });
  this.registerHandler('AfterFeature', () => (currentFeature = {}));
  this.Before(() => {
    cukeContext = 'scenario';
    currentScenario = {};
    _.forIn(currentFeature, (v, k) => (currentScenario[k] = _.clone(v)));
  });
  this.After(() => (currentScenario = {}));
  isInitialized = true;
};


const checkInitialized = () => {
  if (!isInitialized) throw new Error('universe is not initialized');
};


const getContextObject = (namespace) => { // eslint-disable-line arrow-body-style
  return (currentScenario || {})[namespace] ||
         (currentFeature || {})[namespace] ||
         universe[namespace];
};

module.exports = {
  namespaceFactory(namespace: string) {
    if (!universe[namespace]) {
      universe[namespace] = {};
    }

    const namespaceFunctions = {
      get(key: ?string) {
        checkInitialized();
        const contextObject = getContextObject(namespace);
        return _.isNil(key) ? contextObject : _.get(contextObject, key);
      },

      set(key: string, val: any) {
        checkInitialized();
        log2(`set(${key}, ${val})`);
        _.set(getContextObject(namespace), key, val);
        return val;
      },

      unset(key: string) {
        checkInitialized();
        return _.unset(getContextObject(namespace), key);
      },

      featureGet(key: ?string) {
        checkInitialized();
        return _.isNil(key) ? currentFeature[namespace] : _.get(currentFeature[namespace], key);
      },

      universeGet(key: ?string) {
        checkInitialized();
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

      initializeWith(initObj: ?Object) {
        initialize.call(this);
        _.forIn(initObj, (v, k) => namespaceFunctions.set(k, v));
      },
      log,
      log2,
      log3,
    };
    return namespaceFunctions;
  },
};
