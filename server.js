// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));
app.use(
  cookieSession({
    name: 'session',
    keys: ['myRandomSuperSecretKey', 'anotherRandomString'],

    // Cookie Options
    // maxAge: 24 * 60 * 60 * 1000 // 24 hours
    maxAge: 10 * 60 * 1000, // 10 min
  })
);

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersApiRoutes = require('./routes/users-api');
const notesApiRoutes = require('./routes/notes-api');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', usersApiRoutes);
app.use('/api/notes', notesApiRoutes);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/register', (req, res) => {
  const { user_id } = req.session;
  if (user_id) {
    const templateVars = { message: 'User is already logged in' };
    return res.status(401).render('error', templateVars);
  }

  res.render('register');
});

app.get('/login', (req, res) => {
  const { user_id } = req.session;
  if (user_id) {
    const templateVars = { message: 'User is already logged in' };
    return res.status(401).render('error', templateVars);
  }

  res.render('login');
});

app.get('/notes', (req, res) => {
  const { user_id } = req.session;
  if (!user_id) {
    const templateVars = { message: 'User is not logged in' };
    return res.status(401).render('error', templateVars);
  }

  const templateVars = { user_id };
  res.render('notes', templateVars);
});

// Catch all route
app.use((req, res) => {
  res.status(404).send({ message: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
