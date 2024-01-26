import express from 'express'
import path from 'path'
import cors from 'cors'
import helmet from 'helmet'
import hpp from 'hpp'
import { notFound } from './middlewares'
import { generateRSAKeys } from './utils'
import { apiRouter } from './api'
const app = express()
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

app.use(cors())
app.use(helmet())
app.use(hpp())

app.disable('x-powered-by')

try {
  generateRSAKeys()
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

export default app
