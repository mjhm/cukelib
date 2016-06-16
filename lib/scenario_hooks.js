var capi = require('cucumber-api');

module.exports = function () {

  var self = this;
  if (! self._cucumberApi) self._cucumberApi = {};

  var capi = self._cucumberApi;

  this.Before({tags: ['@fakeTime']}, function () {
    capi.fakeTimerClock = sinon.useFakeTimers(Date.now());
    // The following moves the fakeTimer clock forward at about the same rate as the real clock.
    // so that the fakeTimer moves at least as fast as clock time.
    var recurseTimeout = function () {
      if (capi.fakeTimerClock) {
        capi.fakeTimerClock._setTimeout( function () {
          if (capi.fakeTimerClock) {
            capi.fakeTimerClock.tick(25);
            recurseTimeout();
          }
        }, 25);
      }
    };
    recurseTimeout();
  });

  this.After({tags: ['@fakeTime']}, function () {
    capi.fakeTimerClock.restore()
    delete capi.fakeTimerClock
  });

};
