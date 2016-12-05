const _ = require('lodash');
const util = require('util');

const universe = {};
let currentWorld = null;
let universeInitialized = false;
let context = 'universe';

module.exports = {
  namespaceFactory(namespace) {
    if (!universe[namespace]) {
      universe[namespace] = { _reserved: { _reserved: true } };
    }
    const namespaceFunctions = {
      get(key) {
        const worldOrUniverse = (currentWorld || {})[namespace] ?
          currentWorld[namespace] : universe[namespace];
        return _.isNil(key) ? worldOrUniverse : _.get(worldOrUniverse, key);
      },

      set(key, val) {
        return (currentWorld || {})[namespace] ?
          _.set(currentWorld[namespace], key, val) :
          _.set(universe[namespace], key, val);
      },

      unset(key) {
        return (currentWorld || {})[namespace] ?
          _.unset(currentWorld[namespace], key) :
          _.unset(universe[namespace], key);
      },


      universeGet(key) {
        return _.isNil(key) ? universe[namespace] : _.get(universe[namespace], key);
      },

      getContext() {
        return context;
      },

      inspect(...args) {
        const what = namespaceFunctions.get(_.isString(args[0]) ? args.shift() : null);
        const options = args[0];
        return util.inspect(what, _.defaults(options, { depth: 3 }));
      },
    };
    return namespaceFunctions;
  },

  initialize(universeDefaults) {
    this.registerHandler('BeforeFeature', () => (context = 'feature'));
    _.defaultsDeep(universe, universeDefaults);
    if (universeInitialized) return;
    const OldWorld = this.World;
    class UniverseMergedWorld extends OldWorld {
      constructor() {
        super();
        _.defaultsDeep(this, universe);
        currentWorld = this;
        context = 'scenario';
      }
    }
    this.World = UniverseMergedWorld;
    universeInitialized = true;
  },
};
