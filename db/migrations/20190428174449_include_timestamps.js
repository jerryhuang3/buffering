
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('temp_info', function(table) {
      table.dropTimestamps('created_at');
      table.dropTimestamps('updated_at');
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    }
  ])
};

exports.down = function(knex, Promise) {

};
