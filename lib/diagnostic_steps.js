const util = require('util');

module.exports = function () {
  this.Then(/^view world$/, function () {
    console.log(util.inspect(this, { depth: 10 })); // eslint-disable-line no-console
  });
};
