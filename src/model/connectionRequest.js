const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
    {
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'User'
    },

    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'User'
    } ,

    status : {
        type : String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status`,
            },
        required : true

    },

    timestamp : {
        type : Date
    }
}
);

// pre automatically gets called just before 'save' event is called
// (means called just before document is saved to db )
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // Check if the fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself!");
  }
  next();
});

const ConnectionRequestModel = mongoose.model("ConnectionRequest" ,connectionRequestSchema);

module.exports = ConnectionRequestModel;