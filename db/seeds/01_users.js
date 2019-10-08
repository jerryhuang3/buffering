const mockData = require('../../mockdata.json');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return Promise.all([knex('users').insert(mockData)]);
    });
};
