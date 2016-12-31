// @flow
const _ = require('lodash');
const Promise = require('bluebird');
const childService = require('../child_service');
const serviceControl = require('../service_control');
const tryRequire = require('../utilities/try_require');

const selenium = tryRequire('selenium-standalone', ['start']);

let seleniumCounter = 0;

module.exports = serviceControl.addBoilerPlate('selenium', {
  launch(opts: Object = {}) {
    let readyResolver = () => null;
    let readyRejecter = () => null;
    const isReadyPromise = new Promise((resolve, reject) => {
      readyResolver = resolve;
      readyRejecter = reject;
    });
    const launcher = (config) => new Promise((startResolver, startRejecter) => {
      try {
        let hasStarted = false;
        const spawnCb = (...args) => {
          hasStarted = true;
          startResolver(...args);
        };
        selenium.start(
          // _.defaults({ spawnCb: startResolver }, config.seleniumOptions),
          _.defaults({ spawnCb }, config.seleniumOptions),
          (err) => {
            if (hasStarted) {
              return err ? readyRejecter(err) : readyResolver(true);
            }
            return startRejecter(err);
          }
        );
      } catch (err) {
        startRejecter(err);
      }
    });
    const config = childService.makeSpawnConfig({
      name: opts.name || `selenium_${seleniumCounter += 1}`,
      isReady: () => isReadyPromise,
      seleniumOptions: opts,
    });

    const defaultStderrHandler = config.stderrHandler;
    config.stderrHandler = (data) => {
      if (!/\sINFO\s-\s/.test(data)) {
        defaultStderrHandler(data);
      }
    };

    return childService.launch(config, launcher);
  },
});
