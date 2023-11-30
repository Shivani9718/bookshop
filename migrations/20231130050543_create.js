/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('book_sold', function (table) {
        table.increments('sold_id').primary(),
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
      //table.json('purchase_dates');
      table.specificType('book_purchased', 'integer[]');
      table.jsonb('additional_details');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('book_sold');
  };
  
