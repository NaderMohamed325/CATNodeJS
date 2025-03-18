Authentication & Users
POST /auth/register – Register a new user
POST /auth/login – Login a user
POST /auth/logout – Logout a user
GET /users/profile – Get user profile
PUT /users/profile – Update user profile
GET /users – Get all users (admin only)
DELETE /users/{id} – Delete a user (admin only)


Products
GET /products – Get all products
GET /products/{id} – Get a single product
POST /products – Create a new product (admin only)
PUT /products/{id} – Update a product (admin only)
DELETE /products/{id} – Delete a product (admin only)

Categories
GET /categories – Get all categories
POST /categories – Create a new category (admin only)
PUT /categories/{id} – Update a category (admin only)
DELETE /categories/{id} – Delete a category (admin only)


Cart
GET /cart – Get user cart
POST /cart – Add item to cart
PUT /cart/{id} – Update cart item quantity
DELETE /cart/{id} – Remove item from cart
DELETE /cart/clear – Clear all items from cart


Orders
POST /orders – Place an order
GET /orders – Get user orders
GET /orders/{id} – Get a single order
PUT /orders/{id} – Update order status (admin only)
DELETE /orders/{id} – Cancel order


Reviews & Ratings
POST /products/{id}/reviews – Add a review
GET /products/{id}/reviews – Get product reviews
DELETE /reviews/{id} – Delete a review (admin/user)


Admin Dashboard (Optional)
GET /admin/dashboard – Get sales & user statistics
GET /admin/orders – Get all orders
GET /admin/products – Get all products


## Status Codes

- **200 OK** – The request was successful.
- **201 Created** – The resource was successfully created.
- **204 No Content** – The request was successful but there is no content to send in the response.
- **400 Bad Request** – The server could not understand the request due to invalid syntax.
- **401 Unauthorized** – The client must authenticate itself to get the requested response.
- **403 Forbidden** – The client does not have access rights to the content.
- **404 Not Found** – The server can not find the requested resource.
- **500 Internal Server Error** – The server has encountered a situation it doesn't know how to handle.
- **502 Bad Gateway** – The server, while acting as a gateway or proxy, received an invalid response from the upstream server.
- **503 Service Unavailable** – The server is not ready to handle the request.