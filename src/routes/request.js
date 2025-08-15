const express = require('express');
const {userAuth} = require('../middlewares/userAuth');
const {User} = require('../model/user');
const ConnectionRequest = require('../model/connectionRequest')

const requestRouter = express.Router();

requestRouter.post('/request/send/:status/:toUserId' , userAuth, async (req,res)=>{   
    try{
        const {status , toUserId} = req.params;
        const {userProfile} = req;
        const fromUserId =  userProfile._id

        const validStatus = ["interested" , "ignored"];
        if(!validStatus.includes(status)){
            throw new Error("status is not valid in the requst")
        }

        const toUser = await User.findById(toUserId);

        if (!toUser) {
            throw new Error("User  profile does not exist!");
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if(existingConnectionRequest){
        throw new Error("connection already exists with this profile")
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
      })

      await connectionRequest.save();

      res.json({ message: toUser.firstName +" profile is " + status +" by " + userProfile.firstName , data: connectionRequest});

    }catch(err)
        {
        res.status(401).send(err.message)
        }
})

requestRouter.post('/request/review/:status/:requestId' , userAuth, async (req,res)=>{   
    try{
        const {status , requestId} = req.params;
        const {userProfile} = req;


        const validStatus = ["accepted" , "rejected"];
        if(!validStatus.includes(status)){
            throw new Error("status is not valid in the request")
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId : userProfile._id,
            status : "interested"
        });

        if(!connectionRequest){
            throw new Error("connection request does not exits");
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

      res.json({ message: "connection request is " + status + " for", data});

    }catch(err)
        {
        res.status(401).send(err.message)
        }
})

module.exports = requestRouter;