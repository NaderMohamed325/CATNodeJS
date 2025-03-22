import { Router } from 'express';

import { adminLogin, getAllUsers } from '../controller/adminController';

const adminRouter = Router();

adminRouter.post('/auth/admin/login', adminLogin);

export { adminRouter };
