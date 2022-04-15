const express = require('express')
const http = require('http');
const app = express()
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var dummyData = require("./dummyData.json")


const port = 3000

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/templates/index.html')
})

app.get('/selectCelebs', (req, res) => {
  res.sendFile(__dirname + '/templates/selectCelebs.html')
})

app.get("/celebData", (req, res) =>{
  keys = Object.keys(dummyData)

  res.json(Object.keys(dummyData))
})

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(port, () => {
  console.log('listening on *:3000');
});