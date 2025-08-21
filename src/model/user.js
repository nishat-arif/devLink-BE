const mongoose = require('mongoose');
const validator  = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");



const userSchema = new mongoose.Schema(
    {
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
            default :"https://geographyandyou.com/images/user-profile.png",
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
            enum: {
            values: ["male", "female", "other"],
            message: `{VALUE} is not a valid gender type`,
        },
        // validate(value) {
        //   if (!["male", "female", "others"].includes(value)) {
        //     throw new Error("Gender data is not valid");
        //   }
        // },

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

        }
    },
    {
        timestamps : true
    }
)

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, process.env.JWT_PRIVATE_KEY, {expiresIn: "7d",}); // creates jwt token

  return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

const User = mongoose.model("User" , userSchema)

module.exports= {User}