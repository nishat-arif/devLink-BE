const express = require('express');
const {connectdb} = require('./config/database')
const {User} = require('./model/user');
const { ReturnDocument } = require('mongodb');

const app = express(); // creates instance of server and server is up when we run the application

app.use(express.json()) // it will handle all the requests and convert to readable format

// app.get('/user' , (req,res)=>{
//   try{
//     res.send("user data send")
//   }catch(err){
//      res.status(401).send(err.message ? err.message : "something went wrong in post call")

//   }
    
// })

app.post('/signup' , async (req,res)=>{
    const data = req.body; //dynamic data to be added from req body
    try{
        const user = new User(data); // creating the instance of data with User Model
        await user.save();          // saving the data to db
        res.send("data added successfully") // send the response back to user 
    }catch(err)
    {
        res.status(401).send(err.message ? err.message : "something went wrong in post call")
    }
})

app.get('/feed' , async (req,res)=>{
    
    try{
        const users = await User.find({})
        res.send(users)
    }catch(err)
    {
        res.status(401).send(err.message ? err.message : "something went wrong in post call")
    }
})

app.get('/user/:userId' , async (req,res)=>{

    const {userId} = req.params;
    
    try{
        const users = await User.find({_id : userId})
        res.send(users)
    }catch(err)
    {
        res.status(401).send("user does not exit ")
    }
})

app.delete('/user/:userId' , async (req,res)=>{

    const {userId} = req.params;
    
    try{
        const users = await User.findByIdAndDelete(userId)
        res.send("user deleted succesfully")
    }catch(err)
    {
        res.status(401).send("can not delete user")
    }
})

app.patch('/user/:userId' , async (req,res)=>{

    const {userId} = req.params;
    const updatedData = req.body;

    const fieldsAllowedToUpdate = ['firstName' , 'lastName' , 'gender' , 'skills' , 'photoUrl' , 'age' , 'gender', 'skills'];

    try{

        const isUpdateAllowed = Object.keys(updatedData).every(k => fieldsAllowedToUpdate.includes(k));

        if(!isUpdateAllowed){   
            res.status(401).send("update not allowed")
        }

        if(updatedData?.skills.length>5){
            throw new Error('you can not add skills more than 5')
        }

        const users = await User.findByIdAndUpdate(userId , updatedData , {returnDocument :'after',runValidators:true})
        
        res.send("user updated succesfully : " + users)
    }catch(err)
    {
        res.status(401).send("can not update user : " + err.message)
    }
})

// app.post('/user' , (req,res)=>{
//     const data = req.body
//     try{
//         res.send("data added successfully")
//     }catch(err)
//     {
//         res.status(401).send(err.message ? err.message : "something went wrong in post call")
//     }
// })

// app.delete('/user' , (req,res) => {
//     try{
//        res.send("data deleted successfully") 
//     }catch{
//         res.status(401).send(err.message ? err.message : "something went wrong in delete call")
//     }
// })

// app.use('/hello' , (req , res)=>{
//     res.send("Hello path is accessed")


// })

// app.use('/' , (req , res)=>{
//     res.send("Hello from server...... on port 3000")
// })

connectdb().
then(()=>{
    console.log("connected to database successfully")
    app.listen(3000 , ()=>{console.log("server is listening to port 3000")})
})


