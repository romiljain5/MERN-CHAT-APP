const express = require('express');
const { chats } = require('./data/data');
const dotEnv = require('dotenv');

dotEnv.config();

const app = express();

app.get("/route", (req, res)=>{
    res.send("api is running")
})

app.get("/api/chat", (req,res)=>{
    if(req.query.id){
        console.log(req.query.id);
        const singleId = chats.find(chat => chat._id === req.query.id);
        res.send(singleId);
    }
    res.send(chats);
})

const port = process.env.PORT || 3000
app.listen(port, console.log(`Server started on port ${port}`));