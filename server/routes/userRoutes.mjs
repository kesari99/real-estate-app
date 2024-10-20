import express from 'express';
import { deleteUser, testRoute, updateUser } from '../controllers/userControllers.mjs';
import { verifyToken } from '../utils/verifyUser.mjs';


const router = express.Router()

router.get('/test', testRoute)
router.post('/update/:id',verifyToken, updateUser)
router.delete('/delete/:id',verifyToken, deleteUser)


export default router