
module.exports = function () {
  this.registerHandler('BeforeFeatures', (event, done) => {
    // check server and db
    done()
  }


  this.registerHandler('AfterFeatures', (event, done) => {
    // cleanup server and db
    done()
  }

  // This allows for steps to be timed and tested for execution time.
  this.registerHandler 'BeforeStep', (step, done) => {
    if (/the previous step took .* milliseconds/.test(step.getName()) { return; }
    if (/time is advanced/.test step.getName()) { return; }
    this.World.lastStepTimestamp = Date.now()
    done()
  }
}
