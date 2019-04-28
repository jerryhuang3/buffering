
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('temp_info', function(table) {
      table.dropTimestamps();
    })
  ])
  .then( () => {
    return Promise.all([
      knex.schema.table('temp_info', function(table) {
        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
    ])
  })
};

exports.down = function(knex, Promise) {

};


// a query like this needs to be run in the database to have auto-updating timestamps
// i haven't done so .... this is just here for reference

// CREATE OR REPLACE FUNCTION update_changetimestamp_column()
// RETURNS TRIGGER AS $$
// BEGIN
//    NEW.changetimestamp = now();
//    RETURN NEW;
// END;
// $$ language 'plpgsql';