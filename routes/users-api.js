/* eslint-disable camelcase */
/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const userQueries = require('../db/queries/users');

router.post('/register', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res
      .status(403)
      .render('error', { message: 'Provide name to register!' });
  }

  const newUser = { name };
  userQueries
    .register(newUser)
    .then(() => {
      res.redirect('/login');
    })
    .catch((err) => {
      res
        .status(500)
        .render('error', { message: `Error registering user: ${err.message}` });
    });
});

router.post('/login', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res
      .status(403)
      .render('error', { message: 'Provide name property to login!' });
  }

  userQueries
    .login(name)
    .then((user) => {
      console.log('user', user);
      if (!user) {
        return res
          .status(403)
          .render('error', { message: 'Invalid credentials!' });
      }

      req.session.user_id = user.id;
      res.redirect('/notes');
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

module.exports = router;
