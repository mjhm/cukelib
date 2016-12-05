// eslint-disable-next-line import/no-extraneous-dependencies
const httpProxy = require('http-proxy');
const minimist = require('minimist');

const parsedArgs = minimist(process.argv);

const serverPort = parsedArgs.serverPort || process.env.SERVER_PORT || 3000;
const targetPort = parsedArgs.targetPort || process.env.TARGET_PORT || 3001;

httpProxy.createProxyServer({ target: `http://localhost:${targetPort}` }).listen(serverPort);
