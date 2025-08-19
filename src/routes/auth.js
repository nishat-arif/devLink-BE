const express = require('express');
const authRouter = express.Router(); //creates authRouter


const {User} = require('../model/user');
const {validateSignUpData} = require('../utils/validations');
const bcrypt = require("bcrypt");

authRouter.post('/signup' , async (req,res)=>{
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
        const token = await savedUser.getJWT();//creating token so when user signsup from client side , he gets logged in automatially  
        res.cookie('authToken' , token, { expires: new Date(Date.now() + 9000000)});
        res.json({ message: "User Added successfully!", data: savedUser });  

    }catch(err)
    {
        res.status(400).send(err.message)
    }
})

authRouter.post('/login' , async (req,res)=>{
    try{
       
        const {emailId , password} = req.body;

        const userData = await User.findOne({emailId : emailId}) //get userData as per the req which contains passwordHash

        if(!userData){
            throw new Error("Invalid user credentials:email")
        }else{
            const isPasswordValid = await userData.validatePassword(password)
            

            if(isPasswordValid){
                const token = await userData.getJWT();

                const {firstName ,lastName, emailId ,age ,gender, photoUrl ,skills ,about} = userData;
                const loggedInData =  {firstName ,lastName, emailId ,age ,gender, photoUrl ,skills ,about}

                res.cookie('authToken' , token, { expires: new Date(Date.now() + 9000000)});
                res.json({ message: firstName + " has logged in successfully!", data: loggedInData });
            }else{
                throw new Error("Invalid user credentials:password")
            }
        }
    }catch(err)
    {
        res.status(400).send(err.message)
    }
})

authRouter.post('/logout' , async (req,res)=>{
    
    // res.cookie('authToken' , null , {expires: new Date(0)});
    res.clearCookie('authToken'); // Clears the cookie named 'authToken'
    res.json({ message: "User logged out successfully!"});  
})

module.exports = authRouter;