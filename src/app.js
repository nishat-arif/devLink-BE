const express = require('express');

const app = express(); // creates instance of server and server is up when we run the application

app.use(express.json()) // it will handle all the requests and convert to readable format

app.get('/user' , (req,res)=>{
  try{
    res.send("user data send")
  }catch(err){
     res.status(401).send(err.message ? err.message : "something went wrong in post call")

  }
    
})

app.post('/user' , (req,res)=>{
    const data = req.body
    try{
        res.send("data added successfully")
    }catch(err)
    {
        res.status(401).send(err.message ? err.message : "something went wrong in post call")
    }
})

app.delete('/user' , (req,res) => {
    try{
       res.send("data deleted successfully") 
    }catch{
        res.status(401).send(err.message ? err.message : "something went wrong in delete call")
    }
})

// app.use('/hello' , (req , res)=>{
//     res.send("Hello path is accessed")


// })

// app.use('/' , (req , res)=>{
//     res.send("Hello from server...... on port 3000")
// })

app.listen(3000 , ()=>{console.log("server is listening to port 3000")})
