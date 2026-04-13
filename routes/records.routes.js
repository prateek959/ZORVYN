import express from 'express';
import {checkRole, checkToken} from '../middleware/auth.middleware.js';
import { createFinancial, deleteRecords, getRecords, updateRecords } from '../controllers/finance.controller.js';
import Filter from "../controllers/features.controller.js"

const RecordRoutes = express.Router();

RecordRoutes.post('/',checkToken, checkRole("admin", "analyst"),createFinancial);
RecordRoutes.get('/',checkToken, checkRole("analyst", "admin"), getRecords);
RecordRoutes.get('/filter',checkToken,checkRole("analyst", "admin"),Filter);
RecordRoutes.put('/:recordID',checkToken, checkRole("analyst", "admin"), updateRecords);
RecordRoutes.delete('/:recordID',checkToken, checkRole("admin"), deleteRecords);


export default RecordRoutes;