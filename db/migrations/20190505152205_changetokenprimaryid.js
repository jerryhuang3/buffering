
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('tokens'),
      ]);
};

exports.down = function(knex, Promise) {
  
};
