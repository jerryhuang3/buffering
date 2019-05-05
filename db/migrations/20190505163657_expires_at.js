
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('tokens', function(table) {
          table.bigint('expires_at');
          table.dropColumn('updated_at');
        }),
    ])
};

exports.down = function(knex, Promise) {
  
};
