# E-Commerce API Documentation

## Authentication & Users

- **POST /auth/register** – Register a new user
- **POST /auth/login** – Log in a user
- **POST /auth/logout** – Log out a user
- **GET /users/profile** – Get user profile
- **PUT /users/profile** – Update user profile
- **GET /users** – Get all users (Admin only)
- **DELETE /users/{id}** – Delete a user (Admin only)

## Products

- **GET /products** – Get all products
- **GET /products/{id}** – Get a single product
- **POST /products** – Create a new product (Admin only)
- **PUT /products/{id}** – Update a product (Admin only)
- **DELETE /products/{id}** – Delete a product (Admin only)

## Categories

- **GET /categories** – Get all categories
- **POST /categories** – Create a new category (Admin only)
- **PUT /categories/{id}** – Update a category (Admin only)
- **DELETE /categories/{id}** – Delete a category (Admin only)

## Cart

- **GET /cart** – Get user cart
- **POST /cart** – Add an item to cart
- **PUT /cart/{id}** – Update cart item quantity
- **DELETE /cart/{id}** – Remove an item from cart
- **DELETE /cart/clear** – Clear all items from cart

## Orders

- **POST /orders** – Place an order
- **GET /orders** – Get user orders
- **GET /orders/{id}** – Get a single order
- **PUT /orders/{id}** – Update order status (Admin only)
- **DELETE /orders/{id}** – Cancel an order

## Reviews & Ratings

- **POST /products/{id}/reviews** – Add a review
- **GET /products/{id}/reviews** – Get product reviews
- **DELETE /reviews/{id}** – Delete a review (Admin or User)

## Admin Dashboard (Optional)

- **GET /admin/dashboard** – Get sales & user statistics
- **GET /admin/orders** – Get all orders
- **GET /admin/products** – Get all products

---

## Status Codes

- **200 OK** – Request successful
- **201 Created** – Resource created successfully
- **204 No Content** – Request successful, no response body
- **400 Bad Request** – Invalid input
- **401 Unauthorized** – Authentication required
- **403 Forbidden** – User lacks permission
- **404 Not Found** – Resource not found
- **409 Conflict** – Conflict with existing data
- **500 Internal Server Error** – Server encountered an error

---

## Notes

- Endpoints marked as **(Admin only)** require admin privileges.
- Users must be **authenticated** to perform certain actions (e.g., accessing their cart, placing orders, or updating profiles).
- Proper **error handling** is implemented for all API endpoints.
