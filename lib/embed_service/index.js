// @flow
const _ = require('lodash');
const Promise = require('bluebird');
const serviceControl = require('../service_control');
const http = require('http');

const defaultServerCreator = () => {
  const id = Date.now();
  return http.createServer.call(http, (req, res) => res.end(`${id}`));
};


module.exports = serviceControl.addBoilerPlate('embed', {
  launch(embedArgs: Object = {}) {
    const hostPortParse = (embedArgs.host || '').match(/(.*):(\d+)$/) || [];
    const port = _.toInteger(embedArgs.port || hostPortParse[2] || 3000);
    const address = embedArgs.address || hostPortParse[1] || 'localhost';
    const name = embedArgs.name || `${address}:${port}`;
    const config = _.assign({
      name,
      port,
      address,
      host: `${address}:${port}`,
      listenArgs: [port, address],
      creator: defaultServerCreator,
    }, embedArgs);
    const start = () => { // eslint-disable-line arrow-body-style
      return Promise.resolve(config.creator.call(config))
      .then((server) =>
        new Promise((resolve, reject) => {
          const listenCB = (err) =>
            (err ? reject(err) : resolve({
              stop: () => { // eslint-disable-line arrow-body-style
                return Promise.promisify(server.close.bind(server))();
              },
              config,
            }));
          // eslint-disable-next-line prefer-spread
          server.listen.apply(server, config.listenArgs.concat(listenCB));
        }),
      );
    };
    return serviceControl.launchService(`embed.${name}`, start);
  },
});
