
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('google_users', function(table) {
      table.bigInteger('google_id').primary();
      table.string('name');
      table.string('email');
      table.integer('wallet_amount');
    })
  ])
  .then(function() {
    return Promise.all([
      knex.schema.createTable('user_goals', function(table) {
          table.integer('day');
          table.integer('steps_goal');
          table.foreign('google_id').references('google_users.google_id');
        })
        .createTable('temp_info', function(table) {
          table.timestamps();
          table.foreign('google_id').references('google_users.google_id');
          table.string('access_token');
          table.string('current_status');
        })
    ])
  })
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.raw('DROP TABLE google_users, user_goals, temp_info CASCADE')
    ])
};
