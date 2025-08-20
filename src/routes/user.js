const express = require('express');
const userRouter = express.Router();
const {userAuth} = require('../middlewares/userAuth');
const {User} = require('../model/user');
const ConnectionRequest = require('../model/connectionRequest')

const showData = "firstName lastName age gender photoUrl skills about"

userRouter.get('/users/requests/received' , userAuth , async (req,res)=>{
    
    try{
       const  loggedInUser = req.userProfile;

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

userRouter.get('/feed' , userAuth , async (req,res)=>{
    
    try{
       const  loggedInUser = req.userProfile;

       const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
                                    $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
                                    }).select("fromUserId  toUserId");

        const hideUsersFromFeed = new Set();

        connectionRequests.forEach((req) => {
                            hideUsersFromFeed.add(req.fromUserId.toString());
                            hideUsersFromFeed.add(req.toUserId.toString());
                            });

        const users = await User.find({
                        $and: [
                            { _id: { $nin: Array.from(hideUsersFromFeed) } },
                            { _id: { $ne: loggedInUser._id } },
                        ],
                        })
                        .select(showData)
                        .skip(skip)
                        .limit(limit);

                        res.json({message: "getting all the users on your feed : ", data : users});
        
    }catch(err)
    {
        res.status(401).send(err.message)
    }
})

module.exports = userRouter;