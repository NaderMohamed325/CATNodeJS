import express from 'express';
import { authenticate } from '../utils/middlewares/userAuth';
import { getUserProfile, updateUserProfile } from '../controller/userController';

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile management
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve the profile of the authenticated user
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "67d942ac573f5f2c47891f0b"
 *                 username:
 *                   type: string
 *                   example: "hamed Moh"
 *                 email:
 *                   type: string
 *                   example: "hamed30@gmail.com"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
userRouter.get('/users/profile', authenticate, getUserProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Update the profile of the authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "hamed Moh"
 *               email:
 *                 type: string
 *                 example: "hamed30@gmail.com"
 *               password:
 *                 type: string
 *                 example: "newsecurepassword123"
 *     responses:
 *       200:
 *         description: Successfully updated user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsIn..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "67d942ac573f5f2c47891f0b"
 *                     username:
 *                       type: string
 *                       example: "hamed Moh"
 *                     email:
 *                       type: string
 *                       example: "hamed30@gmail.com"
 *       400:
 *         description: Bad request (missing or invalid fields)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: User not found
 */
userRouter.put('/users/profile', authenticate, updateUserProfile);
export { userRouter };
