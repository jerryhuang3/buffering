exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('tokens', function(table) {
      table.bigint('expires_at');
      table.dropColumn('updated_at');
    }),
    knex.schema.table('google_users', function(table) {
      table.string('image_url');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('tokens', function(table) {
      table.dropColumn('expires_at');
    }),
    knex.schema.table('google_users', function(table) {
      table.dropColumn('image_url');
    })
  ]);
};
