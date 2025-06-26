# 📚 Book Haven — Back End

**Book Haven** is a full-stack e-commerce platform for book lovers. Users can browse, review, and order a curated selection of books. This repository contains the complete **Express + PostgreSQL** backend with user authentication and task tracking.

---

## 🗃️ Database Schema

![Database Schema](schema.png)  
[View in DB Diagram](https://dbdiagram.io/d/68478650579a5a75f7964802)

<details>
<summary>See DBML</summary>

```dbml
table users {
  id serial [pk]
  username text [unique, not null]
  password text [not null]
}

table books {
  id serial [pk]
  title text [not null]
  synopsis text
  price decimal [not null]
  image_url text
}

table reviews {
  id serial [pk]
  rating int [not null]
  content text
  book_id int [not null, ref: > books.id]
  user_id int [not null, ref: > users.id]
}

table orders {
  id serial [pk]
  date date [not null]
  note text
  user_id int [not null, ref: > users.id]
}

table tasks {
  id serial [pk]
  title text [not null]
  done boolean
  user_id int [not null, ref: > users.id]
}

🚀 Getting Started

Create a PostgreSQL database named market

Run npm run db:schema to create tables

Run npm run db:seed to populate the database

Start the server: npm run dev

Use Postman or curl to test the routes

🔐 Authentication

Protected routes require a JWT token. After login or registration, send the token in your request header:

Authorization: Bearer <your_token_here>

🔌 API Endpoints
/users
Method	Route	Access	Description
POST	/register	Public	Register a new user (returns token)
POST	/login	Public	Login user (returns token)
GET	/me	🔒	Get current user’s info and reviews

/books
Method	Route	Access	Description
GET	/	Public	List all books
GET	/:id	Public	Get a single book by ID

/books/:id/reviews
Method	Route	Access	Description
GET	/:id/reviews	🔒	Get reviews for a specific book
POST	/:id/reviews	🔒	Add a review to a specific book

/orders
Method	Route	Access	Description
POST	/	🔒	Create new order
GET	/	🔒	Get all orders from current user
GET	/:id	🔒	Get specific order (403 if not yours)

/tasks
Method	Route	Access	Description
POST	/	🔒	Create a new task
GET	/	🔒	Get all tasks for current user
PUT	/:id	🔒	Update task by ID (if owned)
DELETE	/:id	🔒	Delete task by ID (if owned)

🧪 Seed Contents
The db/seed.js file includes:

✅ 50 books

✅ 1 user

✅ 1 order from a user (with a note)

✅ 3 reviews tied to different books

✅ 2 sample tasks assigned to the user


🧰 Tech Stack

Node.js + Express

PostgreSQL

JWT for Authentication

bcrypt for Password Hashing

dotenv, nodemon, cors

💡 Test endpoints with Postman, curl, or your frontend.
Continue to the frontend repo to explore the client-side integration.
