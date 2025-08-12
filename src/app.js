const express = require('express');

const app = express(); // creates instance of server

app.use('/hello' , (req , res)=>{
    res.send("Hello path is accessed")
})

app.use('/' , (req , res)=>{
    res.send("Hello from server...... on port 3000")
})



app.listen(3000 , ()=>{console.log("server is listening to port 3000")})
