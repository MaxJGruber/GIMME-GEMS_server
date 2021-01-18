const express = require("express");
const router = express.Router();
const UserModel = require("../models/User.model");

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

module.exports = router;
