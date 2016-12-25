const _ = require('lodash');
const expect = require('chai').expect;
const childProcess = require('child_process');
const { parseStepArg } = require('./utilities');
const { get, set, initializeWith } = require('./universe').namespaceFactory('_cukeapi');

const shellSupport = {
  initialize() {
    return initializeWith.call(this);
  },

  runShell(scriptStr, done) {
    const script = parseStepArg(scriptStr);
    childProcess.exec(script, (error, stdout, stderr) => {
      set('_shell.STDOUT', (get('_shell.STDOUT') || '') + stdout);
      set('_shell.STDERR', (get('_shell.STDERR') || '') + stderr);
      set('_shell.error', error);
      done(error);
    });
  },

  catchError(scriptStr, done) {
    shellSupport.runShell.call(this, scriptStr, () => done());
  },

  resetShell() {
    set('_shell.STDOUT', '');
    set('_shell.STDERR', '');
    set('_shell.error', null);
  },

  resultEqual(stream, data) {
    expect(get(`_shell.${stream}`).trim()).to.equal(data.trim());
  },

  resultErrorCode(targetCode) {
    expect(get('_shell.error.code')).to.equal(_.toNumber(targetCode));
  },

  resultRegexMatch(stream, data) {
    const re = new RegExp(data);
    expect(get(`_shell.${stream}`).trim()).to.match(re);
  },

  resultTemplateMatch(stream, targetTemplate) {
    const target = parseStepArg(targetTemplate);
    expect(get(`_shell.${stream}`).trim()).to.equal(target);
  },
};

module.exports = shellSupport;
