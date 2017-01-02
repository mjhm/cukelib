
module.exports = ({ resources }) => {
  resources('users', { only: ['index', 'show', 'update', 'create', 'destroy'] });
  resources('ads', { only: ['index', 'show', 'update', 'create', 'destroy'] });
};
