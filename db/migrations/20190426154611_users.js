
exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('id');
            table.string('username').notNullable();
            table.string('email');
            table.string('password_digest');
            table.integer('wallet_amount');
            table.string('token');
        })
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('users');
};
