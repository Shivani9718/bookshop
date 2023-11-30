/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// In the create_purchased_books migration file

exports.up = function (knex) {
    return knex.schema.createTable('purchased_books', function (table) {
      table.increments('purchase_id').primary();
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
     // table.integer('book_id').unsigned().notNullable().references('id').inTable('books');
      
     // table.integer('store_id').unsigned().notNullable().references('store_id').inTable('bookstore');
      table.timestamp('purchase_date').defaultTo(knex.fn.now());
      
      // Add an array column named 'book_tags'
      table.specificType('book_purchased', 'TEXT[]');
  
      // Add a JSON column named 'additional_details'
      table.json('additional_details');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('purchased_books');
  };
  
