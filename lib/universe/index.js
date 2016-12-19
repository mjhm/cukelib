// @flow

const _ = require('lodash');
const util = require('util');

const universe = {};
let currentWorld = null;
let universeInitialized = false;
let cukeContext = 'universe';


const initialize = function () {
  this.registerHandler('BeforeFeature', () => (cukeContext = 'feature'));
  if (universeInitialized) return;
  const OldWorld = this.World;
  class UniverseMergedWorld extends OldWorld {
    constructor() {
      super();
      _.defaultsDeep(this, universe);
      currentWorld = this;
      cukeContext = 'scenario';
    }
  }
  this.World = UniverseMergedWorld;
  universeInitialized = true;
};

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
        const worldOrUniverse = (currentWorld || {})[namespace] || universe[namespace];
        return _.isNil(key) ? worldOrUniverse : _.get(worldOrUniverse, key);
      },

      set(key: string, val: any) {
        const worldOrUniverse = (currentWorld || {})[namespace] || universe[namespace];
        return _.set(worldOrUniverse, key, val);
      },

      unset(key: string) {
        const worldOrUniverse = (currentWorld || {})[namespace] || universe[namespace];
        return _.unset(worldOrUniverse, key);
      },


      universeGet(key: ?string) {
        return _.isNil(key) ? universe[namespace] : _.get(universe[namespace], key);
      },

      getCukeContext() {
        return cukeContext;
      },

      inspect(...args: any) {
        const what = namespaceFunctions.get(_.isString(args[0]) ? args.shift() : null);
        const options = args[0];
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
            '"this.World" is not defined. "initializeThis" must be defined in the cukeContext'
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
  // TODO is this needed (obsolete from initializeWith)
  initialize,
};
