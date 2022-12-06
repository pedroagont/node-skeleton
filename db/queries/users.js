const db = require('../connection');

const register = (newUser) => {
  const { name } = newUser;
  return db
    .query('INSERT INTO users (name) VALUES ($1) RETURNING *;', [name])
    .then((data) => data.rows[0]);
};

const login = (name) => {
  return db
    .query('SELECT * FROM users WHERE name = $1;', [name])
    .then((data) => data.rows[0]);
};

module.exports = { register, login };
