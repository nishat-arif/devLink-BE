const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')

const {connectdb} = require('./config/database')
const {User} = require('./model/user');
const {validateSignUpData} = require('./utils/validations');
const {userAuth} = require('./middlewares/userAuth')
const {JWT_PRIVATE_KEY} = require('./utils/constants')

const app = express(); // creates instance of server and server is up when we run the application


app.use(express.json()) // it will handle all the requests and convert to readable format
app.use(cookieParser()); // parses the cookie to make it readable 

// app.get('/user' , (req,res)=>{
//   try{
//     res.send("user data send")
//   }catch(err){
//      res.status(401).send(err.message ? err.message : "something went wrong in post call")

//   }
    
// })

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

        console.log("saved" , savedUser)
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
            const isPasswordValid = await bcrypt.compare(password ,userData.password )

            if(isPasswordValid){
                const token = await jwt.sign({ _id: userData._id }, JWT_PRIVATE_KEY, {expiresIn: "7d",}); // creates jwt token
  
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
        console.log("connectionProfile",connectionProfile )
        

        res.json({ message: "connection request send successfully" , fromProfile: userProfile , toProfile: connectionProfile});
    }catch(err)
    {
        res.status(401).send(err.message)
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

    const fieldsAllowedToUpdate = ['firstName' , 'lastName' , 'gender' , 'skills' , 'photoUrl' , 'age' , 'gender'];

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


