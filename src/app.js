const express = require('express');
const cookieParser = require('cookie-parser')
const {connectdb} = require('./config/database')
const {User} = require('./model/user');
const {userAuth} = require('./middlewares/userAuth')
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");

const app = express(); // creates instance of server and server is up when we run the application


app.use(express.json()) // it will handle all the requests and convert to readable format
app.use(cookieParser()); // parses the cookie to make it readable 

app.use("/", authRouter);
app.use("/", profileRouter);

// app.get('/profile' , userAuth, async (req,res)=>{
    
//     try{
//         const {userProfile} = req;
//         res.json({ message: "user profile received successfully!", data: userProfile});
//     }catch(err)
//     {
//         res.status(401).send(err.message)
//     }
// })

app.post('/sendConnectionRequest/:id' , userAuth, async (req,res)=>{
    
    try{
        const {id} = req.params;
        const {userProfile} = req;
        const connectionProfile = await User.findById(id)
        res.json({ message: "connection request send successfully" , fromProfile: userProfile , toProfile: connectionProfile});
    }catch(err)
        {
        res.status(401).send(err.message)
        }
})

app.get('/feed' , async (req,res)=>{
    
    try{
        const users = await User.find({})
        res.json({ message: "all users send successfully" , data :users});
    }catch(err)
    {
        res.status(401).send(err.message)
    }
})

connectdb().
then(()=>{
    app.listen(3000 , ()=>{console.log("server is listening to port 3000")})
})


