const moment = require('moment');
const today = moment().endOf('day');
const endOfDay = today.valueOf();

let pastWeekArray = [endOfDay];
for (let i = 1; i < 7; i++) {
  const ithDayAgo = today.subtract(1, 'days').valueOf();
  pastWeekArray.push(ithDayAgo);
}

exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex('data').del();
  let paramsArray = [];

  const currentUsers = await knex('users').select();

  const userArray = currentUsers.map(userObj => userObj.id);

  const stepsGoal = [5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000];

  userArray.forEach(userId => {
    const randomGoal = stepsGoal[Math.floor(Math.random() * 8)];
    pastWeekArray.forEach(dayRounded => {
      const obj = {
        id: userId,
        day_rounded: dayRounded,
        steps_goal: randomGoal,
        daily_steps: 2000 + Math.floor(12000 * Math.random())
      };
      paramsArray.push(obj);
    });
  });

  const insertsToRun = paramsArray.map(obj => {
    return knex('data').insert({
      id: obj.id,
      day_rounded: obj.day_rounded,
      steps_goal: obj.steps_goal,
      daily_steps: obj.daily_steps
    });
  });
  return Promise.all(insertsToRun);
};
