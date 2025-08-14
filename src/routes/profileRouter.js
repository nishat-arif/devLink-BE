const express = require('express');
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

profileRouter.get('/profile/edit' , userAuth, async (req,res)=>{ 
    try{
        const {userProfile} = req;
        res.json({ message: "user profile updated successfully!", data: userProfile});
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

module.exports = profileRouter;