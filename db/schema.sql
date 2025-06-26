-- Drop all tables to reset
DROP TABLE IF EXISTS order_books CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS books CASCADE;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- Books table
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  synopsis TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  date DATE NOT NULL,
  note TEXT
);

-- Reviews table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5)
);

-- Tasks table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  done BOOLEAN DEFAULT false
);

-- Order_Books join table
CREATE TABLE order_books (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  book_id INTEGER REFERENCES books(id),
  quantity INTEGER NOT NULL DEFAULT 1
);