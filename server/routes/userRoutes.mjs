import express from 'express';
import { testRoute } from '../controllers/userControllers.mjs';


const router = express.Router()

router.get('/test', testRoute)

export default router