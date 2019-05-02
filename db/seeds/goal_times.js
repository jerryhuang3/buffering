const moment = require('moment');
const today = moment(Date.now()).endOf('day');
const endOfDay = today.valueOf();

let pastWeekArray = [endOfDay];
for (let i = 1; i < 7; i++) {
  const ithDayAgo = today.subtract(i, 'days').valueOf();
  pastWeekArray.push(ithDayAgo);
}




exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex('goals').del();
  let paramsArray = [];

  const currentUsers = await knex('google_users').select()
  console.log(currentUsers);
  const userArray = currentUsers.map( userObj => userObj.google_id);
  console.log(userArray);
  userArray.forEach( userId => {
    pastWeekArray.forEach( dayRounded => {
      const obj = {
        google_id: userId,
        steps_goal: (1000 + Math.floor(3000 * Math.random())),
        day_rounded: dayRounded
      }
      paramsArray.push(obj);
    })
  })

  console.log(paramsArray);

  const insertsToRun = paramsArray.map( obj => {
    return knex('goals')
      .insert({
        google_id: obj.google_id,
        steps_goal: obj.steps_goal,
        day_rounded: obj.day_rounded
      })
  })

  console.log(insertsToRun)
  return Promise.all(insertsToRun);
};
