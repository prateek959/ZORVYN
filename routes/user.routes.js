import express from 'express';
import { checkRole, checkToken } from '../middleware/auth.middleware.js';
import { getUser, updateUserRole, updateUserStatus } from '../controllers/user.controller.js';

const userRoutes = express.Router();


userRoutes.get('/',checkToken,checkRole("admin"),getUser);
userRoutes.put('/:id',checkToken,checkRole("admin"),updateUserRole);
userRoutes.patch('/:id/status',checkToken,checkRole("admin"),updateUserStatus);


export default userRoutes;