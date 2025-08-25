const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const { Chat } = require("../model/chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const  loggedInUserId = req.userProfile._id;


  try {
    let chat = await Chat.findOne({
      participants: { $all: [loggedInUserId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName photoUrl",
    })


    if (!chat) {
      chat = new Chat({
        participants: [loggedInUserId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    console.error(err);
  }
});

module.exports = chatRouter;