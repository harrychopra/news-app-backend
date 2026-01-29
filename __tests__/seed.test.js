const db = require('../db/connection');
const seedTables = require('../db/insert-data');
const createSchema = require('../db/create-schema');

beforeAll(async () => {
  await createSchema();
  await seedTables();
});

afterAll(() => db.end());

test('test', () => {
  expect(true).toBe(true);
});
