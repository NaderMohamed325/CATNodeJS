import { Router } from 'express';
import { adminAuth } from '../utils/middlewares/adminAuth';
import { adminCreateProduct } from '../controller/adminController';

const productRouter = Router();

productRouter.post('/products', adminAuth, adminCreateProduct);


export {productRouter}