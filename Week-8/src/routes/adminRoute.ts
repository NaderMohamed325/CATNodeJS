import { Router } from 'express';
import { adminLogin, getAllUsers } from '../controller/adminController';

const adminRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin authentication and user management
 */

/**
 * @swagger
 * /auth/admin/login:
 *   post:
 *     summary: Admin login
 *     description: Authenticate an admin user and return a JWT token.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 example: "admin123"
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   example: "jwt_token_here"
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Incorrect email or password
 *       403:
 *         description: User does not have admin privileges
 */
adminRouter.post('/auth/admin/login', adminLogin);

export { adminRouter };
