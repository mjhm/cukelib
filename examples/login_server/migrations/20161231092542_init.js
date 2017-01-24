
exports.up = (knex) =>
  knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('name').unique();
    table.string('email').unique();
    table.string('password_hash');
    table.integer('boss_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('last_login').defaultTo(
      new Date(1000).toISOString().slice(0, 19).replace('T', ' ')
    );
    table.timestamps(true, true);
  });


exports.down = (knex) =>
  knex.schema.dropTable('users');
