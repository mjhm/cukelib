module.exports = {
  development: {
    client: 'mysql',
    connection: {
      database: 'login_server'
    }
  },

  features: {
    client: 'mysql',
    connection: {
      user: 'root',
      database: 'login_server_features'
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  }
};
