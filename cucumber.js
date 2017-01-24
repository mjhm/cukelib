var common = [
  '--compiler js:babel-register',
  '--strict',
  '--format pretty'
].join(' ')

module.exports = {
  'default': common,
  'node-4': common + ' --tags "not @node-6"'
};
