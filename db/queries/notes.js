/* eslint-disable camelcase */
const db = require('../connection');

// CRUD - Create, Read, Update, Delete
const create = (newNote) => {
  const { user_id, content } = newNote;
  return db
    .query(
      'INSERT INTO notes (user_id, content) VALUES ($1, $2) RETURNING *;',
      [user_id, content]
    )
    .then((data) => data.rows[0]);
};

const getAll = () => {
  return db.query('SELECT * FROM notes;').then((data) => data.rows);
};

const getById = (id) => {
  return db
    .query('SELECT * FROM notes WHERE id = $1;', [id])
    .then((data) => data.rows[0]);
};

const getByUserId = (user_id) => {
  return db
    .query('SELECT * FROM notes WHERE user_id = $1;', [user_id])
    .then((data) => data.rows);
};

const update = (updatedNote) => {
  const { id, content } = updatedNote;
  return db
    .query('UPDATE notes SET content = $1 WHERE id = $2 RETURNING *;', [
      content,
      id,
    ])
    .then((data) => data.rows[0]);
};

const remove = (id) => {
  return db
    .query('DELETE FROM notes WHERE id = $1;', [id])
    .then((data) => data.rows);
};

module.exports = { create, getAll, getById, getByUserId, update, remove };
