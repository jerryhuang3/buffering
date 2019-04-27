
exports.up = function (knex, Promise) {
    return knex.schema.createTable('test_table', function (table) {
        table.increments('id').primary();
        table.string('password');
        table.string('email');
        table.text('photo');
        table.text('bio');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('test_table');
};
