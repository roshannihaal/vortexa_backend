import { server, io } from './app'
import { config } from './config'

const port = config.PORT
const node_env = config.NODE_ENV

server.listen(port, () => {
  console.log(`App (${node_env}) listening at http://localhost:${port}`)
})

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})
