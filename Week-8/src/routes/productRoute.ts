import { Router } from 'express';
import { adminAuth } from '../utils/middlewares/adminAuth';
import { adminCreateProduct } from '../controller/adminController';
import { authenticate } from '../utils/middlewares/userAuth';
import { getAllProducts, getOneProduct } from '../controller/productController';

const productRouter = Router();

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     description: Allows an admin to create a new product.
 *     tags: [Products]
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
 *                 example: "New Product"
 *               price:
 *                 type: number
 *                 example: 49.99
 *               description:
 *                 type: string
 *                 example: "Description of the new product"
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               message: "Product created successfully"
 *       400:
 *         description: Invalid request body
 *       403:
 *         description: Forbidden - Admin privileges required
 *       500:
 *         description: Internal server error
 */
productRouter.post('/products', adminAuth, adminCreateProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all products.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of products
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
 *                     example: "Product Name"
 *                   price:
 *                     type: number
 *                     example: 49.99
 *                   description:
 *                     type: string
 *                     example: "Product description"
 *       500:
 *         description: Internal server error
 */
productRouter.get('/products', authenticate, getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     description: Retrieve details of a specific product by its ID.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *                 name:
 *                   type: string
 *                   example: "Product Name"
 *                 price:
 *                   type: number
 *                   example: 49.99
 *                 description:
 *                   type: string
 *                   example: "Product description"
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
productRouter.get('/products/:id', authenticate, getOneProduct);

export { productRouter };