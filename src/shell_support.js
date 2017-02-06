/**
 * @module shellSupport
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
   * Runs `scriptStr` lines in a childProcess
   *
   * Results of the run are stored in the universe at
   * `_shellSTDOUT`, `_shellSTDERR`, and `_shellError`.
   * In particular the status code of execution is in `_shellError.code`
   *
   * Note that the `STDOUT` ans `STDERR` result accumulate over multiple steps.
   * Use {@link module:shell_support.resetShell|resetShell} to clear the previous results.
   *
   * @param {string} scriptStr shell script
   * @param {function} done childProcess completed callback
   *
   * @returns undefined
   */
  runShell(scriptStr: string|Object, done: Function) {
    const script = parseStepArg(scriptStr);
    childProcess.exec(script, (error, stdout, stderr) => {
      set('_shellSTDOUT', (get('_shellSTDOUT') || '') + stdout);
      set('_shellSTDERR', (get('_shellSTDERR') || '') + stderr);
      set('_shellError', error);
      done(error);
    });
  },

  /**
   * Same as {@link module:shell_support.runShell|runShell},
   * but doesn't fail when the execution errors.
   */
  runSkipError(scriptStr: string|Object, done: Function) {
    shellSupport.runShell.call(this, scriptStr, () => done());
  },

  /** resets (clears) the shell STDERR and STDOUT universe variable.
   * (Shell output is cumulative over multiple steps.)
   */
  resetShell() {
    set('_shellSTDOUT', '');
    set('_shellSTDERR', '');
    set('_shellError', null);
  },

  inspectShellOutput() {
    /* eslint-disable no-console */
    console.log('STDOUT:');
    console.log(get('_shellSTDOUT'));
    console.log('STDERR:');
    console.log(get('_shellSTDERR'));
    const shellErr = get('_shellError');
    if (shellErr) {
      console.log('Shell Error:');
      console.log(shellErr);
    }
    /* eslint-enable no-console */
  },

  resultEqual(stream: Stream, data: string|Object) {
    expect(get(`_shell${stream}`).trim()).to.equal(parseStepArg(data));
  },

  resultErrorCode(targetCode: string) {
    expect(get('_shellError.code')).to.equal(_.toNumber(targetCode));
  },

  resultRegexMatch(stream: Stream, data: string|Object) {
    const re = new RegExp(data);
    expect(get(`_shell${stream}`).trim()).to.match(re);
  },

  resultTemplateMatch(stream: Stream, targetTemplate: string|Object) {
    const target = parseStepArg(targetTemplate);
    expect(get(`_shell${stream}`).trim()).to.equal(target);
  },
};
