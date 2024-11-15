import express from 'express';
import { deleteUser, testRoute, updateUser,getUserListings, getUser} from '../controllers/userControllers.mjs';
import { verifyToken } from '../utils/verifyUser.mjs';



const router = express.Router()

router.get('/test', testRoute)
router.post('/update/:id',verifyToken, updateUser)
router.delete('/delete/:id',verifyToken, deleteUser)
router.get('/listings/:id', verifyToken, getUserListings)
router.get('/:id', verifyToken, getUser)


export default router