const Promise = require('bluebird');

exports.seed = (knex) =>
  Promise.all([
    knex('users').insert([
      { name: 'Don Draper' },
      { name: 'Peggy Olson', boss_id: 1 },
    ]),
  ]);
