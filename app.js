const express = require("express");
const {spawn} = require('child_process');
const app = express();
const server = require('http').Server(app);
const bodyParser = require("body-parser");

app.use(express.static("Assets"));
app.use(bodyParser.urlencoded({extended: true}));
var dataToSend;
app.get("/", function(req, res){
    
    res.render("index.ejs", {sum: dataToSend});
    dataToSend = null;
})

app.post("/", function(req, res){
    let num1 = req.body.number1;
    let num2 = req.body.number2;
    
    // spawn new child process to call the python script
    const python = spawn('python', ['script2.py',num1,num2]);
    // collect data from script
    python.stdout.on('data', function (data) {
     console.log('Pipe data from python script ...');
     dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.redirect("/");
    });
})

server.listen(3000, function(){
    console.log("Server Started at port 3000");
})