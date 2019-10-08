exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('relationships', function(table) {
      table.increments('friendship_id').primary();
      table.integer('user_one_id');
      table.foreign('user_one_id').references('users.id');
      table.integer('user_two_id');
      table.foreign('user_two_id').references('users.id');
      table.unique(['user_one_id', 'user_two_id']);
      table.specificType('status', 'smallint');
      table.integer('last_action_by');
    })
  ]);
};

exports.down = function(knex) {
  return Promise.all([knex.schema.dropTable('relationships')]);
};
