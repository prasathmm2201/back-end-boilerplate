import type { Knex } from "knex";

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const connection: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    debug: false,
    connection: {
      user: DB_USERNAME,
      host: DB_HOST,
      port: Number(DB_PORT),
      database: DB_NAME,
      password: DB_PASSWORD,
    },
    pool: {
      min: 0,
      max: 10,
      idleTimeoutMillis: 300000,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
      loadExtensions: [".ts"],
    },
    seeds: {
      directory: "./seeders",
    },
  },
};
module.exports = connection;
