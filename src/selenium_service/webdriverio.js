// @flow
const _ = require('lodash');
const Promise = require('bluebird');
const serviceControl = require('../service_control');
const webdriverio = require('webdriverio');

module.exports = serviceControl.addBoilerPlate('webdriverio', {
  launch(config: Object) {
    if (!config.name) throw new Error('name is a required config member');
    const start = () => {
      const client = webdriverio.remote(_.defaults(config, {
        desiredCapabilities: { browserName: 'chrome' }
      }));
      return Promise.resolve(client.init())
      .then(() => ({ stop: () => client.end(), client }));
    };

    return serviceControl.launchService(`webdriverio.${config.name}`, start);
  },
});
