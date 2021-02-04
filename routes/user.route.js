const express = require("express");
const router = express.Router();
const UserModel = require("../models/User.model");

// ROUTE used by user to edit/update his/her account
router.patch("/edit", async (req, res, next) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.session.currentUser,
      req.body,
      { new: true }
    );
      
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500);
    next(err);
  }
});

// ROUTE used by user to delete his/her account
router.delete("/delete", async (req, res, next) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(
      req.session.currentUser
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500);
    next(err);
  }
});

//ROUTE used by admin to GET all users registered on MongoDB (ADMIN RIGHTS REQUIRED)
router.get("/all", async (req, res, next) => {
  try {
    // GET all users from MongoDB
    const foundUsers = await UserModel.find();
    res.status(200).json(foundUsers);
  } catch (error) {
    res.status(500);
    next(error);
  }
});

module.exports = router;
