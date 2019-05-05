exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments('id');
      table.string('google_id');
      table.string('name');
      table.string('email').unique();
      table.string('password');
    })
  ]).then(function() {
    return Promise.all([
      knex.schema.createTable('tokens', function(table) {
        table.integer('id');
        table.foreign('id').references('users.id');
        table.string('access_token');
        table.string('refresh_token');
        table.datetime('updated_at');
      }),
      knex.schema.createTable('goals', function(table) {
        table.integer('id');
        table.foreign('id').references('users.id');
        table.string('steps_goal');
        table.timestamp('created_at');
        table.date('day_rounded');
      })
    ]);
  });
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.raw('DROP TABLE google_users, tokens, goals CASCADE')]);
};
