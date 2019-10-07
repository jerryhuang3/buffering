exports.seed = async function(knex) {
  await knex('points').del();
  let pointsArray = [];

  const currentUsers = await knex('users').select();

  const userArray = currentUsers.map(userObj => userObj.id);

  userArray.forEach(userId => {
    const obj = {
      id: userId,
      points: Math.floor(Math.random() * 100)
    };
    pointsArray.push(obj);
  });

  const insertsToRun = pointsArray.map(obj => {
    return knex('points').insert({
      id: obj.id,
      total: obj.points
    });
  });
  return Promise.all(insertsToRun);
};
