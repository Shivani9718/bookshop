exports.up = function (knex) {
    return knex.schema
      .createTable('bookstore', function (table) {
        table.increments('store_id').primary();  // Combine these two statements
        table.string('store').notNullable().unique();
        table.string('address').notNullable();
        table.string('city').notNullable();
        table.string('state').notNullable();
        table.string('postal_code').notNullable();
        table.string('location');
      })
      .createTable('books', function (table) {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.string('isbn').unique().notNullable();
        table.date('publication_date');
        table.string('author').notNullable();
        table.string('Store').notNullable()
          .references('store')
          .inTable('bookstore')
          .onDelete('CASCADE')
          .onUpdate('CASCADE');
        table.text('description');
        table.integer('quantity').notNullable();
        table.string('Category').notNullable();
        table.decimal('price', 10, 2);
        table.boolean('is_available').defaultTo(true);
      })
      .createTable('users', function (table) {
        table.increments('id').primary();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('username').notNullable().unique();
        table.string('password').notNullable();
        table.string('email').notNullable().unique();
        table.timestamps(true, true);
        
      });
  };
  
  exports.down = function (knex) {
    return knex.schema
      .dropTable('books')
      .dropTable('bookstore')
      .dropTable('users');
  };
  
