var express = require("express")
var route = express.Router()
const gameModel = require("../models/gameModel")


// game/625a406236f449f3bb1606ac good url
route.get("/:gameId", (req,res) =>{
    //console.log(process.cwd() + "/templates/game.html")
    //res.json("hi")
    console.log(req.params.gameId)
    gameModel.findOne({ 'id': req.params.gameId }, function (err, game) {
        if (err){
            res.json("doesn't exist go back please")
        }
        else{
            console.log(game)
            res.sendFile(process.cwd() + "/templates/game.html")
        }
    })
})

route.get("/finished/:gameId", (req,res) =>{
    //console.log(process.cwd() + "/templates/game.html")
    //res.json("hi")
    console.log(req.params.gameId)
    gameModel.findOne({ 'id': req.params.gameId }, function (err, game) {
        if (err){
            res.json("doesn't exist go back please")
        }
        else{
            console.log(game)
            res.sendFile(process.cwd() + "/templates/finishedGame.html")
        }
    })
})

route.get("/status/:gameId", (req,res) =>{
    //console.log(process.cwd() + "/templates/game.html")
    //res.json("hi")
    console.log(req.params.gameId)
    gameModel.findOne({ 'id': req.params.gameId }, function (err, game) {
        if (err){
            res.json("doesn't exist go back please")
        }
        else{
            console.log(game)
            res.json({gameStatus: game})
            //res.sendFile(process.cwd() + "/templates/finishedGame.html")
        }
    })
})

// gives the user an extra point
route.post("/correct/:gameId", (req,res) =>{
    //console.log(process.cwd() + "/templates/game.html")
    //res.json("hi")
    //console.log(req.params.gameId)

    // you need to change the username
    gameModel.findOneAndUpdate({ 'id': req.params.gameId }, {"score": {"username": req.body.score}}, function (err, game) {
        if (err){
            res.json("doesn't exist go back please")
        }
        else{
            console.log(game)
            res.json({"complete": true})
        }
    })
})

route.post("/start", (req,res)=>{
    console.log(req.body.celebrities.length)
    var model = new gameModel({
        owner: "player1",
        players: ["player1"],
        celebrities: req.body.celebrities,
        type: "singlePlayer",
        rounds: req.body.celebrities.length * 3
    });
    model.save((err, message) => {
        if (err) {
            console.log(err);
            res.status(404).json({ error: err })
        }
        //console.log(message);
        else {
            res.json({ error: null, message: message })
        }
    });
    //res.json({"game started": true})
})

module.exports = route