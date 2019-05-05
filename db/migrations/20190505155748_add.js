
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('users', function(table) {
          table.string('image_url');
        }),
    ])
};

exports.down = function(knex, Promise) {
  
};
