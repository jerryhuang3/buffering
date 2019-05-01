
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('tokens', function(table) {
      table.renameColumn('refresh_token', 'access_token');
    }),
    knex.schema.table('google_users', function(table) {
      table.string('refresh_token');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('tokens', function(table) {
      table.renameColumn('access_token', 'refresh_token');
    }),
    knex.schema.table('google_users', function(table) {
      table.dropColumn('refresh_token');
    })
  ])
};
