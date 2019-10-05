exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('google_id');
      table.string('name');
      table.string('email');
      table.string('password');
      table.string('image_url');
    })
  ]).then(function() {
    return Promise.all([
      knex.schema.createTable('tokens', function(table) {
        table.integer('id');
        table.foreign('id').references('users.id');
        table.string('access_token');
        table.string('refresh_token');
        table.bigInteger('expires_at');
      }),
      knex.schema.createTable('data', function(table) {
        table.integer('id');
        table.foreign('id').references('users.id');
        table.bigInteger('day_rounded');
        table.integer('steps_goal');
        table.integer('daily_steps');
        table.timestamps(true, true);
      }),
      knex.schema.createTable('points', function(table) {
        table.integer('id');
        table.foreign('id').references('users.id');
        table.integer('total');
      })
    ]);
  });
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema
      .dropTable('users')
      .dropTable('tokens')
      .dropTable('data')
      .dropTable('points')
  ]);
};