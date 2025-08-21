const jwt = require("jsonwebtoken");
const {User} = require("../model/user")

const userAuth = async(req,res,next)=>{

    try{

        const {authToken} = req.cookies;

        if(authToken){
            const decodeToken = await jwt.verify(authToken ,process.env.JWT_PRIVATE_KEY );
            const {_id} = decodeToken;
            const userProfile = await User.findById(_id);
            if(userProfile){
                req.userProfile = userProfile;
                next();
            }else{
                throw new Error("user profile not found")
            }
        }else{
            return res.status(401).send("Please Login !!")
        }   

    }catch(err){
        res.status(400).send(err.message)
    }


}

module.exports = {userAuth}