var express = require("express")
var route = express.Router()
const userModel = require("../models/userModel")

route.post("/signin", function(req,res){
    res.json("signin")
})

route.post("/signup", function(req,res){
    res.json("signup")
})


module.exports = route;