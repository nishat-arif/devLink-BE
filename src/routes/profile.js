const express = require('express');
const bcrypt = require("bcrypt");
const {userAuth} = require('../middlewares/userAuth')
const {validateEditProfileData} = require('../utils/validations');
const { User } = require('../model/user');

const profileRouter = express.Router();

const showData = "_id firstName lastName age gender photoUrl skills about"

profileRouter.get('/profile/view' , userAuth, async (req,res)=>{ 
    try{
        const {userProfile} = req;
        res.json({ message: "user profile fetched successfully!", data: userProfile});
    }catch(err)
    {
        res.status(401).send(err.message)
    }
})

profileRouter.get('/profile/view/:id' , userAuth, async (req,res)=>{ 
    try{
        const {userProfile} = req;
        const {id} = req.params;

        const loggedInUserProfile = userProfile
        const otherUserProfile = await User.findById({_id:id}).select(showData)
        res.json({ message: "user profile fetched successfully!", data: otherUserProfile});
    }catch(err)
    {
        res.status(401).send(err.message)
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.userProfile;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile is updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.userProfile;

    const oldPassword = loggedInUser.password;
    const newPassword = req.body.password

    const newPasswordHash = await bcrypt.hash(newPassword , 10);

    loggedInUser.password = newPasswordHash;

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile password updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = profileRouter;