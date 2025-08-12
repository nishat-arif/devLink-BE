const express = require('express');
const {adminAuth , userAuth} = require('./middlewares/auth')

const admin = express(); // creates instance of server and server is up when we run the application

admin.use("/admin" , adminAuth) 


admin.get('/user' , userAuth,  (req,res , next)=>{
  try{
    res.send("user data send")
  }catch(err){
     res.status(401).send(err.message ? err.message : "something went wrong ")
  }   
})



admin.get('/admin/getUser' , (req,res , next)=>{

    throw new Error("error in getDtaa")
//   try{
//     console.log("getUser")
//     //res.send("user data get")
//     next();
    
//   }catch(err){
//      res.status(401).send(err.message ? err.message : "something went wrong  thru get ")

//   }
    
})

admin.get('/admin/addUser' , (req,res)=>{
  try{
    console.log("addUser")
    res.send("user data added")
  }catch(err){
     res.status(401).send(err.message ? err.message : "something went wrong ")

  }
    
})

admin.get('/admin/deleteUser' , (req,res)=>{
  try{
    console.log("deleteUser")
    res.send("user data deleted")
  }catch(err){
     res.status(401).send(err.message ? err.message : "something went wrong ")

  }
    
})

admin.use("/" , (err, req, res ,next)=>{
    if(err){
            res.status(400).send("error is catched in use: " + err.message)
        }

    // try{
    //     console.log("use")
    //     res.send("get data successfully thru use")
    //     throw new Error("error is use ")
        
        
    // }catch(err){
    //     res.status(401).send(err.message ? err.message : "something went wrong in use ")

    // }
    
}) 


admin.listen(3002 , ()=>{console.log("server is listening to port 3002")})
