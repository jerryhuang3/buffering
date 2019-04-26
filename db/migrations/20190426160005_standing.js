
exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('goals', function (table) {
            table.integer('day');
            table.integer('steps_goal');
            table.integer('user_id');
            table.foreign('user_id').references('users.id');
        })
        .createTable('progress', function (table) {
            table.integer('day');
            table.integer('steps_walked');
            table.integer('user_id');
            table.foreign('user_id').references('users.id');
        })
        .createTable('standing', function (table) {
            table.integer('day');
            table.enu('status', ['bad', 'awful', 'hell'], { useNative: true, enumName: 'standing_type' });
            table.integer('user_id');
            table.foreign('user_id').references('users.id');
        })
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('goals')
        .dropTable('progress')
        .dropTable('standing')
};
