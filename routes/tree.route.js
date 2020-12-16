const express = require("express")
const router = express.Router();
const uploader = require('../config/cloudinary');

const treeModel = require('../models/Tree.model')

router.get('/all', async (req, res, next) => {
    try {
        const allTrees = await treeModel.find();
        res.status(200).json(allTrees)
    } catch (err) {
        res.status(500).json(err)
        next(err)
    }
});


router.post('/create', uploader.single("picture"), async (req, res, next) => {
    if (req.file) {
        req.body.picture = req.file.path
    }
    try {
        const createdTree = await treeModel.create(req.body);
        res.status(201).json(createdTree)
    } catch (err) {
        res.status(500).json(err)
        next(err)
    }
});

router.patch('/:id/edit', uploader.single("picture"), async (req, res, next) => {
    if (req.file) {
        req.body.picture = req.file.path
    }
    try {
        const updatedTree = await treeModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(200).json(updatedTree)
    } catch (err) {
        res.status(500).json(err)
        next(err)
    }
});

router.delete('/:id/delete', async (req, res, next) => {
    try {
        await treeModel.findByIdAndDelete(req.params.id)
        res.sendStatus(200)
    } catch (err) {
        res.status(500).json(err)
        next(err)
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const selectedTree = await treeModel.findById(req.params.id);
        res.status(200).json(selectedTree)
    } catch (err) {
        res.status(500).json(err)
        next(err)
    }
});

module.exports = router