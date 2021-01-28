const express = require("express");
const router = express.Router();
const uploader = require("../config/cloudinary");

const treeModel = require("../models/Tree.model");

// ROUTE used to GET all trees and render them accordingly
router.get("/all", async (req, res, next) => {
  try {
    // GET all trees from MongoDB
    const allTrees = await treeModel.find();
    res.status(200).json(allTrees);
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
});

// ROUTE used to create a new tree (ADMIN RIGHT REQUIRED)
router.post("/create", uploader.single("picture"), async (req, res, next) => {
  if (req.file) {
    req.body.picture = req.file.path;
  }
  try {
    // Tree gets created in MongoDB with information added by admin
    const createdTree = await treeModel.create(req.body);
    res.status(201).json(createdTree);
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
});

// ROUTE used to EDIT/UPDATE an existing tree (ADMIN RIGHT REQUIRED)
router.patch(
  "/:id/edit",
  uploader.single("picture"),
  async (req, res, next) => {
    if (req.file) {
      req.body.picture = req.file.path;
    }
    try {
      // Tree gets updated in MongoDB with information changed by admin
      const updatedTree = await treeModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedTree);
    } catch (err) {
      res.status(500).json(err);
      next(err);
    }
  }
);

// ROUTE used to DELETE an existing tree (ADMIN RIGHT REQUIRED)
router.delete("/:id/delete", async (req, res, next) => {
  try {
    // Tree gets deleted in MongoDB by admin
    await treeModel.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
});

// ROUTE used to search for selected existing tree by objectID
router.get("/:id", async (req, res, next) => {
  try {
    // GET selected tree from MongoDB
    const selectedTree = await treeModel.findById(req.params.id);
    res.status(200).json(selectedTree);
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
});

module.exports = router;
