/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex: any): Promise<any> {
    return knex.schema.createTable('country_master' , function(table){
      table.uuid('uuid_column').defaultTo(knex.raw('uuid_generate_v4()')).primary();
      table.string('country_name').notNullable();
      table.dateTime('created_at').defaultTo(knex.fn.now());
    })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex: any): Promise<any> {
    return knex.schema.dropTable("country_master")
  };
  