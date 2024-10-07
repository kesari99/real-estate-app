import express from 'express';
import { testRoute, updateUser } from '../controllers/userControllers.mjs';
import { verifyToken } from '../utils/verifyUser.mjs';


const router = express.Router()

router.get('/test', testRoute)
router.post('/update/:id',verifyToken, updateUser)

export default router