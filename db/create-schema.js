const db = require('./connection');

async function createSchema() {
  await db.query(`--sql
    drop table if exists comments
    `);

  await db.query(`--sql
    drop table if exists articles
    `);

  await db.query(`--sql
    drop table if exists topics
    `);

  await db.query(`--sql
    drop table if exists users
    `);

  await db.query(`--sql
    create table users (
        username varchar(25) primary key not null,
        name varchar(50) not null,
        avatar_url varchar(1000)
    )`);

  await db.query(`--sql
    create table topics (
        slug varchar(25) primary key,
        description varchar(100) not null,
        img_url varchar(1000)
    )`);

  await db.query(`--sql
    create table articles (
        article_id serial primary key,
        title varchar(100) not null,
        topic  varchar(25)  not null references topics(slug),
        author varchar(25)  not null references users(username),
        body text  not null,
        created_at timestamp default current_timestamp,
        votes int default 0,
        article_img_url varchar(1000)
    )`);

  await db.query(`--sql
    create table comments (
        comment_id serial primary key,
        article_id int not null references articles(article_id),
        body text not null,
        votes int default 0,
        author varchar(25) not null references users(username),
        created_at timestamp default current_timestamp
    )`);
}

module.exports = createSchema;
