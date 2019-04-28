
exports.up = function(knex, Promise) {
    return knex.schema
      .createTable('user_goals', function(table) {
        table.integer('day');
        table.integer('steps_goal');
        table.bigInteger('google_id');
        table.foreign('google_id').references('google_users.google_id');
      })
      .createTable('temp_info', function(table) {
        table.timestamps();
        table.bigInteger('google_id');
        table.foreign('google_id').references('google_users.google_id');
        table.string('access_token');
        table.string('current_status');
      })
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema
      .dropTable('user_goals')
      .dropTable('temp_info')
  ])
};
