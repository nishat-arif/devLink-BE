const express = require('express');
const cookieParser = require('cookie-parser')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {connectdb} = require('./config/database')
const {User} = require('./model/user');
const {validateSignUpData} = require('./utils/validations');
const {userAuth} = require('./middlewares/userAuth')
const {JWT_PRIVATE_KEY} = require('./utils/constants')


const app = express(); // creates instance of server and server is up when we run the application


app.use(express.json()) // it will handle all the requests and convert to readable format
app.use(cookieParser()); // parses the cookie to make it readable 

app.post('/signup' , async (req,res)=>{
    try{
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        
        //   Creating a new instance of the User model
        const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
        });


        // save the data to database
        const savedUser = await user.save();
        res.json({ message: "User Added successfully!", data: savedUser });  

    }catch(err)
    {
        res.status(400).send(err.message)
    }
})

app.post('/login' , async (req,res)=>{
    try{
       
        const {emailId , password} = req.body;

        const userData = await User.findOne({emailId : emailId}) //get userData as per the req which contains passwordHash

        if(!userData){
            throw new Error("Invalid user credentials")
        }else{
            const isPasswordValid = await userData.validatePassword(password , userData.password)

            if(isPasswordValid){
                const token = await userData.getJWT();
  
                res.cookie('authToken' , token) , { expires: new Date(Date.now() + 9000000)};
                res.json({ message: "User logged in successfully!", data: userData });
            }else{
                throw new Error("Invalid user credentials")
            }
        }
    }catch(err)
    {
        res.status(400).send(err.message)
    }
})

app.get('/profile' , userAuth, async (req,res)=>{
    
    try{
        const {userProfile} = req;
        res.json({ message: "user profile received successfully!", data: userProfile});
    }catch(err)
    {
        res.status(401).send(err.message)
    }
})

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


