const createSchema = require('./create-schema');
const seedTables = require('./insert-data');

async function seed() {
  await createSchema();
  await seedTables();
}

seed();
