exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('relationships').del();

  let relationshipsArray = [];

  const users = await knex.select('id').from('users');
  const idArray = users.map(user => user.id);

  // Create random pairs of two user ids with smallest in  first position
  let randomPair = [];
  for (let i = 0; i < 3000; i++) {
    const random_id_one = 1 + Math.floor(Math.random() * idArray.length);
    const random_id_two = 1 + Math.floor(Math.random() * idArray.length);
    if (random_id_one < random_id_two) {
      randomPair = [...randomPair, [random_id_one, random_id_two]];
    } else if (random_id_two < random_id_one) {
      randomPair = [...randomPair, [random_id_two, random_id_one]];
    }
  }

  // change random pairs to strings
  for (let i = 0; i < randomPair.length; i++) {
    randomPair[i] = randomPair[i].join(' ');
  }

  // make strings unique and change string back into array of two numbers
  const uniquePair = [...new Set(randomPair)];
  for (let i = 0; i < uniquePair.length; i++) {
    uniquePair[i] = uniquePair[i].split(' ').map(Number);
  }

  // create a friendship between each random pair
  uniquePair.forEach((relation, idx) => {
    const friendship = {
      friendship_id: idx + 1,
      user_one_id: relation[0],
      user_two_id: relation[1],
      status: 1
    };
    relationshipsArray.push(friendship);
  });

  relationshipsArray.slice(0, 999);
  return Promise.all([knex('relationships').insert(relationshipsArray)]);
};

// select setval('users_id_seq', max(id)) from users;
// select setval('relationships_friendship_id_seq', max(friendship_id)) from relationships;
