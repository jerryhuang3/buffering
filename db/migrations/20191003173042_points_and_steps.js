exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('steps', function(table) {
      table.integer('id');
      table.foreign('id').references('users.id');
      table.integer('daily_steps');
      table.timestamp('created_at');
      table.bigInteger('day_rounded');
    }),
    knex.schema.createTable('points', function(table) {
      table.integer('id');
      table.foreign('id').references('users.id');
      table.integer('total');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('points').dropTable('steps')]);
};
