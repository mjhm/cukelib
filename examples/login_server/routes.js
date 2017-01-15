/* eslint-disable new-cap */
module.exports = ({ GET, POST, resources }) => {
  GET('/users/current', { to: 'users#current' });
  POST('/users/login', { to: 'users#login' });
  POST('/users/logout', { to: 'users#logout' });
};
