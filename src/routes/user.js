const express = require('express');
const userRouter = express.Router();
const {userAuth} = require('../middlewares/userAuth');
const {User} = require('../model/user');
const ConnectionRequest = require('../model/connectionRequest')

userRouter.get('/users/requests/received' , userAuth , async (req,res)=>{
    
    try{
       const  loggedInUser = req.userProfile;

       const showData = "firstName lastName age gender photoUrl skills about"

       const connectionRequests = await ConnectionRequest.find({
                                                        toUserId: loggedInUser._id,
                                                        status: "interested",
                                                        }).populate("fromUserId" ,showData);
    if(connectionRequests?.length==0){
        res.json({message: "No pending Requests",data: connectionRequests});
    }else{
        res.json({message: "Pending Requests fetched successfully",data: connectionRequests,});
    }
        
    }catch(err)
    {
        res.status(401).send(err.message)
    }
})

userRouter.get('/users/connections' , userAuth , async (req,res)=>{
    
    try{
       const  loggedInUser = req.userProfile;

       const showData = "firstName lastName age gender photoUrl skills about"

       const connectionRequests = await ConnectionRequest.find(
                                   {$or : [{toUserId: loggedInUser._id, status: "accepted"},
                                            {fromUserId: loggedInUser._id, status: "accepted"}
                                            ]
                                    }).populate("fromUserId" ,showData)
                                    .populate("toUserId" ,showData);

    if(connectionRequests?.length==0){
        res.json({message: "there are no connections",data: connectionRequests});

    }else{

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
            });
        res.json({message: "getting all your connections: ", data});
    }
        
    }catch(err)
    {
        res.status(401).send(err.message)
    }
})

module.exports = userRouter;