const mockData = require('../../mockdata.json');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return Promise.all([
        knex('users').insert(mockData),
        knex.raw('select setval(\'users_id_seq\', max(id)) from users')
      ]);
    });
};