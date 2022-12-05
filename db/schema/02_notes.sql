-- Drop and recreate notes table (Example)

DROP TABLE IF EXISTS notes CASCADE;
CREATE TABLE notes (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id),
  content VARCHAR(255) NOT NULL
);
