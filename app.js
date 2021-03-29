require('dotenv').config();
const express= require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const md5 = require("md5");

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/dataDB",{useNewUrlParser:true});
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});



const User = new mongoose.model("User",userSchema);


app.get("/",function(req,res){
res.render("home");
});
app.get("/login",function(req,res){
res.render("login");
});
app.get("/register",function(req,res){
res.render("register");
});

app.post("/register",function(req,res){
    const newuser= new User({
        email:req.body.username,
        password:md5(req.body.password)
    });
    newuser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    })
})

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=md5(req.body.password);
    User.findOne({email:username},function(err,founduser){
        if(err){
            console.log(err);
        }else{
            if(founduser){
                if(founduser.password===password){
                    res.render("secrets");
                }
            }
        }
    })
});







app.listen(3000,function(){
    console.log("server runnig at 3000");;
})