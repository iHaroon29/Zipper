import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import router from './route_handler/routes.js'

const app = express()
const whitelist = ['http://127.0.0.1:5500', 'http://localhost:3000']
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true)
    }
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['*', 'Authorization'],
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(cookieParser())
app.use(morgan('tiny'))

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error(err)
    return res.status(400).send({ status: 404, message: err.message }) // Bad request
  }
  next()
})

app.use(router)
app.use('/home', express.static('./index.html'))

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message })
})

app.route('*').get((req, res, next) => {
  res.status(404).send({ message: 'Invalid End-Point' })
})

export default app
