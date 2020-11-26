var express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");
var nodemailer = require('nodemailer');
const { getMaxListeners } = require("process");
var upload = multer();
var app = express();

app.use(express.static(__dirname+"/public"));
app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'taskone.notchup@gmail.com',
        pass:'task1.notchup'
    }
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(upload.array());
app.post("/",function(req,res){
    var mailOptions = {
        from: 'taskone.notchup@gmail.com',
        to: req.body['parent-email'],
        subject: 'NotchUp Trial Class Booked successfully',
        text: 'Dear ' + req.body['parent-name']+",\n" + req.body['child-name'] +"'s class at " + req.body.dates + " " + req.body.slots + " has been successfully booked."
    }

    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            res.send("Some error was found, please refill the form");
        } else{
            res.send("NotchUp Trial Class Booked successfully");
        }
    })
})

app.listen(3000,function(){
    console.log("Server is running on port 3000");
})
