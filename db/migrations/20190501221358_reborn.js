exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('google_users', function(table) {
      table.increments('id');
      table.string('google_id').unique();
      table.string('name');
      table.string('email').unique();
      table.string('password');
    })
  ]).then(function() {
    return Promise.all([
      knex.schema.createTable('tokens', function(table) {
        table.string('google_id');
        table.foreign('google_id').references('google_users.google_id');
        table.string('access_token');
        table.string('refresh_token');
        table.datetime('updated_at');
      }),
      knex.schema.createTable('goals', function(table) {
        table.string('google_id');
        table.foreign('google_id').references('google_users.google_id');
        table.string('steps_goal');
        table.timestamp('created_at');
        table.date('day_rounded');
      })
    ]);
  });
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.raw('DROP TABLE google_users, tokens, goals CASCADE')
      ]);
};
