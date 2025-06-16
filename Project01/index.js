const express = require("express")
const users = require("./MOCK_DATA.json")
const app = express();
const PORT = 8000;
const fs = require("fs");

// middleware
app.use(express.urlencoded({extended:false})) // it checks Headers (x-www-form-urlencoded)
app.use(express.json());

// custom middleware
app.use((req,res,next)=>{
    console.log("Middleware 1")
    fs.appendFile("log.txt",`\n${Date.now()} , ${req.path} , ${req.ip} , ${req.method}`,
    (err,data)=>{
        next();
    }
);
});

// Routes
app.get('/users',(req,res)=>{
    const html = `
    <ul>
        ${users.map((u) => `<li>${u.first_name}</li>`).join("")}
    </ul>
    `
    return res.send(html);
})

app.get('/api/users',(req,res)=>{
    res.setHeader("X-CustomHeader","Sudhanshu"); // Custom Header
    return res.json(users);
})

app.route('/api/users/:id')
.get((req,res)=>{
    const id = Number(req.params.id);
    const user = users.find((u) => u.id === id);  //u is the element
    if (user){
        return res.json(user);   
    }
    return res.status(404).json(user);
})
.patch((req,res)=>{
    const id = Number(req.params.id);
    const body = req.body
    
    const user = users.find((u) => u.id === id);
    if (user){
        Object.assign(user, body);
    } 
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
        return res.json({status:"Success"});
    });
})
.put((req,res)=>{
    const id = Number(req.params.id);
    const body = req.body

    const index = users.findIndex((u) => u.id === id);
    if (index){
        users[index] = {id,...body}
    }
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
        return res.json({status:"Success"});
    });
})
.delete((req,res)=>{
    const id = Number(req.params.id);
    const index = users.findIndex((u) => u.id === id); 
    
    users.splice(index, 1);
    
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
        return res.json({status:"Success"});
    });
})

app.post('/api/users',(req,res)=>{
    const body = req.body
    console.log("Body",body);

    if (!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title){
        return res.status(400).json({"msg":"All fields are required!"});
    }

    const newUser = {id: users.length+1,...body};
    users.push(newUser);
    
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
        return res.status(201).json({status:"Success",id:newUser.id});
    });     
})
 
 

app.listen(PORT, ()=>console.log(`Server Started at ${PORT}`))