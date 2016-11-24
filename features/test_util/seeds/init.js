const Promise = require('bluebird');
const _ = require('lodash');

exports.seed = Promise.coroutine(function* (knex) {
  const userIdObjects = yield knex('users').insert([
    { name: 'Flashy Frank' },
    { name: 'Lazy Lanny' },
    { name: 'Serious Suzan' },
  ]).returning('id');
  const userIds = _.map(userIdObjects, 'id');

  yield knex('friend_map').insert([
    { user_id: userIds[0], friend_id: userIds[1] },
    { user_id: userIds[1], friend_id: userIds[2] },
    { user_id: userIds[2], friend_id: userIds[0] },
    { user_id: userIds[2], friend_id: userIds[1] },
  ]);
});
