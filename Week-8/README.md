# Week 6 - CATNodeJS API

## Overview

This repository contains the backend API implementation for the Week 6 project of the CATNodeJS course. The project is built using Node.js and focuses on creating RESTful APIs.

## Features

- RESTful API endpoints
- CRUD operations
- Middleware integration
- Error handling
- Modular code structure

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/IEEE-Backend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd API/CATNodeJS/Week-6
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
PORT=3000
DB_URI=your_database_connection_string
JWT_SECRET=your_jwt_secret
```

## Supported Endpoints

### User Routes

- `POST /api/users/register` - Register a new user.
- `POST /api/users/login` - Authenticate a user and return a token.
- `GET /api/users/profile` - Get the profile of the authenticated user.

### Product Routes

- `GET /api/products` - Retrieve a list of all products.
- `GET /api/products/:id` - Retrieve details of a specific product.
- `POST /api/products` - Create a new product (Admin only).
- `PUT /api/products/:id` - Update an existing product (Admin only).
- `DELETE /api/products/:id` - Delete a product (Admin only).

### Order Routes

- `POST /api/orders` - Create a new order.
- `GET /api/orders/:id` - Retrieve details of a specific order.
- `GET /api/orders` - Retrieve all orders for the authenticated user.

## Scripts

- `npm start`: Starts the server.
- `npm run dev`: Starts the server in development mode with hot-reloading.
- `npm test`: Runs the test suite.

## Folder Structure

```
Week-6/
├── controllers/   # API controllers
├── models/        # Database models
├── routes/        # API routes
├── middlewares/   # Custom middleware
├── utils/         # Utility functions
├── tests/         # Test cases
└── README.md      # Project documentation
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
