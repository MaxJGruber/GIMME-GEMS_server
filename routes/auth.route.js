const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/User.model");
const getAge = require('get-age')

const salt = 10;

router.post('/signup', async (req, res, next) => {
    const { email, password, firstName, lastName, birthDate } = req.body
    const userAge = getAge(birthDate)
    try {
        const userEmail = await UserModel.findOne({ email });
        if (userEmail) {
            res.status(400).json({message: 'Email Already Taken'}) 
        } 
        else if (userAge < 18) {
            res.status(400).json({message: 'Too young to use this app'});
        } else {
            const hashedPassword = bcrypt.hashSync(password, salt);
            const newUser = { email, password: hashedPassword, firstName, lastName, birthDate };
            const createdUser = await UserModel.create(newUser);
            res.status(200).json(createdUser);
            req.session.currentUser = createdUser._id
            // res.redirect('/api/auth/isLoggedIn')
        }
    } catch(err) {
        res.status(500)
        next(err)
    }
    
});

router.get('/isLoggedIn', async (req, res, next) => {
    if (!req.session.currentUser) 
        return res.status(401).json({message: "Unauthorized"})
    
    const id = req.session.currentUser;
    try {
        const foundUser = await UserModel.findById(id).select('-password')
        res.status(200).json(foundUser)
    } catch(err){
        res.status(500)
        next(err)
    }
});

router.post('/signin', async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const foundUser = await UserModel.findOne({email});
        // console.log(foundUser);
        const isValidPassword = bcrypt.compareSync(password, foundUser.password)
        if (!foundUser || !isValidPassword) {
            return res.status(400).json({message: 'invalid credentials'})
        }
        req.session.currentUser = foundUser._id;
        res.status(200).json({message: "user logged In"})
        // res.redirect('/api/auth/isLoggedIn')
        // console.log(req.session.currentUser);
    } catch(err) {
        res.status(500)
        next(err)
    }
})

router.get('/logout', async (req, res, next) => {
    req.session.destroy(function(err) {
        err ? next(err) : res.status(200).json({message: "Succesfully deconnected"})
    })
});

module.exports = router