const bcrypt = require('bcryptjs');
const Promise = require('bluebird');


const workFactor = Number(process.env.WORK_FACTOR) || 2;


exports.seed = (knex) =>
  Promise.all([
    knex('users').insert([ 
      {
        name: 'Don Draper',
        email: 'don@scdp.com',
        password: bcrypt.hashSync('anna', bcrypt.genSaltSync(workFactor, 10)),
      },
      {
        name: 'Peggy Olson',
        email: 'peggy@scdp.com',
        boss_id: 1,
        password: bcrypt.hashSync('stan', bcrypt.genSaltSync(workFactor, 10)),
      },
    ]),
  ]);
