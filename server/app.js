const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http')

app.use(cors())

const server = http.createServer(app)
const {Server} = require('socket.io')

const io = new Server(server, {
  cors: {
    origin: `http://localhost:3000` // Replace with the allowed domain
  }
})

// server PORT
const PORT = 8080

io.on('connection', (socket) => {
  console.log('A client connected')

  socket.on('loginRequest', (data) => {
    console.log('Logged in Successful.')

    socket.join(data.room)
    
    socket.emit('getAuth', {
      success: true,
      data: {
        id: socket.id,
        username: data.username,
        room: data.room
      }
    })

    console.log({
      id: socket.id,
      username: data.room,
      room: data.room
    })
  })

  socket.on('sendMessage', (data) => {
    if (data) {
      socket.to(data.room).emit('receiveMessage', data)
    }
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})