
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('goals', function(table) {
      table.dropColumn('steps_goal');
      table.dropColumn('day_rounded');
    })
  ]).then( () => {
    return Promise.all([
      knex.schema.table('goals', function(table) {
        table.bigInteger('day_rounded');
        table.integer('steps_goal');
      })
    ])
  })
};

exports.down = function(knex, Promise) {

};
