import { Router } from 'express';
import { adminRouteProtect } from '../utils/validation';
import { getAllUsers } from '../controller/adminController';

const adminRouter = Router();

adminRouter.get('/users', adminRouteProtect, getAllUsers);
