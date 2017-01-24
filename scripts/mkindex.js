#!/usr/bin/env node

const fs = require('fs');
const camelCase = require('lodash/camelCase');

const excludes = ['step_features'];

const run = () => {
  let indexStr = 'module.exports = {\n';
  const filenames = fs.readdirSync(`${__dirname}/../lib`);
  filenames.forEach((fname) => {
    if (excludes.includes(fname)) return;
    const f = fname.replace(/\.js$/, '');
    indexStr += `  ${camelCase(f)}: require('./${f}'),\n`;
  });
  indexStr += '};\n';
  fs.writeFileSync(`${__dirname}/../lib/index.js`, indexStr, { encoding: 'utf8' });
};

if (require.main === module) run();
