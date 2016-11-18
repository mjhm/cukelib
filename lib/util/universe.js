const _ = require('lodash');

const universe = {};

module.exports = {
  namespaceFactory(namespace) {
    if (!universe[namespace]) {
      universe[namespace] = {};
    }
    return {
      get(self, key) {
        if (key === null) {
          return (self || {})[namespace];
        }
        return (self || {})[namespace] ?
          _.get(self[namespace], key) :
          _.get(universe[namespace], key);
      },

      set(self, key, val) {
        return (self || {})[namespace] ?
          _.set(self[namespace], key, val) :
          _.set(universe[namespace], key, val);
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
      }
    }
    this.World = UniverseMergedWorld;
  },
};
