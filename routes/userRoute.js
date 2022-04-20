var express = require("express")
var route = express.Router()
const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")

route.post("/signin", function(req,res){
    userModel.findOne({"email": req.body.email}, function(err, message){
        if(err){
            console.log(err)
            res.json({error: true})
        }
        else{
            bcrypt.compare(req.body.password, message.password, function(error, result) {
                if(result){
                    req.session.userInfo = message
                    res.json({message: message})
                }
                else{
                    console.log(result)
                    res.json({error: true})
                }
            })
        }
    })
    //res.json("signin")
})

route.post("/signup", function(req,res){
    var saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    bcrypt.hash(req.body.password, salt, function(err, hash) {
        if(err){res.status(404).json({error: err})}
        else{
            var model = new userModel({
                name: req.body.name,
                email: req.body.email,
                password: hash, 
                username: req.body.username,
            })
            model.save((err, message) =>{
                if (err) {
                    //console.log(err);
                    res.json({error:err})
                }
                else{
                  console.log("Message: " + message)
                  req.session.userInfo = message
                  res.json({message: message})
                }
            })
        }
    });
    //res.json("signup")
})

route.get("/creditials", function(req,res){
    res.sendFile(process.cwd() + "/templates/signin_signup.html")
})


module.exports = route;