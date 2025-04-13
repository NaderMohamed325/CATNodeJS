import { Router } from 'express';
import { authenticate } from '../utils/middlewares/userAuth';
import {
  cartAddItem,
  cartClear,
  cartDeleteItem,
  cartUpdateQuantity,
  getUserCart,
} from '../controller/cartController';

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Operations related to the user's shopping cart
 */

const cartRouter = Router();

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get the current user's cart
 *     description: Returns the current user's cart with items and total price.
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     userCart:
 *                       type: object
 *                       description: The user's cart data
 *                       example:
 *                         user: "5f9f1b9b9b9b9b9b9b9b9b9b"
 *                         items: [{ product: "5f9f1b9b9b9b9b9b9b9b9b9b", quantity: 2, price: 19.99 }]
 *                         cart_price: 39.98
 *       401:
 *         description: Unauthorized (invalid token)
 *       404:
 *         description: Cart not found
 */

cartRouter.get('/cart', authenticate, getUserCart);

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add an item to the user's cart
 *     description: Adds an item (with product id and quantity) to the user's cart.
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item_id:
 *                 type: string
 *                 description: The product's ID to be added to the cart
 *                 example: "5f9f1b9b9b9b9b9b9b9b9b9b"
 *               quantity:
 *                 type: number
 *                 description: The quantity of the item to add
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item successfully added to the cart
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
 *                   example: Item added to cart
 *                 data:
 *                   type: object
 *                   properties:
 *                     userCart:
 *                       type: object
 *                       description: The updated cart data
 *       400:
 *         description: Invalid data (e.g., missing item_id or quantity <= 0)
 *       401:
 *         description: Unauthorized (invalid token)
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

cartRouter.post('/cart', authenticate, cartAddItem);
/**
 * @swagger
 * /cart/{id}:
 *   put:
 *     summary: Update the quantity of an item in the cart
 *     description: Updates the quantity of a specific item in the user's cart.
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cart item to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: The new quantity for the item
 *                 example: 3
 *     responses:
 *       200:
 *         description: Successfully updated the item quantity
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
 *                   example: Item quantity updated
 *                 data:
 *                   type: object
 *                   description: The updated cart data
 *       400:
 *         description: Invalid data (e.g., quantity <= 0)
 *       401:
 *         description: Unauthorized (invalid token)
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */
cartRouter.put('/cart/:id', authenticate, cartUpdateQuantity);
/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: Remove an item from the cart
 *     description: Deletes a specific item from the user's cart.
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cart item to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully removed the item from the cart
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
 *                   example: Item removed from cart
 *                 data:
 *                   type: object
 *                   description: The updated cart data
 *       401:
 *         description: Unauthorized (invalid token)
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */

cartRouter.delete('/cart/:id', authenticate, cartDeleteItem);

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear all items from the cart
 *     description: Removes all items from the user's cart and resets the total price to zero.
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully cleared the cart
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
 *                   example: Cart has been cleared
 *                 data:
 *                   type: object
 *                   description: The updated cart data
 *       401:
 *         description: Unauthorized (invalid token)
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */

cartRouter.delete('/cart/clear', authenticate, cartClear);

export { cartRouter };
