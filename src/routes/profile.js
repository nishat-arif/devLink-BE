const express = require('express');
const bcrypt = require("bcrypt");
const {userAuth} = require('../middlewares/userAuth')
const {validateEditProfileData} = require('../utils/validations')

const profileRouter = express.Router();

profileRouter.get('/profile/view' , userAuth, async (req,res)=>{ 
    try{
        const {userProfile} = req;
        res.json({ message: "user profile received successfully!", data: userProfile});
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
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
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
      message: `${loggedInUser.firstName}, your profile password updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = profileRouter;