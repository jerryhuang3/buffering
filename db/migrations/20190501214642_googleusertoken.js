exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('tokens'),
    knex.schema.dropTable('goals'),
    knex.schema.dropTable('google_users')
  ]);
};

exports.down = function(knex, Promise) {
  
};
