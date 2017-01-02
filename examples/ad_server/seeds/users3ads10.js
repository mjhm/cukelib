const Promise = require('bluebird');

exports.seed = (knex) =>
  Promise.all([
    knex('users').insert([
      { name: 'Don Draper' },
      { name: 'Peggy Olson' },
      { name: 'Roger Sterling' },
    ]),
    knex('ads').insert([
      { brand: 'Lucky Strike' },
      { brand: 'Mohawk Airlines' },
      { brand: 'Clearasil' },
      { brand: 'Right Guard' },
      { brand: 'Menkens' },
      { brand: 'Playtex' },
      { brand: 'Samsonite' },
      { brand: 'Hilton' },
      { brand: 'Heinz Baked Beans' },
      { brand: 'Coca-Cola' },
    ]),
  ]);
