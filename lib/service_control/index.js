// @flow

const _ = require('lodash');
const Promise = require('bluebird');
const universe = require('../universe');

const serviceControlNS = universe.namespaceFactory('_cukeapi');
const { get, set, log3, unset, hasKey, getCukeContext, initializeWith } = serviceControlNS;

const listServices = (serviceRoot: string, depth: number) => {
  let serviceList = [];
  _.forIn(get(serviceRoot ? `_services.${serviceRoot}` : '_services'), (candidate, name) => {
    const namePath = serviceRoot ? `${serviceRoot}.${name}` : name;
    if (candidate.cukeContext) {
      serviceList.push(namePath);
    } else if (depth < 10) {
      const deepServiceList = listServices(namePath, depth + 1);
      serviceList = serviceList.concat(deepServiceList);
    }
  });
  return serviceList;
};

const serviceControl = {
  serviceControlNS,

  addBoilerPlate(prefix: string, serviceObject: Object) {
    return _.defaults(serviceObject, {
      initialize() {
        return serviceControl.initialize.call(this);
      },
      getService(name) {
        return serviceControl.getService(`${prefix}.${name}`);
      },
    });
  },

  initialize() {
    if (hasKey('_services')) return;
    initializeWith.call(this, { _services: {} });

    const cukeContextKiller = (cukeContext) => {
      const killTheseServices = listServices('', 0)
        .filter((namePath) => get(`_services.${namePath}`).cukeContext === cukeContext);
      log3('log3', 'killTheseServices', killTheseServices);
      return Promise.map(killTheseServices, (name) => serviceControl.stopService(name));
    };

    this.After(cukeContextKiller.bind(null, 'scenario'));
    this.registerHandler('AfterFeature', cukeContextKiller.bind(null, 'feature'));
    this.registerHandler('AfterFeatures', cukeContextKiller.bind(null, 'universe'));
  },

  stopService(name: string) {
    const service = get(`_services.${name}`);
    if (!service) return Promise.resolve(`no service for ${name}`);
    unset(`_services.${name}`);
    if (service.stop) {
      return service.stop();
    } else if ((service.proc || {}).kill) {
      service.removeListeners();
      service.proc.kill('SIGTERM');
      return service.exitPromise;
    }
    throw new Error(`Don't know how to stop service "${name}"`);
  },

  getService(name: string) {
    return get(`_services.${name}`);
  },

  launchService(name: string, start: () => Object) {
    if (!get('_services')) {
      throw new Error('tried to launchService before service_control was initialized');
    }
    return serviceControl.stopService(name)
    .then(start)
    .then((service) => {
      if (!service.stop || !_.isFunction(service.stop)) {
        throw new Error(`service '${name}' is missing a stop function`);
      }
      set(`_services.${name}`, service);
      service.name = name; // eslint-disable-line no-param-reassign
      service.cukeContext = getCukeContext(); // eslint-disable-line no-param-reassign
      return service;
    });
  },
};

module.exports = serviceControl;
