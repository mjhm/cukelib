const Promise = require('bluebird');

exports.up = (knex) =>
  Promise.all([
    knex.schema.createTable('users', (table) => {
      table.increments('id');
      table.string('name').unique();
      table.timestamps(true, true);
    }),

    knex.schema.createTable('ads', (table) => {
      table.increments('id');
      table.string('brand').unique();
      table.timestamps(true, true);
    }),
  ])
  .then(() =>
    knex.schema.createTable('user_ad_map', (table) => {
      table.integer('user').references('users.id').onDelete('CASCADE');
      table.integer('ad').references('ads.id').onDelete('CASCADE');
      table.integer('view_count').notNullable().defaultTo(0);
      table.primary('user', 'ad');
    })
  );


exports.down = (knex) =>
  knex.schema.dropTable('user_ad_map')
  .then(() =>
    Promise.all([
      knex.schema.dropTable('users'),
      knex.schema.dropTable('ads'),
    ])
  );
