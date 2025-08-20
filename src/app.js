const express = require('express');
const cookieParser = require('cookie-parser')
const {connectdb} = require('./config/database')
const {User} = require('./model/user');
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require('./routes/user');
const cors = require('cors')
const {BROWSER_DOMAIN_URL} = require('../src/utils/constants')

const app = express(); // creates instance of server and server is up when we run the application

//to fix cors issue between backend apis and webapi , make cors call as below :

//we need to whitelist our web domain url here while fixing cors issue if we are making "axios" call from web api , otherwise cookies will not be set in browser
app.use(cors({
            origin :BROWSER_DOMAIN_URL ,
            credentials :true}
        ));

//app.use(cors()); // we dont need to provide cors options to whitelist our web domain url explicity in case we are making 'fetch' call from web api

app.use(express.json()) // it will handle all the requests and convert to readable format
app.use(cookieParser()); // parses the cookie to make it readable 

app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);

connectdb().
then(()=>{
    console.log("database connection established successfully....")
    app.listen(3000 , ()=>{console.log("server is listening to port 3000...")})
})


