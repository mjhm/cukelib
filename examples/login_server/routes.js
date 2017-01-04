/* eslint-disable new-cap */
module.exports = ({ POST, resources }) => {
  resources('users', { only: ['index', 'show', 'update', 'create', 'destroy'] });
  resources('ads', { only: ['index', 'show', 'update', 'create', 'destroy'] });
  POST('/users/:id/ads', { to: 'usersAds#requestAds' });
};
