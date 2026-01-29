const db = require('./connection');
const createSchema = require('./create_schema');
const data = require(`./seed_data/${process.env.NODE_ENV}/index`);

async function insertUsers(users) {
  const values = [];

  const placeholders = users.map(({ username, name, avatar_url }, idx) => {
    const offset = idx * 3;
    values.push(username, name, avatar_url);
    return `($${offset + 1}, $${offset + 2}, $${offset + 3})`;
  });

  const query = `--sql
    insert into users
        (username, name, avatar_url)
    values
        ${placeholders.join(',')}
  `;

  try {
    const result = await db.query(query, values);
    console.log('Inserted users:', result.rowCount);
  } catch (err) {
    console.error('Error inserting users:', err);
    throw err;
  }
}

async function insertTopics(topics) {
  const values = [];

  const placeholders = topics.map(({ slug, description, img_url }, idx) => {
    const offset = idx * 3;
    values.push(slug, description, img_url);
    return `($${offset + 1}, $${offset + 2}, $${offset + 3})`;
  });

  const query = `--sql
    insert into topics
        (slug, description, img_url)
    values
        ${placeholders.join(',')}
  `;

  try {
    const result = await db.query(query, values);
    console.log('Inserted topics:', result.rowCount);
  } catch (err) {
    console.error('Error inserting topics:', err);
    throw err;
  }
}

async function insertArticles(articles) {
  const values = [];

  const placeholders = articles.map(
    (
      { title, body, topic, author, votes, article_img_url, created_at },
      idx,
    ) => {
      const offset = idx * 7;
      values.push(
        title,
        body,
        topic,
        author,
        votes,
        article_img_url,
        created_at,
      );
      return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4},
        $${offset + 5}, $${offset + 6},  $${offset + 7})`;
    },
  );

  const query = `--sql
    insert into articles
        (title, body, topic, author, votes, article_img_url, created_at)
    values
        ${placeholders.join(',')}
    returning title, article_id
  `;

  try {
    const result = await db.query(query, values);
    console.log('Inserted articles:', result.rowCount);
    return result.rows;
  } catch (err) {
    console.error('Error inserting articles:', err);
    throw err;
  }
}

async function insertComments(comments, articleLookup) {
  const values = [];

  const placeholders = comments.map(
    ({ article_title, body, votes, author, created_at }, idx) => {
      const offset = idx * 5;
      const article_id = articleLookup[article_title];
      values.push(article_id, body, votes, author, created_at);
      return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`;
    },
  );

  const query = `--sql
    insert into comments
        (article_id, body, votes, author, created_at)
    values
        ${placeholders.join(',')}
  `;

  try {
    const result = await db.query(query, values);
    console.log('Inserted comments:', result.rowCount);
  } catch (err) {
    console.error('Error inserting comments:', err);
    throw err;
  }
}

async function seedTables() {
  const { topics, users, articles, comments } = data;
  await insertUsers(users);
  await insertTopics(topics);
  const articleRows = await insertArticles(articles);
  // Create rows into a lookup table
  const articlesLookup = articleRows.reduce((acc, { title, article_id }) => {
    acc[title] = article_id;
    return acc;
  }, {});

  await insertComments(comments, articlesLookup);
}

module.exports = seedTables;
