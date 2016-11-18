const _ = require('lodash');
const expect = require('chai').expect;
const childProcess = require('child_process');
const handlebars = require('handlebars');
const { get, set } = require('./util/universe').namespaceFactory('_cucapi');

const shellSupport = {
  runShell(data, done) {
    childProcess.exec(data, (error, stdout, stderr) => {
      const shell = get(this, 'shell');
      shell.STDOUT += stdout;
      shell.STDERR += stderr;
      shell.error = error;
      done(error);
    });
  },

  catchError(data, done) {
    shellSupport.runShell.call(this, data, () => done());
  },

  resetShell() {
    set(this, 'shell.STDOUT', '');
    set(this, 'shell.STDERR', '');
    set(this, 'shell.error', null);
  },

  resultEqual(stream, data) {
    expect(get(this, `shell.${stream}`).trim()).to.equal(data.trim());
  },

  resultErrorCode(targetCode) {
    expect(get(this, 'shell.error.code')).to.equal(_.toNumber(targetCode));
  },

  resultRegexMatch(stream, data) {
    const re = new RegExp(data);
    expect(get(this, `shell.${stream}`).trim()).to.match(re);
  },

  resultTemplateMatch(stream, data) {
    const processed = handlebars.compile(data)(this._cucapi);
    expect(get(this, `shell.${stream}`).trim()).to.equal(processed.trim());
  },
};

module.exports = shellSupport;
