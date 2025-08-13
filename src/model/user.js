const mongoose = require('mongoose');
const validator  = require('validator');

const userSchema = new mongoose.Schema({
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
        trim:true,
        validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("emailId is not valid......")
                }
    }
    },
    password : {
        type:String,
        required:true,
        validate(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("password is not valid....")
                }
    }
    },
    photoUrl : {
        type: String,
        default :"https://www.pngitem.com/middle/TRToRow_default-user-image-png-transparent-png/",
        validate(value){
                if(!validator.isURL(value)){
                    throw new Error("photo url is not valid...")
                }
        }


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
                throw new Error("gender data is not valid....")
            }
        }

    },
    skills:{
        type:[String],
        validate(value){
            if(value.length>5){
                throw new Error('you can not add more than 5 skills')
            }}
    }   ,
    about : {
        type : String,
        minLength: 20,
        maxLength : 500

    },
    timestamp :{
        type :Date
    }
})

const User = mongoose.model("User" , userSchema)

module.exports= {User}