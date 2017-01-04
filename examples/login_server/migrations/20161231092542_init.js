
exports.up = (knex) =>
  knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('name').unique();
    table.integer('boss_id').references('users.id').onDelete('SET NULL');
    table.timestamp('last_login').defaultTo(0);
    table.timestamps(true, true);
  });


exports.down = (knex) =>
  knex.schema.dropTable('users');
