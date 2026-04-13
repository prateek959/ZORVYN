import express from 'express';
import { checkRole, checkToken } from '../middleware/auth.middleware.js';
import getAnalytics from '../controllers/analytics.controller.js';

const dashboardRoutes = express.Router();

dashboardRoutes.get('/',checkToken,checkRole("admin", "analyst", "viewer"), getAnalytics);

export default dashboardRoutes;