# Market Back End

Market is a versatile and robust e-commerce platform that allows users to browse and purchase a wide selection of products.

## Database

![](schema.png)

[View in DB Diagram](https://dbdiagram.io/d/68478650579a5a75f7964802)

<details>
<summary>See DBML</summary>

```dbml
table users {
  id serial [pk]
  username text [unique, not null]
  password text [not null]
}

table orders {
  id serial [pk]
  date date [not null]
  note text
  user_id int [not null]
}

table products {
  id serial [pk]
  title text [not null]
  description text [not null]
  price decimal [not null]
}

table reviews {
  id serial [pk]
  rating int [not null]
  comment text
  product_id int [not null]
}

// Relationships
Ref: users.id < orders.user_id [delete: cascade]
Ref: products.id < reviews.product_id [delete: cascade]


```

</details>

Rather than associating products directly with orders, we store product and quantity details inside the note field of each order (e.g., "2 Bananas, 1 Chocolate Bar"). This keeps the schema simple and avoids the need for a junction table.

1. Create a new Postgres database named `market`.
2. Create tables in `schema.sql` according to the schema above.
3. Seed the database with:
 - At least 10 different products
 - At least 1 user
 - At least 1 order from that user, with the product names and quantities written into the note field (e.g., "2 Bananas, 1 Chocolate Bar")
 - At least 3 reviews connected to different products

## API

Once your database is properly seeded, build an Express app that serves the following routes.

The 🔒 lock icon next to a route indicates that it must be a protected route.
A user can only access that route by attaching a valid token to their request.
If a valid token is not provided, immediately send a 401 Unauthorized error.

`/users` router

- `POST /users/register`
  - sends 400 if request body is missing username or password
  - creates a new user with the provided credentials and sends a token
  - the password should be hashed in the database
- `POST /users/login`
  - sends 400 if request body is missing username or password
  - sends a token if the provided credentials are valid
- `🔒 GET /users/me`
  - Returns the currently logged-in user's data
  - Requires a valid token

`/products` router

- `GET /products` sends array of all products
- `GET /products/:id`
  - sends 404 if the product with that id does not exist
  - sends the specific product
- `🔒 GET /products/:id/reviews`
  - sends 404 if the product with that id does not exist
  - returns reviews for the product
- `🔒 POST /products/:id/reviews` 
  - sends 404 if the product with that id does not exist
  - creates a review for the product


`/orders` router

- `🔒 POST /orders`
  - sends 400 if request body does not include a `date`
  - creates a new order by the logged-in user and sends it with status 201
- `🔒 GET /orders` 
  - sends array of all orders made by the logged-in user
- `🔒 GET /orders/:id`
  - sends 404 if the order does not exist
  - sends 403 if the logged-in user is not the user who made the order
  - sends the order with the specified id

## 🌟 Back End Stretch Goal: Add `orders_products` Table

Once you're comfortable with the base functionality, upgrade your schema to support multiple products per order, and allow the same product to appear in many orders.

## Updated Database

![](stretchSchema.png)

[View in DB Diagram](https://dbdiagram.io/d/68488f0a4aa7226ff84c2a1b)

<details>
<summary>See DBML</summary>

```dbml


table orders_products {
  order_id int [not null]
  product_id int [not null]
  quantity int [not null]

  indexes {
    (order_id, product_id) [pk]
  }
}

// New relationships
Ref: orders.id < orders_products.order_id [delete: cascade]
Ref: products.id < orders_products.product_id [delete: cascade]

```

</details>


## Updated Seeding
Do not store product info in the note field anymore

Instead, create records in the orders_products table to track which products were purchased and in what quantity

## Additional Routes
Update your /orders router with:

- `🔒 GET /orders/:id/products`
  - Sends 404 if the order does not exist
  - Sends 403 if the logged-in user does not own the order
  - Sends an array of products included in the order, with quantity

- `🔒 POST /orders/:id/products`
  - Sends 404 if the order does not exist
  - Sends 403 if the logged-in user does not own the order
  - Sends 400 if productId or quantity is missing or invalid
  - Adds the specified product to the order and returns the new record with status 201
