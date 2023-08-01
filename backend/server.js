const express = require('express');
const { chats } = require('./data/data');

const app = express();

app.get("/route", (req, res)=>{
    res.send("api is running")
})

app.get("/api/chat", (req, res)=>{
    res.send(chats)
})

app.listen(3000, console.log('Hey their'));