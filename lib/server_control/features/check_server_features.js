#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const _ = require('lodash');

const run = () => {
  const tmpdir = path.join(__dirname, '../../../tmp');
  const filenames = fs.readdirSync(tmpdir);
  Promise.map(_.filter(filenames, (fn) => /^\d+$/.test(fn)), (fn) =>
    new Promise((resolve, reject) => {
      try {
        // This is just a process "ping" signal
        process.kill(fn, 0);
      } catch (err) {
        // If the process doen't exist the test passes, otherwise the process still exists
        // and we reject with an error.
        if (err.code === 'ESRCH') {
          return resolve();
        }
        return reject(err);
      }
      const fnContents = fs.readFileSync(path.join(tmpdir, fn), 'utf8');
      return reject(new Error(`Process still exists: ${fnContents}`));
    })
  ).then(() => process.exit(0))
  .catch((err) => {
    // If any of the processes are still in existence this script errors.
    // eslint-disable-next-line no-console
    console.log(`${process.argv}:`, err);
    process.exit(1);
  });
};

// Ignore if this was just automatically loaded by cucumber.
if (require.main === module) run();
