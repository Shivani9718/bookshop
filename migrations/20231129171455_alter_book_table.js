/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// In the remove_quantity_column_from_books migration file

exports.up = function (knex) {
    return knex.schema.table('books', function (table) {
      table.dropColumn('quantity');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.table('books', function (table) {
      table.integer('quantity');
    });
  };
  