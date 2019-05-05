exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('tokens', function(table) {
      table.increments('id');
      table.string('google_id');
      table.foreign('google_id').references('google_users.google_id');
      table.string('access_token');
      table.string('refresh_token');
      table.datetime('updated_at');
    })
  ]);
};

exports.down = function(knex, Promise) {};
