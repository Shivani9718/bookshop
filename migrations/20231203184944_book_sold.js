/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */// In a Knex migration file for creating the book_sold table

exports.up = function (knex) {
    return knex.schema.createTable('book_sold', function (table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.jsonb('book_purchased').notNullable(); // Use the appropriate data type for your special type
      table.jsonb('additional_details').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
  
      table.foreign('user_id').references('id').inTable('users');
      table.foreign('book_purchased').references('id').inTable('books');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('book_sold');
  };
  
