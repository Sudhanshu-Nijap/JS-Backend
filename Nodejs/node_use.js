// const {add,sub} = require("./math")
const fs = require("fs")
const url = require("url")
const http = require("http")
const express = require("express")


// console.log(add(5,7));

//  with express
const app = express();

app.get('/',(req,res)=>{
    return res.send("Hello From Home Page");
})

app.get('/about',(req,res)=>{
    return res.send("Hello From About Page");
})

// app.post('')

// without express
function myHandler(req,res) {
    
    const myurl = url.parse(req.url,true);
    console.log(myurl);
    const q = myurl.query

    const log = `${Date.now()}: New Request Recieve\n`

    fs.appendFile('log.txt',log, (err,data)=>{
    res.end(`Hello from Server\nName: ${q.name} and Age:${q.age}`)

    });
    
}

// Server with node
const myServer = http.createServer(app)

// Port
myServer.listen(8001,()=> console.log("Server Started"))

