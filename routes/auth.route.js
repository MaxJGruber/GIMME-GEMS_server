const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/User.model");
const getAge = require("get-age");

const salt = 10;

// ROUTE used by the user to REGISTER/SIGN UP
router.post("/signup", async (req, res, next) => {
  const {
    email,
    password,
    firstName,
    lastName,
    birthDate,
    isNL,
    phoneNumber,
    address,
    agree,
  } = req.body;
  // User's age gets checked; if user is under 18, he will not be able to create an account
  const userAge = getAge(birthDate);
  try {
    const userEmail = await UserModel.findOne({ email });
    if (userEmail) {
      res.status(400).json({ message: "Email Already Taken" });
    } else if (userAge < 18) {
      res.status(400).json({ message: "Too young to use this app" });
    } else {
      // We encrypt password using "bcrypt"
      const hashedPassword = bcrypt.hashSync(password, salt);
      const newUser = {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        birthDate,
        isNL,
        phoneNumber,
        address,
        agree,
      };
      // User gets created in MongoDB
      const createdUser = await UserModel.create(newUser);
      res.status(200);
      req.session.currentUser = createdUser._id;
      res.redirect("/api/auth/isLoggedIn");
    }
  } catch (err) {
    res.status(500);
    next(err);
  }
});

// ROUTE to authenticate user on all routes
router.get("/isLoggedIn", async (req, res, next) => {
  if (!req.session.currentUser)
    return res.status(401).json({ message: "Unauthorized" });

  const id = req.session.currentUser;
  try {
    // Checks user's existence in MongoDB, returns information (WITHOUT password) and populating
    //  the orders array from Orders Model.
    const foundUser = await (
      await UserModel.findById(id).select("-password")
    ).execPopulate("allOrders");
    res.status(200).json(foundUser);
  } catch (err) {
    res.status(500);
    next(err);
  }
});

// ROUTE used by the user to SIGN IN
router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Checks user's existence by checking if email (unique data) exists in MongoDB
    const foundUser = await UserModel.findOne({ email });
    console.log(foundUser);
    // Checks if password input is valid and matches one in MongoDB user "bcrypt"
    const isValidPassword = bcrypt.compareSync(password, foundUser.password);
    if (!foundUser || !isValidPassword) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    req.session.currentUser = foundUser._id;
    res.status(200);
    res.redirect("/api/auth/isLoggedIn");
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
});

// ROUTE used to LOG OUT the user from his current session
router.get("/logout", async (req, res, next) => {
  req.session.destroy(function (err) {
    err
      ? next(err)
      : res.status(200).json({ message: "Succesfully deconnected" });
  });
});

// EDIT PASSWORD DOES NOT WORK
// PROBLEM WITH THE PATCH REQUEST ON THIS ROUTE
// PASSWORD BCRYPT DOES NOT CHANGE IN MONGODB

router.patch("/edit-password", async (req, res, next) => {
  try {
    const { lastPassword, newPassword } = req.body;
    console.log("LP", lastPassword, "NP", newPassword);
    let foundEditUser = await UserModel.findById(req.session.currentUser);
    const isValidEditPassword = bcrypt.compareSync(
      lastPassword,
      foundEditUser.password
    );
    if (!foundEditUser || !isValidEditPassword) {
      return res.status(400).json({ message: "invalid credentials" });
    } else {
      const hashedEditPassword = bcrypt.hashSync(newPassword, salt);
      // console.log(hashedEditPassword);
      // console.log(req.session.currentUser);
      let copyOfUser = { ...foundEditUser };
      copyOfUser.password = hashedEditPassword;
      console.log("FOUND EDIT USER", copyOfUser);
      const updatedUserPass = UserModel.findByIdAndUpdate(
        req.session.currentUser,
        copyOfUser,
        { new: true }
      );
      console.log(updatedUserPass);
      res.status(200);
      // res.redirect("/api/auth/isLoggedIn");
    }
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
});

module.exports = router;
