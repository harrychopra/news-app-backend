const db = require('../db/connection');
const seedTables = require('../db/seed_tables');
const createSchema = require('../db/create_schema');

beforeAll(async () => {
  await createSchema();
});

afterAll(() => db.end());

test('test', () => {
  expect(true).toBe(true);
});
