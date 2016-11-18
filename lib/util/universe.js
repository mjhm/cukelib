const _ = require('lodash');

const universe = {};
let currentWorld = null;

module.exports = {
  namespaceFactory(namespace) {
    if (!universe[namespace]) {
      universe[namespace] = {};
    }
    return {
      get(key) {
        if (_.isNil(key)) {
          return (currentWorld || {})[namespace];
        }
        return (currentWorld || {})[namespace] ?
          _.get(currentWorld[namespace], key) :
          _.get(universe[namespace], key);
      },

      set(key, val) {
        return (currentWorld || {})[namespace] ?
          _.set(currentWorld[namespace], key, val) :
          _.set(universe[namespace], key, val);
      },

      universeGet(key) {
        return _.get(universe[namespace], key);
      },
    };
  },

  mergeIntoWorld(universeDefaults) {
    _.defaultsDeep(universe, universeDefaults);
    const OldWorld = this.World;
    class UniverseMergedWorld extends OldWorld {
      constructor() {
        super();
        _.defaultsDeep(this, universe);
        currentWorld = this;
      }
    }
    this.World = UniverseMergedWorld;
  },
};
