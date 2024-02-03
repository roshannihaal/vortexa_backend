import express from 'express'
import path from 'path'
import cors from 'cors'
import helmet from 'helmet'
import hpp from 'hpp'
import { notFound, errorHandler } from './middlewares'
import { connectToRedis, generateRSAKeys } from './utils'
import { apiRouter } from './api'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.use(cors())
app.use(helmet())
app.use(hpp())

app.disable('x-powered-by')

try {
  generateRSAKeys()
  connectToRedis()
} catch (error) {
  console.error(`Seriver initialization error: ${error}`)
  process.exit(1)
}

app.get('/', (req, res) => {
  const resStatusCode = 200
  return res
    .status(resStatusCode)
    .send({ statusCode: resStatusCode, message: 'Hello World!' })
})

app.use('/api', apiRouter)
app.use(notFound)
app.use(errorHandler)

export { server, io }
