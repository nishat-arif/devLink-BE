const express = require('express');
const cookieParser = require('cookie-parser')
const {connectdb} = require('./config/database')
const {User} = require('./model/user');
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require('./routes/user');

const app = express(); // creates instance of server and server is up when we run the application

app.use(express.json()) // it will handle all the requests and convert to readable format
app.use(cookieParser()); // parses the cookie to make it readable 

app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);

connectdb().
then(()=>{
    app.listen(3000 , ()=>{console.log("server is listening to port 3000")})
})


