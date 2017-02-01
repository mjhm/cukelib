/**
 * @module
 */
// @flow
const _ = require('lodash');
const expect = require('chai').expect;
const childProcess = require('child_process');
const { parseStepArg } = require('./utilities');
const { get, set, initializeWith } = require('./universe').namespaceFactory('_cukelib');

type Stream = 'STDOUT' | 'STDERR';

const shellSupport =
module.exports = {

  initialize() {
    return initializeWith.call(this);
  },

  /**
   * Runs `scriptStr`` lines in a childProcess
   *
   * Results of the run are stored in the universe at
   * `_shell.STDOUT`, `_shell.STDERR`, and `_shell.error`.
   * In particular the status code of execution is in `_shell.error.code`
   *
   * @param {string} scriptStr shell script
   * @param {function} done
   *
   * @returns undefined
   */
  runShell(scriptStr: string|Object, done: Function) {
    const script = parseStepArg(scriptStr);
    childProcess.exec(script, (error, stdout, stderr) => {
      set('_shell.STDOUT', (get('_shell.STDOUT') || '') + stdout);
      set('_shell.STDERR', (get('_shell.STDERR') || '') + stderr);
      set('_shell.error', error);
      done(error);
    });
  },

  runSkipError(scriptStr: string|Object, done: Function) {
    shellSupport.runShell.call(this, scriptStr, () => done());
  },

  resetShell() {
    set('_shell.STDOUT', '');
    set('_shell.STDERR', '');
    set('_shell.error', null);
  },

  inspectShellOutput() {
    /* eslint-disable no-console */
    console.log('STDOUT:');
    console.log(get('_shell.STDOUT'));
    console.log('STDERR:');
    console.log(get('_shell.STDERR'));
    const shellErr = get('_shell.error');
    if (shellErr) {
      console.log('Shell Error:');
      console.log(shellErr);
    }
    /* eslint-enable no-console */
  },

  resultEqual(stream: Stream, data: string|Object) {
    expect(get(`_shell.${stream}`).trim()).to.equal(parseStepArg(data));
  },

  resultErrorCode(targetCode: string) {
    expect(get('_shell.error.code')).to.equal(_.toNumber(targetCode));
  },

  resultRegexMatch(stream: Stream, data: string|Object) {
    const re = new RegExp(data);
    expect(get(`_shell.${stream}`).trim()).to.match(re);
  },

  resultTemplateMatch(stream: Stream, targetTemplate: string|Object) {
    const target = parseStepArg(targetTemplate);
    expect(get(`_shell.${stream}`).trim()).to.equal(target);
  },
};
