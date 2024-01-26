import express from 'express'
import path from 'path'
import cors from 'cors'
import helmet from 'helmet'
import hpp from 'hpp'

const app = express()
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

app.use(cors())
app.use(helmet())
app.use(hpp())

app.disable('x-powered-by')

app.get('/', (req, res) => {
  const resStatusCode = 200
  return res
    .status(resStatusCode)
    .send({ statusCode: resStatusCode, message: 'Hello World!' })
})

export default app
