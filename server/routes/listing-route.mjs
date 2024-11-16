import express from 'express'
import { createListing, deleteUserListing, getListing, updateUserListing, getAllListings } from '../controllers/listingController.mjs'
import { verifyToken } from '../utils/verifyUser.mjs'

const router = express.Router()

router.post('/create',verifyToken, createListing)
router.delete('/delete/:id', verifyToken, deleteUserListing)
router.post('/update/:id', verifyToken, updateUserListing)
router.get('/getlisting/:id', getListing)
router.get('/get', getAllListings)



export default router