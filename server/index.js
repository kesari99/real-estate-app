import express from 'express'
import dotenv from 'dotenv'
import { connectToDb } from './config/dbConnection.mjs'
import userRoutes from './routes/userRoutes.mjs'
import authRoute from './routes/authRoute.mjs'
import listingRoute from './routes/listing-route.mjs'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path';
dotenv.config()


const __dirname = path.resolve();

connectToDb()
const port = process.env.PORT || 5001

const app = express()
app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [
    'http://localhost:5173', 
    'https://kesari-real-estate-app-frontend.onrender.com'
  ];

app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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