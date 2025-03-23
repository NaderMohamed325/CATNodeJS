import { Router } from 'express';
import { adminDeleteUser, adminLogin, getAllUsers } from '../controller/adminController';
import { adminAuth } from '../utils/middlewares/adminAuth';

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
/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Retrieve a list of all users
 *     description: Fetches all users from the database. Only accessible by admins.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "60d0fe4f5311236168a109ca"
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   email:
 *                     type: string
 *                     example: "johndoe@example.com"
 *
 *       401:
 *         description: Unauthorized - Admin token is missing or invalid
 *       403:
 *         description: Forbidden - User does not have admin privileges
 *       500:
 *         description: Internal Server Error
 */
adminRouter.get('/users', adminAuth, getAllUsers);
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID (Admin only)
 *     description: Admins can delete users, but only if the user has the "user" role.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               message: "User 67dfd91e2a4f30630ab96175 has been deleted successfully"
 *       400:
 *         description: Missing user ID
 *         content:
 *           application/json:
 *             example:
 *               status: "fail"
 *               message: "Missing user ID"
 *       403:
 *         description: Forbidden - User is not allowed to be deleted
 *         content:
 *           application/json:
 *             example:
 *               status: "fail"
 *               message: "You can only delete users with the 'user' role"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               status: "fail"
 *               message: "User not found"
 *       500:
 *         description: Server error
 */

adminRouter.delete('/users/:id', adminAuth, adminDeleteUser);
export { adminRouter };
