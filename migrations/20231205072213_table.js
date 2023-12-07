/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
      .createTable("Bookstore", function (table) {
        table.increments('id').primary();  // Combine these two statements
        table.string('storeName').notNullable().unique();
        table.jsonb('address').notNullable();
        table.string('city');
        table.string('state').notNullable();
        table.string('postalCode').notNullable();
        table.specificType('location', 'geometry');
      })
      .createTable("Books", function (table) {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.string('isbn').unique().notNullable();
        table.string('Category').notNullable();
        table.string('author').notNullable();
        table.integer('storeID')
        .notNullable()
        .references('id')
        .inTable('Bookstore')
        .onDelete('SET NULL')  // Set to NULL when the referenced record is deleted
        .onUpdate('CASCADE');
        table.date('publicationDate');
        table.text('description');
        
        table.specificType('revisedYears', 'integer[]');
        table.decimal('price', 10, 2).notNullable();
        table.boolean('isAvailable').defaultTo(true);
        
        table.timestamps(true, true);
      })
      .createTable("Users", function (table) {
        table.increments('id').primary();
        table.string('firstName').notNullable();
        table.string('lastName');
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.jsonb('address').notNullable();
        table.string('contact',10);
        table.specificType('location', 'geometry');
        table.timestamps(true, true);
        
      });
  };
  
  exports.down = function (knex) {
    return knex.schema
      .dropTable('Books')
      .dropTable('Bookstore')
      .dropTable('Users');
  };
  
