const moment = require('moment');
const today = moment(Date.now()).endOf('day');
const endOfDay = today.valueOf();

let pastWeekArray = [endOfDay];
for (let i = 1; i < 7; i++) {
  const ithDayAgo = today.subtract(i, 'days').valueOf();
  pastWeekArray.push(ithDayAgo);
}

// exports.seed = function(knex, Promise) {
//   // Deletes ALL existing entries
//   return Promise.all([
//     knex('goals')
//       .del()
//       .then(function() {
//         // Inserts seed entries
//         return Promise.all([
//           knex('google_users')
//             .where('id', '=', 5)
//             .select()
//             .then(usersArray => {
//               usersArray.forEach(user => {
//                 console.log(user);
//                 const googleId = user.google_id;
//                 pastWeekArray.forEach(dayRounded => {
//                   console.log(dayRounded);
//                   const randomNum = 1000 + Math.floor(3000 * Math.random());
//                   return Promise.all([
//                     knex('goals').insert({
//                       google_id: googleId,
//                       steps_goal: randomNum,
//                       day_rounded: dayRounded
//                     })
//                   ]);
//                 });
//               });
//             })
//         ]);
//       })
//   ]);
// };
const paramsArray = [];
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    knex('goals')
      .del()
      .then(function() {
        // Inserts seed entries
        return Promise.all([
          knex('google_users')
            .where('id', '=', 5)
            .select()
            .then(usersArray => {
              usersArray.forEach(user => {
                pastWeekArray.forEach(dayRounded => {
                  const obj = {
                    google_id: user.google_id,
                    steps_goal: (1000 + Math.floor(3000 * Math.random())),
                    day_rounded: dayRounded
                  };
                  console.log(obj);
                  paramsArray.push(obj);
                });
              });
            })
            .then(() => {
              return paramsArray.map(obj => {
                knex('goals').insert({
                  google_id: obj.google_id,
                  steps_goal: obj.steps_goal,
                  day_rounded: obj.day_rounded
                });
              });
            })
            .then(seed => {
              return Promise.all(seed);
            })
        ]);
      })
  ]);
};
