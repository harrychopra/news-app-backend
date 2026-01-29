const db = require('./db/connection');

async function run() {
  try {
    // Get all of the users
    let result = await db.query(`select username, name, avatar_url from users`);
    console.log('ALL USERS:\n', result.rows);

    // Get all of the articles where the topic is coding
    result = await db.query(
      `select title, author, votes from articles where topic = 'coding'`,
    );
    console.log('ARTICLES WITH TOPIC: CODING\n', result.rows);

    // Get all of the comments where the votes are less than zero
    result = await db.query(
      `select a.title, c.body, c.votes from comments as c join articles as a
        on a.article_id = c.article_id where c.votes < 0 order by a.article_id, c.votes`,
    );
    console.log('COMMENTS WITH VOTES LESS THAN ZERO:\n', result.rows);

    // Get all of the topics
    result = await db.query(`select description, slug from topics`);
    console.log('ALL TOPICS:\n', result.rows);

    // Get all of the articles by user grumpy19
    result = await db.query(
      `select title, votes from articles where author = 'grumpy19'`,
    );
    console.log('ARTICLES WITH USER: grumpy19\n', result.rows);

    // Get all of the comments that have more than 10 votes.
    result = await db.query(
      `select a.title, c.body, c.votes from comments as c join articles as a
      on c.article_id = a.article_id where c.votes > 10 order by c.votes desc`,
    );
    console.log('COMMENTS WITH MORE THAN 10 VOTES:\n', result.rows);
  } catch (err) {
    console.error('Error running queries:', err.message);
    throw err;
  } finally {
    db.end();
  }
}

run();
