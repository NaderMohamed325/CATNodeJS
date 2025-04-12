import { Router } from 'express';
import { adminAuth } from '../utils/middlewares/adminAuth';
import { adminCreateProduct } from '../controller/adminController';
import { authenticate } from '../utils/validation';
import { getAllProducts } from '../controller/productController';

const productRouter = Router();

productRouter.post('/products', adminAuth, adminCreateProduct);
productRouter.get('/products', authenticate, getAllProducts);

export { productRouter };
