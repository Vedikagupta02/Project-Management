import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()
app.use(cookieParser())

//basic configurations
app.use(express.json({limit: '16mb'}))
app.use(express.urlencoded({limit: '16mb', extended: true}))
app.use(express.static('public'))

//cors configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

//import the routes
import healthcheckRoutes from './routes/healthcheck.routes.js'
app.use('/api/v1/healthcheck', healthcheckRoutes)

import authRouter from './routes/auth.routes.js'
app.use('/api/v1/auth', authRouter)
app.get('/', (req, res) => {
  res.send('Hello World')
})

export default app