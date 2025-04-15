// routes/adminRoutes.ts
import { Router } from 'express';
import {
  adminCreateCategory,
  getAllCategories,
  adminDeleteCategory,
} from '../controller/categoryController';
import { adminAuth } from '../utils/middlewares/adminAuth';
import { authenticate } from '../utils/middlewares/userAuth';

const categoryRouter = Router();
/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category (Admin only)
 *     description: Allows an admin to create a new category.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the category
 *                 example: "Electronics"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Category created successfully
 *                 data:
 *                   type: object
 *                   description: The created category
 *       400:
 *         description: Invalid request body
 *       403:
 *         description: Forbidden - Admin privileges required
 *       500:
 *         description: Internal server error
 */
categoryRouter.post('/categories', adminAuth, adminCreateCategory);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     description: Allows an admin to retrieve a list of all categories.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of categories
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
 *                     example: "Electronics"
 *       403:
 *         description: Forbidden - user privileges required
 *       500:
 *         description: Internal server error
 */
categoryRouter.get('/categories', authenticate, getAllCategories);
/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category by ID (Admin only)
 *     description: Allows an admin to delete a category by providing its ID.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Category deleted successfully
 *       403:
 *         description: Forbidden - Admin privileges required
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */

categoryRouter.delete('/categories/:id', adminAuth, adminDeleteCategory);

export { categoryRouter };
