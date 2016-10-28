const _ = require('lodash');
const expect = require('chai').expect;
const childProcess = require('child_process');
const handlebars = require('handlebars');

const shellSupport = {
  runShell(data, done) {
    childProcess.exec(data, (error, stdout, stderr) => {
      this.shell.STDOUT += stdout;
      this.shell.STDERR += stderr;
      this.shell.error = error;
      done(error);
    });
  },

  catchError(data, done) {
    shellSupport.runShell.call(this, data, () => done());
  },

  resetShell() {
    this.shell = {
      STDOUT: '',
      STDERR: '',
      error: null,
    };
  },

  resultEqual(stream, data) {
    expect(this.shell[stream].trim()).to.equal(data.trim());
  },

  resultErrorCode(targetCode) {
    expect(this.shell.error.code).to.equal(_.toNumber(targetCode));
  },

  resultRegexMatch(stream, data) {
    const re = new RegExp(data);
    expect(this.shell[stream].trim()).to.match(re);
  },

  resultTemplateMatch(stream, data) {
    const processed = handlebars.compile(data)(this.context);
    expect(this.shell[stream].trim()).to.equal(processed.trim());
  },
};

module.exports = shellSupport;
