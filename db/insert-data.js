const db = require('./connection');
const data = require(`./${process.env.NODE_ENV}/seed-data/index`);

async function insert(tableName, rows) {
  if (rows.length === 0) return [];

  const columns = Object.keys(rows[0]);
  const values = [];

  const placeholders = rows
    .map((row, rowIdx) => {
      const offset = rowIdx * columns.length;
      columns.forEach(column => values.push(row[column]));

      const rowPlaceholders = columns
        .map((_, colIdx) => `$${offset + colIdx + 1}`)
        .join(',');

      return `(${rowPlaceholders})`;
    })
    .join(', ');

  const query = `--sql
    insert into ${tableName} (${columns.join(', ')})
    values ${placeholders}
    returning *`;

  try {
    const result = await db.query(query, values);
    console.log(`Inserted ${result.rowCount} row(s) into ${tableName}`);
    return result.rows;
  } catch (err) {
    console.error(`Error inserting into ${tableName}:`, err.message);
    throw err;
  }
}

async function seedTables() {
  const { topics, users, articles, comments } = data;

  await insert('users', users);
  await insert('topics', topics);

  const insertedArticles = await insert('articles', articles);

  // lookup table with title and article_id
  const articlesIdByTitle = insertedArticles.reduce(
    (lookup, { title, article_id }) => {
      lookup[title] = article_id;
      return lookup;
    },
    {},
  );

  const commentsWithArticleId = comments.map(comment => {
    return {
      article_id: articlesIdByTitle[comment.article_title],
      body: comment.body,
      votes: comment.votes,
      author: comment.author,
      created_at: comment.created_at,
    };
  });

  await insert('comments', commentsWithArticleId);
}

module.exports = seedTables;
