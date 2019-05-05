
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, name: 'Jon Snow', email: 'test@test.com', password: '$2b$10$upqEw52tj4nomhD/QFFD8uOzmbrDXJZjgufMXie30ECPEvnYG.VdG', image_url: 'http://3.bp.blogspot.com/-lRWlA1LjaHc/TZLiPkLsqbI/AAAAAAAABVw/rgJuEMLCBPE/s400/kit%2Bharington.jpg'}
      ]);
    });
};
