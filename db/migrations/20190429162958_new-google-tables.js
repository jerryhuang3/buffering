
exports.up = function(knex, Promise) {
  return Promise.all([
    // fuck it
    knex.raw('DROP TABLES')
  ])
  .then( function() {
    return Promise.all([
      knex.schema
      .createTable('google_users', function(table) {
        table.string('google_id').primary();
        table.string('name');
        table.string('email');
      })
    ])
  })
  .then( function() {
    return Promise.all([
      knex.schema
      .createTable('tokens', function(table) {
        table.string('google_id');
        table.foreign('google_id').references('google_users.google_id');
        table.string('refresh_token');
        // see include timestamps comments for additional features
        table.datetime('updated_at');
      })
      .createTable('goals', function(table) {
        table.string('google_id');
        table.foreign('google_id').references('google_users.google_id');
        table.integer('steps_goal');
        table.timestamp('created_at');
        table.date('day_rounded');
      })
    ])
  })
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.raw('DROP TABLES')
  ]);
};
