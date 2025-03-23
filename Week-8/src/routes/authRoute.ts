import express from 'express';
import { loginUser, logoutUser, registerUser } from '../controller/authController';

const authRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User authentication and session management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass123!"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "65f3b9c2e3d1c5a1c3f9b0a7"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     username:
 *                       type: string
 *                       example: "john_doe"
 *       400:
 *         description: Bad request (Invalid input or missing fields)
 */
authRouter.post('/auth/register', registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user and sets a JWT token in an HTTP-only cookie.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass123!"
 *     responses:
 *       200:
 *         description: Login successful (JWT token is stored in an HTTP-only cookie)
 *         headers:
 *           Set-Cookie:
 *             description: The JWT token is stored in a secure, HTTP-only cookie
 *             schema:
 *               type: string
 *               example: "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *       401:
 *         description: Unauthorized (Invalid credentials)
 *       400:
 *         description: Bad request (Missing fields)
 */
authRouter.post('/auth/login', loginUser);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     description: Clears the authentication cookie and logs out the user.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully (JWT cookie is cleared)
 *         headers:
 *           Set-Cookie:
 *             description: Clears the authentication cookie by setting an expired date
 *             schema:
 *               type: string
 *               example: "token=; HttpOnly; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 */
authRouter.post('/auth/logout', logoutUser);

export { authRouter };
