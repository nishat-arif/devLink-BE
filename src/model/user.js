const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName : {
        type:String,
        required:true,
        maxLength : 20

    },
    lastName : {
        type:String,
        required:true,
        maxLength:20
    },
    emailId : {
        type:String,
        required:true,
        unique:true,
        lowercase: true,
        trim:true
    },
    password : {
        type:String,
        required:true
    },
    photoUrl : {
        type: String,
        default :"https://www.pngitem.com/middle/TRToRow_default-user-image-png-transparent-png/"

    },
    age:{
        type:Number,
        min : 18,
        max : 50
    },
    gender:{
        type:String,
        validate(value){
            if(!["male" , "female" , "others"].includes(value)){
                throw new Error("gender data is not valid")
            }
        }

    },
    skills:{
        type:[String]
    },
    timestamp :{
        type :Date
    }
})

const User = mongoose.model("User" , userSchema)

module.exports= {User}