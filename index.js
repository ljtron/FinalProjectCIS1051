const express = require('express')
const http = require('http');
const app = express()
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const gameModel = require("./models/gameModel")

// random stuff
var dummyData = require("./dummyData.json")

var mongoDB = process.env.MongoDBUri;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());

// routes
const gameRoute = require("./routes/gameRoute")

app.use("/game", gameRoute)




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

  socket.on("gameSingle", message =>{
    console.log(message)
    //dataEmit = {}
    if(message['start'] == true){
      socket.join(message['roomId'])

      gameModel.findOne({ 'id': message['roomId'] }, function (err, game) {
        if (err){
            res.json("doesn't exist go back please")
        }
        else{
            console.log("The is the game(start): " + game)
            var keys = Object.keys(dummyData)
            var dummycelebs = []

            var dataEmit = {
              "tweet": dummyData['Bill Gates'].tweets[0],
              "celebs": [],
              "answer": "",
              "done": false
            }

            for(var i=0; i<4; i++){


              var celebritySelected = keys[Math.floor(Math.random()*keys.length)]

              // selects the celebrity we are going to look for in the game
              if(i == 0){
                dataEmit["tweet"] = dummyData[celebritySelected].tweets[0]
                dataEmit["answer"] = celebritySelected
              }
              if(dummycelebs.indexOf(celebritySelected) >= 0){
                celebritySelected = keys[Math.floor(Math.random()*keys.length)]
              }
            dummycelebs.push(celebritySelected)
            }

            dataEmit["celebs"] = dummycelebs

            console.log(dummycelebs)
            //res.sendFile(process.cwd() + "/templates/game.html")
            io.in(message['roomId']).emit("gameSingle", dataEmit)
        }
      })
      
    }
    else if(message['next'] == true){
      gameModel.findOne({ 'id': message['roomId']}, function (err, game) {
        if (err){
            res.json("doesn't exist go back please")
        }
        else{
            console.log("This is the game: " + game)
            console.log(message['round'])
            console.log(game.rounds)
            if(message['round'] == game.rounds){
              io.in(message['roomId']).emit("gameSingle", {done: true})
            }
            var keys = Object.keys(dummyData)
            var dummycelebs = []

            var dataEmit = {
              "tweet": dummyData['Bill Gates'].tweets[0],
              "celebs": [],
              "answer": "",
              "done": false
            }

            for(var i=0; i<4; i++){


              var celebritySelected = keys[Math.floor(Math.random()*keys.length)]

              // selects the celebrity we are going to look for in the game
              if(i == 0){
                dataEmit["tweet"] = dummyData[celebritySelected].tweets[0]
                dataEmit["answer"] = celebritySelected
              }
              if(dummycelebs.indexOf(celebritySelected) >= 0){
                celebritySelected = keys[Math.floor(Math.random()*keys.length)]
              }
            dummycelebs.push(celebritySelected)
            }

            dataEmit["celebs"] = dummycelebs

            console.log(dummycelebs)
            //res.sendFile(process.cwd() + "/templates/game.html")
            io.in(message['roomId']).emit("gameSingle", dataEmit)
        }
      })

      //console.log("null")
    }
    //io.in(message['roomId']).emit("gameSingle", dataEmit)
  })

});

server.listen(port, () => {
  console.log('listening on *:3000');
});