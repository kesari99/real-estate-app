import express from 'express'
import dotenv from 'dotenv'
import { connectToDb } from './config/dbConnection.mjs'
import userRoutes from './routes/userRoutes.mjs'
import authRoute from './routes/authRoute.mjs'
import listingRoute from './routes/listing-route.mjs'
import cookieParser from 'cookie-parser'
import cors from 'cors'
dotenv.config()

connectToDb()
const port = process.env.PORT || 5001

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({ 
    origin: [
        'http://localhost:5174',
        'https://real-estate-app-1-xphc.onrender.com'
        

    ],
    credentials: true
}));


app.use('/api/user',userRoutes )
app.use('/api/auth',authRoute )
app.use('/api/listing',listingRoute )


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal server Error'

    return res.status(statusCode).json({
        success:false,
        statusCode,
        message

    })
})



app.listen(port, () => {
    console.log('Server is running on port 5001')
})