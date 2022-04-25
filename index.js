const express = require('express')
const http = require('http');
const app = express()
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
var cookieSession = require('cookie-session')
const gameModel = require("./models/gameModel")
const axios = require("axios")

// random stuff
var dummyData = require("./dummyData.json")

var mongoDB = process.env.MongoDBUri; // insert a mongodb uri of your choice
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

// routes
const gameRoute = require("./routes/gameRoute")
const userRoute = require("./routes/userRoute")

app.use("/game", gameRoute)
app.use("/user", userRoute)
//app.use(express.static('templates'))
app.use('/assets', express.static(__dirname + '/templates/assets'));




const port = 8000

app.get('/', (req, res) => {
  console.log(req.session.userInfo)
  if(req.session.userInfo != null){
    res.sendFile(__dirname + '/templates/index.html')
  }
  else{
    res.redirect("/user/creditials")
  }
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
      console.log("start")
      socket.join(message['roomId'])

      gameModel.findOne({ _id: message.roomId }, function (err, game) {
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

            var celebritySelected = game.celebrities[Math.floor(Math.random()*game.celebrities.length)]
            var tweeterId = dummyData[celebritySelected].twitterId
            var url = "https://api.twitter.com/2/users/" + tweeterId + "/tweets"
            dataEmit["answer"] = celebritySelected
            dummycelebs.push(celebritySelected)

            axios({
                method:'get',
                url,
                headers: {
                  Authorization: 'Bearer ' + process.env.twitterApiBearerToken //the token is a variable which holds the token
                },
            })
            .then(function (response) {
                console.log(response.data.data[0])
                console.log(celebritySelected)
                dataEmit["tweet"] = response.data.data[Math.floor(Math.random()*response.data.data.length)].text
                //dataEmit["answer"] = celebritySelected
                //dummycelebs.push(celebritySelected)

                for(var i=0; i<3; i++){
                  var celebritySelected = game.celebrities[Math.floor(Math.random()*game.celebrities.length)]
                  dummycelebs.push(celebritySelected)
                }

                dataEmit["celebs"] = dummycelebs
                io.in(message['roomId']).emit("gameSingle", dataEmit)
                //console.log("by the find and update" + game)

                gameModel.findOneAndUpdate({_id: message.roomId}, { $push: { questions: dataEmit } }, function(error, result){
                  console.log("error when the data is pushed " + error)
                  console.log("first call when the data is pushed " + result)
                })

                //return response.data
                //res.send(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });

            // for(var i=0; i<4; i++){


            //   var celebritySelected = keys[Math.floor(Math.random()*keys.length)]

            //   // selects the celebrity we are going to look for in the game
            //   if(i == 0){
            //     var tweeterId = "23613479"
            //     var url = "https://api.twitter.com/2/users/" + tweeterId + "/tweets"
            //     axios({
            //         method:'get',
            //         url,
            //         headers: {
            //           Authorization: 'Bearer ' + process.env.twitterApiBearerToken //the token is a variable which holds the token
            //         },
            //     })
            //     .then(function (response) {
            //         console.log(response.data.data[0])
            //         dataEmit["tweet"] = response.data.data[Math.floor(Math.random()*response.data.data.length)].text

            //         //return response.data
            //         //res.send(JSON.stringify(response.data));
            //     })
            //     .catch(function (error) {
            //         console.log(error);
            //     });
            //     //dataEmit["tweet"] = dummyData[celebritySelected].tweets[0]
            //     dataEmit["answer"] = celebritySelected
            //   }
            //   if(dummycelebs.indexOf(celebritySelected) >= 0){
            //     celebritySelected = keys[Math.floor(Math.random()*keys.length)]
            //   }
            // dummycelebs.push(celebritySelected)
            // }

            // dataEmit["celebs"] = dummycelebs

            // console.log(dummycelebs)
            //res.sendFile(process.cwd() + "/templates/game.html")
            //io.in(message['roomId']).emit("gameSingle", dataEmit)
        }
      })
      
    }
    else if(message['next'] == true){
      gameModel.findOne({ _id: message.roomId}, function (err, game) {
        if (err){
            res.json("doesn't exist go back please")
        }
        else{
            console.log("This is the game: " + game)
            console.log(message['round'])
            console.log(game.rounds)
            if(message['round'] > game.rounds){
              io.in(message['roomId']).emit("gameSingle", {done: true})
            }
            else{
              var keys = Object.keys(dummyData)
              var dummycelebs = []

              var dataEmit = {
                "tweet": dummyData['Bill Gates'].tweets[0],
                "celebs": [],
                "answer": "",
                "done": false
              }

              var celebritySelected = game.celebrities[Math.floor(Math.random()*game.celebrities.length)]
              var tweeterId = dummyData[celebritySelected].twitterId
              var url = "https://api.twitter.com/2/users/" + tweeterId + "/tweets"
              dataEmit["answer"] = celebritySelected
              dummycelebs.push(celebritySelected)

              axios({
                  method:'get',
                  url,
                  headers: {
                    Authorization: 'Bearer ' + process.env.twitterApiBearerToken //the token is a variable which holds the token
                  },
              })
              .then(function (response) {
                  console.log(response.data.data[0])
                  console.log(celebritySelected)
                  dataEmit["tweet"] = response.data.data[Math.floor(Math.random()*response.data.data.length)].text
                  //dataEmit["answer"] = celebritySelected
                  //dummycelebs.push(celebritySelected)

                  for(var i=0; i<3; i++){
                    var celebritySelected = game.celebrities[Math.floor(Math.random()*game.celebrities.length)]
                    dummycelebs.push(celebritySelected)
                  }

                  dataEmit["celebs"] = dummycelebs
                  io.in(message['roomId']).emit("gameSingle", dataEmit)

                  gameModel.findOneAndUpdate({_id: message.roomId}, { $push: { questions: dataEmit } }, function(error, result){
                    console.log("error when the data is pushed " + error)
                    console.log("second call when the data is pushed " + result)
                  })

                  //return response.data
                  //res.send(JSON.stringify(response.data));
              })
              .catch(function (error) {
                  console.log(error);
              });
            }

            // for(var i=0; i<4; i++){


            //   var celebritySelected = keys[Math.floor(Math.random()*keys.length)]

            //   // selects the celebrity we are going to look for in the game
            //   if(i == 0){
            //     dataEmit["tweet"] = dummyData[celebritySelected].tweets[0]
            //     dataEmit["answer"] = celebritySelected
            //   }
            //   if(dummycelebs.indexOf(celebritySelected) >= 0){
            //     celebritySelected = keys[Math.floor(Math.random()*keys.length)]
            //   }
            // dummycelebs.push(celebritySelected)
            // }

            // dataEmit["celebs"] = dummycelebs

            // console.log(dummycelebs)
            // //res.sendFile(process.cwd() + "/templates/game.html")
            // io.in(message['roomId']).emit("gameSingle", dataEmit)
        }
      })

      //console.log("null")
    }
    //io.in(message['roomId']).emit("gameSingle", dataEmit)
  })

});

server.listen(port, () => {
  console.log('listening on *:8000');
});