/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable('Books', function (table) {
      table.integer('quantity'); // Add the new column
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.alterTable('Books', function (table) {
      table.dropColumn('quantity'); // Remove the new column if needed
    });
  };
  
