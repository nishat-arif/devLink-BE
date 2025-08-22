const socket = require("socket.io")  
const {BROWSER_DOMAIN_URL} = require('./constants');
const crypto = require("crypto");

const getSecretRoomId = (loggedInUserId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([loggedInUserId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server)=>{

    //attach socket server to httpserver
    const io= socket(server , {
                                cors:{origin :BROWSER_DOMAIN_URL}
                                });

    //socket server starts listening on connection event and call a handler
    io.on("connection"  , (socket)=>{
        console.log("socket server is listening and waiting for other events")

        // on joinChat event
        socket.on("joinChat" , ({firstName, loggedInUserId , targetUserId})=>{
            
            const roomId = getSecretRoomId(loggedInUserId, targetUserId);
            socket.join(roomId);
        })

        // on sendmessage event
        socket.on("sendMessage" , ({firstName,lastName,photoUrl,loggedInUserId,targetUserId,text})=>{

                                const roomId = getSecretRoomId(loggedInUserId, targetUserId);

                                // this will emit the messagereceived and room is notified and everyone in that room is also notified;
                                io.to(roomId).emit("messageReceived" , {
                                                        firstName , lastName ,photoUrl,  text  
                                                    })
        })

        //on disconnect event
        socket.on("disconnect" , ()=>{})

    })

    
}

module.exports ={initializeSocket}