const _ = require('lodash');
const util = require('util');

const universe = {};
let currentWorld = null;
let universeInitialized = false;

module.exports = {
  namespaceFactory(namespace) {
    if (!universe[namespace]) {
      universe[namespace] = {};
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

      universeGet(key) {
        return _.isNil(key) ? universe[namespace] : _.get(universe[namespace], key);
      },

      inspect(...args) {
        const what = namespaceFunctions.get(_.isString(args[0]) ? args.shift() : null);
        const options = args[0];
        return util.inspect(what, _.defaults(options, { depth: 3 }));
      },
    };
    return namespaceFunctions;
  },

  initializeUniverse(universeDefaults) {
    _.defaultsDeep(universe, universeDefaults);
    if (universeInitialized) return;
    const OldWorld = this.World;
    class UniverseMergedWorld extends OldWorld {
      constructor() {
        super();
        _.defaultsDeep(this, universe);
        currentWorld = this;
      }
    }
    this.World = UniverseMergedWorld;
    universeInitialized = true;
  },
};
