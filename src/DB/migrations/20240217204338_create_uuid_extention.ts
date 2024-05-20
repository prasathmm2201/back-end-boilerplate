/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex: any): Promise<any> {
    return knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex: any): Promise<any> {
    return knex.schema.raw('DROP EXTENSION "uuid-ossp');
  };
  