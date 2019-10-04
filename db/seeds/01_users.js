exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return Promise.all([
        knex('users').insert([
          {
            id: 1,
            name: 'Jon Snow',
            email: 'test@test.com',
            password: '$2b$10$upqEw52tj4nomhD/QFFD8uOzmbrDXJZjgufMXie30ECPEvnYG.VdG',
            image_url: 'https://avatars.dicebear.com/v2/avataaars/jonsnow.svg'
          },
          {
            id: 2,
            name: 'Second User',
            email: 'test1@test.com',
            password: '$2b$10$upqEw52tj4nomhD/QFFD8uOzmbrDXJZjgufMXie30ECPEvnYG.VdG',
            image_url: 'https://avatars.dicebear.com/v2/avataaars/seconduser.svg'
          },
          {
            id: 3,
            name: 'Third User',
            email: 'test2@test.com',
            password: '$2b$10$upqEw52tj4nomhD/QFFD8uOzmbrDXJZjgufMXie30ECPEvnYG.VdG',
            image_url: 'https://avatars.dicebear.com/v2/avataaars/thirduser.svg'
          },
          {
            id: 4,
            name: 'Fourth User',
            email: 'test3@test.com',
            password: '$2b$10$upqEw52tj4nomhD/QFFD8uOzmbrDXJZjgufMXie30ECPEvnYG.VdG',
            image_url: 'https://avatars.dicebear.com/v2/avataaars/fourthuser.svg'
          },
          {
            id: 5,
            name: 'Fifth User',
            email: 'test4@test.com',
            password: '$2b$10$upqEw52tj4nomhD/QFFD8uOzmbrDXJZjgufMXie30ECPEvnYG.VdG',
            image_url: 'https://avatars.dicebear.com/v2/avataaars/fifthuser.svg'
          },
          {
            id: 6,
            name: 'Sixth User',
            email: 'test5@test.com',
            password: '$2b$10$upqEw52tj4nomhD/QFFD8uOzmbrDXJZjgufMXie30ECPEvnYG.VdG',
            image_url: 'https://avatars.dicebear.com/v2/avataaars/sixthuser.svg'
          },
          {
            id: 7,
            name: 'Seventh User',
            email: 'test6@test.com',
            password: '$2b$10$upqEw52tj4nomhD/QFFD8uOzmbrDXJZjgufMXie30ECPEvnYG.VdG',
            image_url: 'https://avatars.dicebear.com/v2/avataaars/seventhuser.svg'
          },
          {
            id: 8,
            name: 'Eighth User',
            email: 'test7@test.com',
            password: '$2b$10$upqEw52tj4nomhD/QFFD8uOzmbrDXJZjgufMXie30ECPEvnYG.VdG',
            image_url: 'https://avatars.dicebear.com/v2/avataaars/eighthuser.svg'
          },
          {
            id: 9,
            name: 'Ninth User',
            email: 'test8@test.com',
            password: '$2b$10$upqEw52tj4nomhD/QFFD8uOzmbrDXJZjgufMXie30ECPEvnYG.VdG',
            image_url: 'https://avatars.dicebear.com/v2/avataaars/ninthuser.svg'
          },
          {
            id: 10,
            name: 'Tenth User',
            email: 'test9@test.com',
            password: '$2b$10$upqEw52tj4nomhD/QFFD8uOzmbrDXJZjgufMXie30ECPEvnYG.VdG',
            image_url: 'https://avatars.dicebear.com/v2/avataaars/tenthuser.svg'
          }
        ]),
        knex.raw('select setval(\'users_id_seq\', max(id)) from users')
      ]);
    });
};
