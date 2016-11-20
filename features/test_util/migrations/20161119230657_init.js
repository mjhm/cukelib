const Promise = require('bluebird');

exports.up = function (knex) {
  console.log('migrations up');
  return Promise.all([
    knex.schema.createTable('users', (table) => {
      table.increments('id');
      table.string('name').notNullable();
      table.float('access_count').defaultTo(0).notNullable();
      table.timestamps(true, true);
    }),
    knex.schema.createTable('friend_map', (table) => {
      table.integer('user_id').references('users.id').onDelete('CASCADE');
      table.integer('friend_id').references('users.id').onDelete('CASCADE');
      table.timestamps(true, true);
      table.primary(['user_id', 'friend_id']);
    }),
  ]);
};

exports.down = function (knex) {
  console.log('migrations down');
  return Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('friend_map'),
  ]);
};
