module.exports = {
  client: 'postgres',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'root',
    database: 'final',
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations',
  },
  seeds: {
    directory: './seeds',
  },
};

