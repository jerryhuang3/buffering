exports.seed = function (knex, Promise) {

    return Promise.all([
        knex.raw("TRUNCATE TABLE users, goals, progress, standing CASCADE")
    ])
    .then(function() {
        return Promise.all([
            knex('users').insert({ username : "Good", email: null, password_digest : "password", wallet_amount: 35, token : null }).returning("id"),
            knex('users').insert({ username : "Bad", email: null, password_digest : "password", wallet_amount: 35, token : null }).returning("id"),
            knex('users').insert({ username : "Awful", email: null, password_digest : "password", wallet_amount: 35, token : null }).returning("id"),
            knex('users').insert({ username : "Hell", email: null, password_digest : "password", wallet_amount: 35, token : null }).returning("id"),
        ])
    })
    .then(function(ids){
        let userIds= ids.map(id => parseInt(id[0]));
        let idxArrayMap =  ["good", "bad", "awful", "hell"];
        return Promise.all( userIds.map ( function(val, idx) {
            return Promise.all([
            knex('goals').insert({ day: 1, steps_goal: 5000, user_id: val }),
            knex('goals').insert({ day: 2, steps_goal: 5000, user_id: val }),
            knex('goals').insert({ day: 3, steps_goal: 5000, user_id: val }),
            knex('goals').insert({ day: 4, steps_goal: 5000, user_id: val }),
            knex('goals').insert({ day: 5, steps_goal: 5000, user_id: val }),
            // progress
            knex('progress').insert({ day: 1, steps_walked: 2340, user_id: val }),
            knex('progress').insert({ day: 2, steps_walked: 23234, user_id: val }),
            knex('progress').insert({ day: 3, steps_walked: 240, user_id: val }),
            knex('progress').insert({ day: 4, steps_walked: 2430, user_id: val }),
            knex('progress').insert({ day: 5, steps_walked: 6340, user_id: val }),

            knex('standing').insert({ day: 1, status: idxArrayMap[idx], user_id: val }),
            knex('standing').insert({ day: 2, status: idxArrayMap[idx], user_id: val }),
            knex('standing').insert({ day: 3, status: idxArrayMap[idx], user_id: val }),
            knex('standing').insert({ day: 4, status: idxArrayMap[idx], user_id: val }),
            knex('standing').insert({ day: 5, status: idxArrayMap[idx], user_id: val })
            ])
        }))
    })
}